import { RequiredOption, Attribute, PossiblyUndefinedResolvedAttribute, KeyInput } from 'v1'

import { parseConstantAttributeKeyInput } from './constant'
import { parsePrimitiveAttributeKeyInput } from './primitive'
import { parseSetAttributeKeyInput } from './set'
import { parseListAttributeKeyInput } from './list'
import { parseMapAttributeKeyInput } from './map'

export const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export const parseAttributeKeyInput = <ATTRIBUTE extends Attribute>(
  attribute: ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): KeyInput<ATTRIBUTE> => {
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
      return input as KeyInput<ATTRIBUTE>
    case 'constant':
      return parseConstantAttributeKeyInput(attribute, input) as KeyInput<ATTRIBUTE>
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return parsePrimitiveAttributeKeyInput(attribute, input) as KeyInput<ATTRIBUTE>
    case 'set':
      return parseSetAttributeKeyInput(attribute, input) as KeyInput<ATTRIBUTE>
    case 'list':
      return parseListAttributeKeyInput(attribute, input) as KeyInput<ATTRIBUTE>
    case 'map':
      return parseMapAttributeKeyInput(attribute, input) as KeyInput<ATTRIBUTE>
  }
}
