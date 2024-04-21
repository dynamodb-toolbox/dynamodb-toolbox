/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import type { NativeAttributeValue, NativeScalarAttributeValue, NumberValue } from '@aws-sdk/util-dynamodb'
import type { PureAttributeDefinition } from '../classes/Entity/types.js'
import validateTypes from './validateTypes.js'
import type { Linked } from './parseEntity.js'

// Convert from DocumentClient values, which may be wrapped sets or numbers,
// into normal TS values.
const convertDynamoValues = (value: NativeAttributeValue, attr?: PureAttributeDefinition): unknown => {
  if (value === null) {
    return value
  }

  // Unwrap bigint/number sets to regular numbers/bigints
  if (attr && attr.type === 'set') {
    if (attr.setType === 'bigint') {
      value = Array.from(value as Set<bigint>).map((n: any) => BigInt(unwrapAttributeValue(n)))
    } else if (attr.setType === 'number') {
      value = Array.from(value as Set<number>).map((n: any) => Number(unwrapAttributeValue(n)))
    } else {
      value = Array.from(value as Set<unknown>)
    }
  }

  if (attr && attr.type === 'bigint') {
    value = BigInt(unwrapAttributeValue(value))
  }

  if (attr && attr.type === 'number') {
    value = Number(unwrapAttributeValue(value))
  }

  return value
}

const unwrapAttributeValue = (value: NativeAttributeValue):  boolean | number | bigint | string => {
  if( value?.value !== undefined ) {
    return value.value
  }

  return value
}

// Format item based on attribute defnition
export default () => (
  attributes: { [key: string]: PureAttributeDefinition },
  linked: Linked,
  item: any,
  include: string[] = [],
) => {
  // TODO: Support nested maps?
  // TODO: include alias support?
  // TODO: Test existence of RegExp inputs

  // Intialize validate type
  const validateType = validateTypes()

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
          ) {
            return acc
          }
          return Object.assign(acc, {
            [attributes[f].alias || f]: validateType(
              attributes[f],
              f,
              item[field]
                .replace(new RegExp(`^${escapeRegExp(attributes[field].prefix!)}`), '')
                .replace(new RegExp(`${escapeRegExp(attributes[field].suffix!)}$`), '')
                .split(attributes[field].delimiter || '#')[i],
            ),
          })
        }, {}),
      )
    }

    if (
      (attributes[field] && attributes[field].hidden) ||
      (include.length > 0 && !include.includes(field))
    ) {
      return acc
    }

    item[field] = convertDynamoValues(item[field], attributes[field])

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
      [(attributes[field] && attributes[field].alias) || field]: transformedValue,
    })
  }, {})
}

function escapeRegExp(text: string) {
  return text ? text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&') : ''
}
