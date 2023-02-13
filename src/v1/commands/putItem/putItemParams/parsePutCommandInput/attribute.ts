import { RequiredOption, Attribute, PossiblyUndefinedResolvedAttribute, AttributePutItem } from 'v1'

import { parseConstantAttributePutCommandInput } from './constant'
import { parsePrimitiveAttributePutCommandInput } from './primitive'
import { parseSetAttributePutCommandInput } from './set'
import { parseListAttributePutCommandInput } from './list'
import { parseMapAttributePutCommandInput } from './map'
import { parseAnyOfAttributePutCommandInput } from './anyOf'

export const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

/**
 * Recursively parse the input of a PUT command for any attribute
 *
 * @param attribute Attribute
 * @param input any
 * @return PutItemInput
 */
export const parseAttributePutCommandInput = <ATTRIBUTE extends Attribute>(
  attribute: ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributePutItem<ATTRIBUTE> => {
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
      return input as AttributePutItem<ATTRIBUTE>
    case 'constant':
      return parseConstantAttributePutCommandInput(attribute, input) as AttributePutItem<ATTRIBUTE>
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return parsePrimitiveAttributePutCommandInput(attribute, input) as AttributePutItem<ATTRIBUTE>
    case 'set':
      return parseSetAttributePutCommandInput(attribute, input) as AttributePutItem<ATTRIBUTE>
    case 'list':
      return parseListAttributePutCommandInput(attribute, input) as AttributePutItem<ATTRIBUTE>
    case 'map':
      return parseMapAttributePutCommandInput(attribute, input) as AttributePutItem<ATTRIBUTE>
    case 'anyOf':
      return parseAnyOfAttributePutCommandInput(attribute, input) as AttributePutItem<ATTRIBUTE>
  }
}
