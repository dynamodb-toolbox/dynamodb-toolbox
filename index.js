// TODO: Add delimiter option

// TODO: prevent reserved field names ?

// TODO: Add date type

const DynamoDB = require('aws-sdk/clients/dynamodb')
const documentClient = new DynamoDB.DocumentClient()
const validTypes = ['string','boolean','number','list','map','binary','set']

class Model {

  constructor(name,model) {
    if (typeof model !== 'object' || Array.isArray(model))
      error('Please provide a valid model definition')
    this.Model = parseModel(name,model)
  }

  // returns the model object
  model() {
    return this.Model
  }

  field(field) {
    // console.log(this.model.schema);
    return this.Model.schema[field] && this.Model.schema[field].mapped ? this.Model.schema[field].mapped
      : this.Model.schema[field] ? field
      : error(`'${field}' does not exist or is an invalid alias`)
  }

  partitionKey() { return this.Model.partitionKey }
  sortKey() { return this.Model.sortKey }

  parse(input,omit=[]) {
    // Load the schema
    let { schema, linked } = this.Model

    // Assume standard response from DynamoDB
    let data = input.Item || input.Items || input

    if (Array.isArray(data)) {
      return data.map(item => formatItem(schema,linked,item,omit))
    } else {
      return formatItem(schema,linked,data,omit)
    }
  }

  get(item={},params={}) {
    // Extract schema and merge defaults
    let { schema, defaults, linked, partitionKey, sortKey, table } = this.Model
    let data = normalizeData(schema,linked,Object.assign({},defaults,item),true)

    return Object.assign(
      {
        TableName: table,
        Key: getKey(data,schema,partitionKey,sortKey)
      },
      typeof params === 'object' ? params : {}
    )
  }

  delete(item={},params={}) {
    return this.get(item,params)
  }

