import isEqual from 'lodash.isequal'

import { ConstantAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'

export const parseConstantAttributePutCommandInput = (
  constantAttribute: ConstantAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isEqual(constantAttribute.value, input)) {
    // TODO
    throw new Error()
  }

  return input
}
