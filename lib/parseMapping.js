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
