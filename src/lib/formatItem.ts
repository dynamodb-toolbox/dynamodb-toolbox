/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { KeyAttributeDefinition, PureAttributeDefinition } from '../classes/Entity'
import validateTypes from './validateTypes'
import { Linked } from './parseEntity'

// Format item based on attribute defnition
export default (DocumentClient: DocumentClient) => (
  attributes: { [key: string]: PureAttributeDefinition },
  linked: Linked,
  item: any,
  include: string[] = []
) => {
  // TODO: Support nested maps?
  // TODO: include alias support?
  // TODO: Test existence of RegExp inputs

  // Intialize validate type
  const validateType = validateTypes(DocumentClient)

  return Object.keys(item).reduce((acc, field) => {
    const link =
      linked[field] ||
      (attributes[field] && attributes[field].alias && linked[attributes[field].alias!])
    if (link) {
      Object.assign(
        acc,
        link.reduce((acc, f, i) => {
          if (
            attributes[f].save ||
            attributes[f].hidden ||
            (include.length > 0 && !include.includes(f))
          )
            return acc
          return Object.assign(acc, {
            [attributes[f].alias || f]: validateType(
              attributes[f],
              f,
              item[field]
                .replace(new RegExp(`^${escapeRegExp(attributes[field].prefix!)}`), '')
                .replace(new RegExp(`${escapeRegExp(attributes[field].suffix!)}$`), '')
                .split(attributes[field].delimiter || '#')[i]
            )
          })
        }, {})
      )
    }

    if (
      (attributes[field] && attributes[field].hidden) ||
      (include.length > 0 && !include.includes(field))
    )
      return acc
    // Extract values from sets
    if (
      attributes[field] &&
      attributes[field].type === 'set' &&
      Array.isArray(item[field].values)
    ) {
      item[field] = item[field].values
    }

    const fieldValue =
      attributes[field] && (attributes[field].prefix || attributes[field].suffix)
        ? item[field]
          .replace(new RegExp(`^${escapeRegExp(attributes[field].prefix!)}`), '')
          .replace(new RegExp(`${escapeRegExp(attributes[field].suffix!)}$`), '')
        : item[field]

    const transformedValue =
      attributes[field] && attributes[field].format
        ? (attributes[field] as Required<PureAttributeDefinition>).format(fieldValue, item)
        : fieldValue

    return Object.assign(acc, {
      [(attributes[field] && attributes[field].alias) || field]: transformedValue
    })
  }, {})
}

function escapeRegExp(text: string) {
  return text ? text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&') : ''
}