  // Generate update expression
  update(item={},
    {
      SET=[],
      REMOVE=[],
      ADD=[],
      DELETE=[],
      ExpressionAttributeNames={},
      ExpressionAttributeValues={},
      ...params
    } = {}) {

    // Validate operation types
    if (!Array.isArray(SET)) error('SET must be an array')
    if (!Array.isArray(REMOVE)) error('REMOVE must be an array')
    if (!Array.isArray(ADD)) error('ADD must be an array')
    if (!Array.isArray(DELETE)) error('DELETE must be an array')

    // Validate attribute names and values
    if (typeof ExpressionAttributeNames !== 'object'
      || Array.isArray(ExpressionAttributeNames))
      error('ExpressionAttributeNames must be an object')
    if (typeof ExpressionAttributeValues !== 'object'
      || Array.isArray(ExpressionAttributeValues))
      error('ExpressionAttributeValues must be an object')
    // if (ConditionExpression && typeof ConditionExpression !== 'string')
    //     error(`ConditionExpression must be a string`)

    // Extract schema and defaults
    let { schema, defaults, required, linked, partitionKey, sortKey, table } = this.Model

    // Merge defaults
    let data = normalizeData(schema,linked,Object.assign({},defaults,item))

    // Check for required fields
    Object.keys(required).forEach(field =>
      required[field] && !data[field] && error(`'${field}' is a required field`)
    ) // end required field check

    // Check for partition and sort keys
    let Key = getKey(data,schema,partitionKey,sortKey)

    // Init names and values
    let names = {}
    let values = {}

    // Loop through valid fields and add appropriate action
    Object.keys(data).forEach(function(field) {
      let mapping = schema[field]

      // Remove null or empty fields
      if ((data[field] === null || String(data[field]).trim() === '') && (!mapping.link || mapping.save)) {
        REMOVE.push(`#${field}`)
        names[`#${field}`] = field
      } else if (
        field !== partitionKey
        && field !== sortKey
        && (mapping.save === undefined || mapping.save === true)
        && (!mapping.link || (mapping.link && mapping.save === true))
      ) {
        // If a number or a set and adding
        if (['number','set'].includes(mapping.type) && data[field].$add) {
          ADD.push(`#${field} :${field}`)
          values[`:${field}`] = validateType(mapping,field,data[field].$add,data)
          // Add field to names
          names[`#${field}`] = field
        // if a set and deleting items
        } else if (mapping.type === 'set' && data[field].$delete) {
          DELETE.push(`#${field} :${field}`)
          values[`:${field}`] = validateType(mapping,field,data[field].$delete,data)
          // Add field to names
          names[`#${field}`] = field
        // if a list and removing items by index
        } else if (mapping.type === 'list' && Array.isArray(data[field].$remove)) {
          data[field].$remove.forEach(i => {
            if (typeof i !== 'number') error(`Remove array for '${field}' must only contain numeric indexes`)
            REMOVE.push(`#${field}[${i}]`)
          })
          // Add field to names
          names[`#${field}`] = field
        // if list and appending or prepending
        } else if (mapping.type === 'list' && (data[field].$append || data[field].$prepend)) {
          if (data[field].$append) {
            SET.push(`#${field} = list_append(#${field},:${field})`)
            values[`:${field}`] = validateType(mapping,field,data[field].$append,data)
          } else {
            SET.push(`#${field} = list_append(:${field},#${field})`)
            values[`:${field}`] = validateType(mapping,field,data[field].$prepend,data)
          }
          // Add field to names
          names[`#${field}`] = field
        // if a list and updating by index
        } else if (mapping.type === 'list' && !Array.isArray(data[field]) && typeof data[field] === 'object') {
          Object.keys(data[field]).forEach(i => {
            if (String(parseInt(i)) !== i) error(`Properties must be numeric to update specific list items in '${field}'`)
            SET.push(`#${field}[${i}] = :${field}_${i}`)
            values[`:${field}_${i}`] = data[field][i]
          })
          // Add field to names
          names[`#${field}`] = field
        // if a map and updating by nested attribute/index
        } else if (mapping.type === 'map' && data[field].$set) {
          Object.keys(data[field].$set).forEach(f => {

            // TODO: handle null values to remove

            let props = f.split('.')
            let acc = [`#${field}`]
            props.forEach((prop,i) => {
              let id = `${field}_${props.slice(0,i+1).join('_')}`
              // Add names and values
              names[`#${id.replace(/\[(\d+)\]/,'')}`] = prop.replace(/\[(\d+)\]/,'')
              // if the final prop, add the SET and values
              if (i === props.length-1) {
                let input = data[field].$set[f]
                let path = `${acc.join('.')}.#${id}`
                let value = `${id.replace(/\[(\d+)\]/,'_$1')}`

                if (input.$add) {
                  ADD.push(`${path} :${value}`)
                  values[`:${value}`] = input.$add
                } else if (input.$append) {
                  SET.push(`${path} = list_append(${path},:${value})`)
                  values[`:${value}`] = input.$append
                } else if (input.$prepend) {
                  SET.push(`${path} = list_append(:${value},${path})`)
                  values[`:${value}`] = input.$prepend
                } else if (input.$remove) {
                  // console.log('REMOVE:',input.$remove);
                  input.$remove.forEach(i => {
                    if (typeof i !== 'number') error(`Remove array for '${field}' must only contain numeric indexes`)
                    REMOVE.push(`${path}[${i}]`)
                  })
                } else {
                  SET.push(`${path} = :${value}`)
                  values[`:${value}`] = input
                }


                if (input.$set) {
                  Object.keys(input.$set).forEach(i => {
                    if (String(parseInt(i)) !== i) error(`Properties must be numeric to update specific list items in '${field}'`)
                    SET.push(`${path}[${i}] = :${value}_${i}`)
                    values[`:${value}_${i}`] = input.$set[i]
                  })
                }


              } else {
                acc.push(`#${id.replace(/\[(\d+)\]/,'')}`)
              }
            })
          })
          // Add field to names
          names[`#${field}`] = field
        // else add to SET
        } else {

          let value = validateType(mapping,field,data[field],data)

          // It's possible that defaults can purposely return undefined values
          if (hasValue(value)) {
            // Push the update to SET
            SET.push(mapping.default && !item[field] && !mapping.onUpdate ?
              `#${field} = if_not_exists(#${field},:${field})`
              : `#${field} = :${field}`)
            // Add names and values
            names[`#${field}`] = field
            values[`:${field}`] = value
          }
        }

      } // end if null
    })

    // Create the update expression
    let expression = (
      (SET.length > 0 ? 'SET ' + SET.join(', ') : '')
      + (REMOVE.length > 0 ? ' REMOVE ' + REMOVE.join(', ') : '')
      + (ADD.length > 0 ? ' ADD ' + ADD.join(', ') : '')
      + (DELETE.length > 0 ? ' DELETE ' + DELETE.join(', ') : '')
    ).trim()


    let attr_values = Object.assign(values,ExpressionAttributeValues)

    // Return the parameters
    return Object.assign(
      {
        TableName: table,
        Key,
        UpdateExpression: expression,
        ExpressionAttributeNames: Object.assign(names,ExpressionAttributeNames)
      },
      typeof params === 'object' ? params : {},
      Object.keys(attr_values).length > 0 ? { ExpressionAttributeValues: attr_values } : {}
    ) // end assign

  } // end update

