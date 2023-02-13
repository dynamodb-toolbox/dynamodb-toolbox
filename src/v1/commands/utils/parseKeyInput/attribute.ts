import {
  RequiredOption,
  Attribute,
  PossiblyUndefinedResolvedAttribute,
  AttributeKeyInput
} from 'v1'

import { parseConstantAttributeKeyInput } from './constant'
import { parsePrimitiveAttributeKeyInput } from './primitive'
import { parseSetAttributeKeyInput } from './set'
import { parseListAttributeKeyInput } from './list'
import { parseMapAttributeKeyInput } from './map'
import { parseAnyOfAttributeKeyInput } from './anyOf'

export const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export const parseAttributeKeyInput = <ATTRIBUTE extends Attribute>(
  attribute: ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributeKeyInput<ATTRIBUTE> => {
  if (input === undefined) {
    if (isRequired(attribute)) {
      // TODO
      throw new Error()
    } else {
      // @ts-expect-error TODO: Return can be undefined
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return input as AttributeKeyInput<ATTRIBUTE>
    case 'constant':
      return parseConstantAttributeKeyInput(attribute, input) as AttributeKeyInput<ATTRIBUTE>
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return parsePrimitiveAttributeKeyInput(attribute, input) as AttributeKeyInput<ATTRIBUTE>
    case 'set':
      return parseSetAttributeKeyInput(attribute, input) as AttributeKeyInput<ATTRIBUTE>
    case 'list':
      return parseListAttributeKeyInput(attribute, input) as AttributeKeyInput<ATTRIBUTE>
    case 'map':
      return parseMapAttributeKeyInput(attribute, input) as AttributeKeyInput<ATTRIBUTE>
    case 'anyOf':
      return parseAnyOfAttributeKeyInput(attribute, input) as AttributeKeyInput<ATTRIBUTE>
  }
}
