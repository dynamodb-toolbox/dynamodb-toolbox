'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const { error } = require('./utils')

// Parse and validate mapping config
module.exports = (field,config,track) => {

  // Validate props
  Object.keys(config).forEach(prop => {
    switch(prop) {
      case 'type':
      case 'default':
        break
      case 'transform':
        if (typeof config[prop] !== 'function') error(`'${prop}' must be a function`)
        break
      case 'coerce':
      case 'onUpdate':
      case 'hidden':
      case 'save':
        if (typeof config[prop] !== 'boolean') error(`'${prop}' must be a boolean`)
        break
      case 'required':
        if (typeof config[prop] !== 'boolean' && config[prop] !== 'always')
          error(`'required' must be a boolean or set to 'always'`)
        break
      case 'alias':
      case 'map':
        if (typeof config[prop] !== 'string'
          || track.fields.includes(config[prop].trim())
          || config[prop].trim().length === 0) error(`'${prop}' must be a unique string`)
        break
      case 'setType':
        if (config.type !== 'set') error(`'setType' is only valid for type 'set'`)
        if (!['string','number','binary'].includes(config[prop]))
          error(`Invalid 'setType', must be 'string', 'number', or 'binary'`)
        break
      case 'delimiter':
        if (typeof config[prop] !== 'string' || config[prop].trim().length === 0)
          error(`'delimiter' must be a 'string'`)
        config[prop] = config[prop].trim()
        break
      case 'prefix':
      case 'suffix':
        if (config.type && config.type !== 'string')
          error(`'${prop}' can only be used on 'string' types`)
        if (typeof config[prop] !== 'string' || config[prop].trim().length === 0)
          error(`'${prop}' must be a 'string'`)
        break
      case 'partitionKey':
      case 'sortKey':
        if (config.map || config.alias) error(`Attributes with a ${prop} cannot have a 'map' or 'alias' associated`)
        if (typeof config[prop] === 'boolean' || typeof config[prop] === 'string' || Array.isArray(config[prop])) {
          // Coerce to array
          const indexes = Array.isArray(config[prop]) ? config[prop] : [config[prop]]
          // Loop through values and track keys
          for (let i in indexes) {    
            if (typeof indexes[i] === 'boolean') {
              track.keys[prop] = !track.keys[prop] ? (indexes[i] ? field : undefined)
                : error(`'${track.keys[prop]}' has already been declared as the ${prop}`)
              if (track.keys.partitionKey && track.keys.partitionKey === track.keys.sortKey) error(`'${field}' attribute cannot be both the partitionKey and sortKey`)
            } else {
              const index = typeof indexes[i] === 'string' ? indexes[i]
                : error(`Index assignments for '${field}' must be string or boolean values`)
              if (!track.keys[index]) track.keys[index] = {}
              track.keys[index][prop] = !track.keys[index][prop] ? field
                : error(`'${track.keys[index][prop]}' has already been declared as the ${prop} for the ${index} index`)
              if (track.keys[index].partitionKey === track.keys[index].sortKey) error(`'${field}' attribute cannot be both the partitionKey and sortKey for the ${index} index`)
            }
          } // end for
        } else { 
          error(`'${prop}' must be a boolean, string, or array`) 
        }
        break
      default:
        error(`'${prop}' is not a valid property type`)
    }
  })

  // Error on alias and map
  if (config.alias && config.map)
    error(`'${field}' cannot contain both an alias and a map`)

  // Default the type
  if (!config.type) config.type = 'string'

  // Default coerce based on type
  if (['string','boolean','number'].includes(config.type)
    && typeof config.coerce === 'undefined') config.coerce = true

  // Set defaults
  if (config.default !== undefined) track.defaults[field] = config.default

  // Track required settings
  if (config.required === true) track.required[config.map || field] = false
  if (config.required === 'always') track.required[config.map || field] = true



  // Destructure the config to pull out map and alias
  const { map, alias, ..._config } = config

  // Return the original config
  return Object.assign(
    {
      [field]: config
    },
    alias ? {
      [alias]: Object.assign({},_config, { map: field })
    } : {},
    map ? {
      [map]: Object.assign({},_config, { alias: field })
    } : {}
  ) // end assign
}
