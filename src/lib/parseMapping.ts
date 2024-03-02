/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import {
  PartitionKeyDefinition,
  GSIPartitionKeyDefinition,
  SortKeyDefinition,
  GSISortKeyDefinition,
  PureAttributeDefinition
} from '../classes/Entity/types.js'
import { TrackingInfo } from './parseEntity.js'
import { error } from './utils.js'

// Parse and validate mapping config
export default (
  field: string,
  config:
    | PartitionKeyDefinition
    | GSIPartitionKeyDefinition
    | SortKeyDefinition
    | GSISortKeyDefinition
    | PureAttributeDefinition,
  track: TrackingInfo
) => {
  // Validate props
  Object.keys(config).forEach(prop => {
    switch (prop) {
      case 'type':
      case 'default':
        break
      case 'dependsOn':
        if (typeof config[prop] !== 'string' && !Array.isArray(config[prop]))
          error(`'dependsOn' must be the string name of an attribute or alias`)
        break
      case 'transform':
        if (typeof config[prop] !== 'function') error(`'${prop}' must be a function`)
        break
      case 'format':
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
        if (
          typeof config[prop] !== 'string' ||
          // check for alias uniqueness
          (field !== config[prop] && track.fields.includes((config[prop] || '').trim())) ||
          (config[prop] || '').trim().length === 0
        )
          error(`'${prop}' must be a unique string`)
        break
      case 'setType':
        if (config.type !== 'set') error(`'setType' is only valid for type 'set'`)
        if (!['string', 'number', 'bigint', 'binary'].includes(config[prop] || ''))
          error(`Invalid 'setType', must be 'string', 'number', 'bigint', or 'binary'`)
        break
      case 'delimiter':
        if (typeof config[prop] !== 'string' || (config[prop] || '').trim().length === 0)
          error(`'delimiter' must be a 'string'`)
        config[prop] = (config[prop] || '').trim()
        break
      case 'prefix':
      case 'suffix':
        if (config.type && config.type !== 'string')
          error(`'${prop}' can only be used on 'string' types`)
        if (typeof config[prop] !== 'string' || (config[prop] || '').trim().length === 0)
          error(`'${prop}' must be a 'string'`)
        break
      case 'partitionKey':
      case 'sortKey':
        if (config.map || config.alias)
          error(`Attributes with a ${prop} cannot have a 'map' or 'alias' associated`)
        if (
          typeof config[prop] === 'boolean' ||
          typeof config[prop] === 'string' ||
          Array.isArray(config[prop])
        ) {
          // Coerce/cast to an array of strings/booleans
          const indexes = (Array.isArray(config[prop]) ? config[prop] : [config[prop]]) as (
            | string
            | boolean
          )[]

          // Loop through values and track keys
          for (const i in indexes) {
            // If a boolean, set primary pk/sk
            if (typeof indexes[i] === 'boolean') {
              // Check that another prop isn't already a key
              if (track.keys[prop])
                error(`'${track.keys[prop]}' has already been declared as the ${prop}`)
              // If true, add the field as the key
              if (indexes[i]) track.keys[prop] = field
              // If the partionKey is the same as the sortKey, throw an error
              if (track.keys.partitionKey && track.keys.partitionKey === track.keys.sortKey)
                error(`'${field}' attribute cannot be both the partitionKey and sortKey`)

              // If string, set index pk/sk
            } else if (typeof indexes[i] === 'string') {
              const index = indexes[i] as string

              // If the index isn't being tracked yet, add it
              if (!track.keys[index]) track.keys[index] = {}

              // If the index's pk/sk already exist
              if (track.keys[index][prop]) {
                error(
                  `'${track.keys[index][prop]}' has already been declared as the ${prop} for the ${index} index`
                )
              }
              track.keys[index][prop] = field
              if (track.keys[index].partitionKey === track.keys[index].sortKey)
                error(
                  `'${field}' attribute cannot be both the partitionKey and sortKey for the ${index} index`
                )
            } else {
              error(`Index assignments for '${field}' must be string or boolean values`)
            }
          }
        } else {
          error(`'${prop}' must be a boolean, string, or array`)
        }
        break
      case 'derive':
        if (typeof config[prop] !== 'function') error(`'${prop}' must be a function`)
        track.derived.push(field)
        break
      default:
        error(`'${prop}' is not a valid property type`)
    }
  })

  // Error on alias and map
  if (config.alias && config.map) error(`'${field}' cannot contain both an alias and a map`)

  // Default the type
  if (!config.type) config.type = 'string'

  // Default coerce based on type
  if (['string', 'boolean', 'number', 'bigint'].includes(config.type) && typeof config.coerce === 'undefined')
    config.coerce = true

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
    alias
      ? {
        [alias]: Object.assign({}, _config, { map: field })
      }
      : {},
    map
      ? {
        [map]: Object.assign({}, _config, { alias: field })
      }
      : {}
  )
}
