import isEqual from 'lodash.isequal'

import type { ConstantAttribute, PossiblyUndefinedResolvedAttribute, KeyInput } from 'v1'

export const parseConstantAttributeKeyInput = <CONSTANT_ATTRIBUTE extends ConstantAttribute>(
  constantAttribute: CONSTANT_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): KeyInput<CONSTANT_ATTRIBUTE> => {
  if (!isEqual(constantAttribute.value, input)) {
    // TODO
    throw new Error()
  }

  return input as KeyInput<CONSTANT_ATTRIBUTE>
}
