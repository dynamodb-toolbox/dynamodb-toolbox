import isEqual from 'lodash.isequal'

import type { ConstantAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'

export const parseConstantAttributeKeyInput = (
  constantAttribute: ConstantAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isEqual(constantAttribute.value, input)) {
    // TODO
    throw new Error()
  }

  return input
}
