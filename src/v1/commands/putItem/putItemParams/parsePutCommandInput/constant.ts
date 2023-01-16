import isEqual from 'lodash.isequal'

import { ConstantAttribute, PossiblyUndefinedResolvedAttribute, PutItem } from 'v1'

export const parseConstantAttributePutCommandInput = <CONSTANT_ATTRIBUTE extends ConstantAttribute>(
  constantAttribute: CONSTANT_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): PutItem<CONSTANT_ATTRIBUTE> => {
  if (!isEqual(constantAttribute.value, input)) {
    // TODO
    throw new Error()
  }

  return input as PutItem<CONSTANT_ATTRIBUTE>
}