  put(item={},params={}) {
    // Extract schema and defaults
    let { schema, defaults, required, linked, partitionKey, sortKey, table } = this.Model

    // Merge defaults
    let data = normalizeData(schema,linked,Object.assign({},defaults,item))

    // Check for required fields
    Object.keys(required).forEach(field =>
      required[field] !== undefined && !data[field] && error(`'${field}' is a required field`)
    ) // end required field check

    // Checks for partition and sort keys
    getKey(data,schema,partitionKey,sortKey)

    // Loop through valid fields and add appropriate action
    return Object.assign(
      {
        TableName: table,
        Item: Object.keys(data).reduce((acc,field) => {
          let mapping = schema[field]
          let value = validateType(mapping,field,data[field],data)
          return hasValue(value)
            && (mapping.save === undefined || mapping.save === true)
            && (!mapping.link || (mapping.link && mapping.save === true))
            ? Object.assign(acc, {
              [field]: value
            }) : acc
        },{})
      },
      typeof params === 'object' ? params : {}
    )
  }

} // end Model


// Parse model
const parseModel = (name,model) => {

  let model_name = typeof name === 'string'
    && name.trim().length > 0 ? name.trim()
    : error('Please provide a string value for the model name')

  let model_field = model.model === false ? false
    : typeof model.model === 'string' && model.model.trim().length > 0 ?
      model.model.trim()
      : '__model'

  let timestamps = typeof model.timestamps === 'boolean' ? model.timestamps : false

  let created = typeof model.created === 'string'
    && model.created.trim().length > 0 ? model.created.trim()
    : 'created'

  let modified = typeof model.modified === 'string'
    && model.modified.trim().length > 0 ? model.modified.trim()
    : 'modified'

  let partitionKey = typeof model.partitionKey === 'string'
    && model.partitionKey.trim().length > 0 ? model.partitionKey.trim()
    : error(`'partitionKey' must be defined`)

  let sortKey = typeof model.sortKey === 'string'
    && model.sortKey.trim().length > 0 ? model.sortKey.trim()
    : model.sortKey ? error(`'sortKey' must be string value`)
    : null

  let table = typeof model.table === 'string'
    && model.table.trim().length > 0 ? model.table.trim()
    : error(`'table' must be defined`)

  let schema = typeof model.schema === 'object' && !Array.isArray(model.schema) ?
    model.schema : error(`Please provide a valid 'schema'`)

  // Add model_field
  if (model_field) {
    schema[model_field] = { type: 'string', default: model_name, hidden: true }
  }

  // Add timestamps
  if (timestamps) {
    schema[created] = { type: 'string', default: ()=> new Date().toISOString() }
    schema[modified] = { type: 'string', default: ()=> new Date().toISOString(), onUpdate: true }
  }

  // Track info
  let track = {
    fields: Object.keys(schema), // field and alias list,
    defaults: {}, // tracks default fields
    required: {},
    linked: {}
  }

  // Return the model
  return {
    table,
    partitionKey,
    sortKey,
    schema: Object.keys(schema).reduce((acc,field) => {
      if (typeof schema[field] === 'string') {
        return validTypes.includes(schema[field]) ?
          Object.assign(acc,mappingConfig(field,{ type: schema[field] },track))
          : typeError(field)
      } else if (Array.isArray(schema[field])) {
        return Object.assign(acc,compositeKeyConfig(field,schema[field],track,schema))
      } else {
        return !schema[field].type || validTypes.includes(schema[field].type) ?
          Object.assign(acc,mappingConfig(field,schema[field],track))
          : typeError(field)
      }
    },{}),
    defaults: track.defaults,
    required: track.required,
    linked: track.linked
  } // end mapping object

} // end parseMapping


