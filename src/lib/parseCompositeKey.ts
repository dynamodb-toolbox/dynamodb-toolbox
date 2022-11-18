/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { A, O } from 'ts-toolbelt'

import { error } from './utils'
import parseMapping from './parseMapping'
import {
  CompositeAttributeDefinition,
  PureAttributeDefinition,
  AttributeDefinitions
} from '../classes/Entity'
import { TrackingInfo } from './parseEntity'

const parseCompositeKey = <
  ReadonlyAttributeDefinitions extends
    | AttributeDefinitions
    | O.Readonly<AttributeDefinitions, A.Key, 'deep'>
>(
    field: string,
    config: CompositeAttributeDefinition,
    track: TrackingInfo,
    schema: ReadonlyAttributeDefinitions
  ) => {
  if (config.length >= 2 && config.length <= 3) {
    const link = schema[config[0]] ? config[0] : error(`'${field}' must reference another field`)
    const pos =
      parseInt(config[1].toString()) === config[1]
        ? config[1]
        : error(`'${field}' position value must be numeric`)
    // 🔨 TOIMPROVE: Prevent casting if possible
    const sub_config = (!config[2]
      ? { type: 'string' }
      : ['string', 'number', 'boolean'].includes(config[2].toString())
        ? { type: config[2] }
        : config[2]?.constructor === Object
          ? config[2]
          : error(
            `'${field}' type must be 'string', 'number', 'boolean' or a configuration object`
          )) as PureAttributeDefinition

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

export default parseCompositeKey
