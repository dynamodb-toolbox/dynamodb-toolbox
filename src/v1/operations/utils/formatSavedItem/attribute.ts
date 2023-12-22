import cloneDeep from 'lodash.clonedeep'

import type { Attribute, RequiredOption, AttributeValue } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { parseSavedPrimitiveAttribute } from './primitive'
import { parseSavedSetAttribute } from './set'
import { parseSavedListAttribute } from './list'
import { parseSavedMapAttribute } from './map'
import { parseSavedAnyOfAttribute } from './anyOf'
import { parseSavedRecordAttribute } from './record'

export const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export const parseSavedAttribute = (
  attribute: Attribute,
  savedValue: AttributeValue | undefined,
  options: FormatSavedAttributeOptions = {}
): AttributeValue | undefined => {
  if (savedValue === undefined) {
    if (isRequired(attribute) && options.partial !== true) {
      throw new DynamoDBToolboxError('commands.formatSavedItem.savedAttributeRequired', {
        message: `Missing required attribute in saved item: ${attribute.path}`,
        path: attribute.path
      })
    } else {
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return cloneDeep(savedValue) as AttributeValue
    case 'string':
    case 'binary':
    case 'boolean':
    case 'number':
      return parseSavedPrimitiveAttribute(attribute, savedValue)
    case 'set':
      return parseSavedSetAttribute(attribute, savedValue)
    case 'list':
      return parseSavedListAttribute(attribute, savedValue, options)
    case 'map':
      return parseSavedMapAttribute(attribute, savedValue, options)
    case 'record':
      return parseSavedRecordAttribute(attribute, savedValue, options)
    case 'anyOf':
      return parseSavedAnyOfAttribute(attribute, savedValue, options)
  }
}