// Parse and validate mapping config
const mappingConfig = (field,config,track) => {

  // Validate props
  Object.keys(config).forEach(prop => {
    switch(prop) {
      case 'type':
      case 'default':
        break
      case 'coerce':
      case 'onUpdate':
      case 'hidden':
      case 'save':
        if (typeof config[prop] !== 'boolean') error(`'${prop}' must be a boolean`)
        break
      case 'required':
        if (typeof config[prop] !== 'boolean' && config[prop] !== 'always')
          error(`'require' must be a boolean or set to 'always'`)
        break
      case 'alias':
        if (typeof config[prop] !== 'string'
          || track.fields.includes(config[prop].trim())
          || config[prop].trim().length === 0) error(`'${prop}' must be a unique string`)
        break
      case 'setType':
        if (config.type !== 'set') error(`'setType' is only valid for type 'set'`)
        if (!['string','number','binary'].includes(config[prop]))
          error(`Invalid 'setType', must be 'string', 'number', or 'binary'`)
        break
      default:
        error(`'${prop}' is not a valid property type`)
    }
  })

  // Default the type
  if (!config.type) config.type = 'string'

  // Default coerce based on type
  if (['string','boolean','number'].includes(config.type)
    && typeof config.coerce === 'undefined') config.coerce = true

  // Set defaults
  if (config.default) track.defaults[field] = config.default

  if (config.required === true) track.required[field] = false
  if (config.required === 'always') track.required[field] = true

  return Object.assign(
    {
      [field]: config
    },
    config.alias ? {
      [config.alias]: Object.assign({},config, { mapped: field })
    } : {}
  ) // end assign
}


const compositeKeyConfig = (field,config,track,schema) => {
  if (config.length >= 2 && config.length <= 3) {
    let link = schema[config[0]] ? config[0]
      : error(`'${field}' must reference another field`)
    let pos = parseInt(config[1]) === config[1] ? config[1]
      : error(`'${field}' position value must be numeric`)
    let sub_config = !config[2] ? { type: 'string' }
      : ['string','number','boolean'].includes(config[2]) ? { type: config[2] }
      : typeof config[2] === 'object' && !Array.isArray(config[2]) ? config[2]
      : error(`'${field}' type must be 'string','number', 'boolean' or a configuration object`)

    // Add linked fields
    if (!track.linked[link]) track.linked[link] = []
    track.linked[link][pos] = field

    // Merge/validate extra config data and add link and pos
    return Object.assign(
      {
        [field]: Object.assign(
          mappingConfig(field,sub_config,track)[field],
          { link, pos }
        )
      },
      sub_config.alias ? {
        [sub_config.alias]: Object.assign({},sub_config, { mapped: field })
      } : {}
    ) // end assign

  } else {
    error(`Composite key configurations must have 2 or 3 items`)
  }
}


