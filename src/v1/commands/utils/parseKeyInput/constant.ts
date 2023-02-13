import isEqual from 'lodash.isequal'

import type { ConstantAttribute, PossiblyUndefinedResolvedAttribute, AttributeKeyInput } from 'v1'

export const parseConstantAttributeKeyInput = <CONSTANT_ATTRIBUTE extends ConstantAttribute>(
  constantAttribute: CONSTANT_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributeKeyInput<CONSTANT_ATTRIBUTE> => {
  if (!isEqual(constantAttribute.value, input)) {
    // TODO
    throw new Error()
  }

  return input as AttributeKeyInput<CONSTANT_ATTRIBUTE>
}
