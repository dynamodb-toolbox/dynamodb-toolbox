import { RequiredOption, Attribute, PossiblyUndefinedResolvedAttribute, PutItem } from 'v1'

import { parsePrimitiveAttributePutCommandInput } from './primitive'
import { parseSetAttributePutCommandInput } from './set'
import { parseListAttributePutCommandInput } from './list'
import { parseMapAttributePutCommandInput } from './map'

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
): PutItem<ATTRIBUTE> => {
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
      return input as PutItem<ATTRIBUTE>
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return parsePrimitiveAttributePutCommandInput(attribute, input) as PutItem<ATTRIBUTE>
    case 'set':
      return parseSetAttributePutCommandInput(attribute, input) as PutItem<ATTRIBUTE>
    case 'list':
      return parseListAttributePutCommandInput(attribute, input) as PutItem<ATTRIBUTE>
    case 'map':
      return parseMapAttributePutCommandInput(attribute, input) as PutItem<ATTRIBUTE>
  }
}