// Performs type validation/coercian
const validateType = (mapping,field,input,data={}) => {

  // Evaluate function expressions
  let value = typeof input === 'function' ? input(data) : input

  // return if undefined or null
  if (!hasValue(value)) return value

  switch(mapping.type) {
    case 'string':
      return typeof value === 'string' || mapping.coerce ? String(value)
        : error(`'${field}' must be of type string`)
    case 'boolean':
      return typeof value === 'boolean' || mapping.coerce ? toBool(value)
        : error(`'${field}' must be of type boolean`)
    case 'number':
      return typeof value === 'number' || mapping.coerce ?
        (String(parseInt(value)) === String(value) && Number.isNaN(value) === false ? parseInt(value)
        : (Number.isNaN(Number.parseFloat(value)) ? error(`Could not convert '${value}' to a number for '${field}'`) : Number.parseFloat(value)))
        : error(`'${field}' must be of type number`)
    case 'list':
      return Array.isArray(value) ? value
        : mapping.coerce ? String(value).split(',').map(x => x.trim())
        : error(`'${field}' must be a list (array)`)
    case 'map':
      return typeof value === 'object' && !Array.isArray(value) ? value
        : error(`'${field}' must be a map (object)`)
    case 'set':
      if (Array.isArray(value)) {
        let set = documentClient.createSet(value, { validate: true })
        return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set
          : error(`'${field}' must be a valid set (array) containing only ${mapping.setType} types`)
      } else if (mapping.coerce) {
        let set = documentClient.createSet(String(value).split(',').map(x => x.trim()))
        return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set
          : error(`'${field}' must be a valid set (array) of type ${mapping.setType}`)
      } else {
        error(`'${field}' must be a valid set (array)`)
      }
      break
    default:
      return value
  }
} // end validateType


// Inline error handler
const error = err => {
  throw err
}

// Standard type error
const typeError = field => {
  error(`Invalid or missing type for '${field}'. `
    + `Valid types are '${validTypes.slice(0,-1).join(`', '`)}',`
    + ` and '${validTypes.slice(-1)}'.`)
}


// Get partitionKey/sortKey
const getKey = (data,schema,partitionKey,sortKey) => {
  let pk = data[partitionKey] ||
      error(`'${partitionKey}'${schema[partitionKey].alias ? ` or '${schema[partitionKey].alias}'` : ''} is required`)

  let sk = sortKey === null || data[sortKey] ||
      error(`'${sortKey}'${schema[sortKey].alias ? ` or '${schema[sortKey].alias}'` : ''} is required`)

  return Object.assign(
    { [partitionKey]: validateType(schema[partitionKey],partitionKey,pk,data) },
    sortKey !== null ? { [sortKey]: validateType(schema[sortKey],sortKey,sk,data) } : {}
  ) // end assign
} // end get keys


// Format item based on schema
const formatItem = (schema,linked,item,omit) => {
  return Object.keys(item).reduce((acc,field) => {

    if (linked[field]) {
      Object.assign(acc, linked[field].reduce((acc,f,i) => {
        if (schema[f].save || schema[f].hidden || omit.includes(f)) return acc
        return Object.assign(acc,{
          [schema[f].alias || f]: validateType(schema[f],f,item[field].split('#')[i])
        })
      },{}))
    }

    if ((schema[field] && schema[field].hidden) || omit.includes(field)) return acc
    return Object.assign(acc,{
      [(schema[field] && schema[field].alias) || field]: item[field]
    })
  },{})
}


const normalizeData = (schema,linked,data,filter=false) => {
  let _data = Object.keys(data).reduce((acc,field) => {
    return Object.assign(acc,
      schema[field] ? { [schema[field].mapped || field] : data[field] }
      : filter ? {}
      : error(`Field '${field}' does not have a mapping or alias`)
    )
  },{})

  // Process linked
  let composites = Object.keys(linked).reduce((acc,field) => {
    if (_data[field] !== undefined) return acc // if value exists, let override
    let values = linked[field].map(f => {
      if (_data[f] === undefined) { return null }
      return validateType(schema[f],f,_data[f],_data)
    }).filter(x => x !== null)

    // if (values.length > 0 && values.length !== linked[field].length) {
    //   error(`${linked[field].join(', ')} are all required for composite key`)
    // } else
    if (values.length === linked[field].length) {
      return Object.assign(acc, { [field]: values.join('#') })
    } else {
      return acc
    }
  },{})

  // Return the merged data
  return Object.assign(composites,_data)

}

// Boolean conversion
const toBool = val =>
  typeof val === 'boolean' ? val
  : ['false','0','no'].includes(String(val).toLowerCase()) ? false
  : Boolean(val)

// has value shortcut
const hasValue = val => val !== undefined && val !== null

module.exports = {
  Model
}
