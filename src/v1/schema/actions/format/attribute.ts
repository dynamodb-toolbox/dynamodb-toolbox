import cloneDeep from 'lodash.clonedeep'

import type { Attribute, RequiredOption, AttributeValue } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedPrimitiveAttribute } from './primitive'
import { formatSavedSetAttribute } from './set'
import { formatSavedListAttribute } from './list'
import { formatSavedMapAttribute } from './map'
import { formatSavedAnyOfAttribute } from './anyOf'
import { formatSavedRecordAttribute } from './record'

export const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export const formatSavedAttribute = (
  attribute: Attribute,
  savedValue: AttributeValue | undefined,
  options: FormatOptions = {}
): AttributeValue | undefined => {
  if (savedValue === undefined) {
    if (isRequired(attribute) && options.partial !== true) {
      throw new DynamoDBToolboxError('formatter.missingAttribute', {
        message: `Missing required attribute in item: ${attribute.path}.`,
        path: attribute.path,
        payload: {}
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
      return formatSavedPrimitiveAttribute(attribute, savedValue)
    case 'set':
      return formatSavedSetAttribute(attribute, savedValue, options)
    case 'list':
      return formatSavedListAttribute(attribute, savedValue, options)
    case 'map':
      return formatSavedMapAttribute(attribute, savedValue, options)
    case 'record':
      return formatSavedRecordAttribute(attribute, savedValue, options)
    case 'anyOf':
      return formatSavedAnyOfAttribute(attribute, savedValue, options)
  }
}
