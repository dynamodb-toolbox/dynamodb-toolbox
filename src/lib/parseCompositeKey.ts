/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { error } from './utils'
import parseMapping from './parseMapping'
import {
  EntityAttributes,
  EntityAttributeConfig,
  EntityCompositeAttributes
} from '../classes/Entity'
import { TrackingInfo } from './parseEntity'

export default (
  field: string,
  config: EntityCompositeAttributes,
  track: TrackingInfo,
  schema: EntityAttributes
) => {
  if (config.length >= 2 && config.length <= 3) {
    let link = schema[config[0]] ? config[0] : error(`'${field}' must reference another field`)
    let pos =
      parseInt(config[1].toString()) === config[1]
        ? config[1]
        : error(`'${field}' position value must be numeric`)
    let sub_config = (!config[2]
      ? { type: 'string' }
      : ['string', 'number', 'boolean'].includes(config[2].toString())
      ? { type: config[2] }
      : typeof config[2] === 'object' && !Array.isArray(config[2])
      ? config[2]
      : error(
          `'${field}' type must be 'string', 'number', 'boolean' or a configuration object`
        )) as EntityAttributeConfig

    // Add linked fields
    if (!track.linked[link]) track.linked[link] = []
    track.linked[link][pos] = field

    // Merge/validate extra config data and add link and pos
    return Object.assign(
      {
        [field]: Object.assign(
          { save: true }, // default save to true
          parseMapping(field, sub_config, track)[field],
          { link, pos }
        )
      },
      sub_config.alias
        ? {
            [sub_config.alias]: Object.assign({}, sub_config, { map: field })
          }
        : {}
    ) // end assign
  } else {
    error(`Composite key configurations must have 2 or 3 items`)
  }
}
