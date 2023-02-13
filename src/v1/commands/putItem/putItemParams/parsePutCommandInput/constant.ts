import isEqual from 'lodash.isequal'

import { ConstantAttribute, PossiblyUndefinedResolvedAttribute, AttributePutItem } from 'v1'

export const parseConstantAttributePutCommandInput = <CONSTANT_ATTRIBUTE extends ConstantAttribute>(
  constantAttribute: CONSTANT_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributePutItem<CONSTANT_ATTRIBUTE> => {
  if (!isEqual(constantAttribute.value, input)) {
    // TODO
    throw new Error()
  }

  return input as AttributePutItem<CONSTANT_ATTRIBUTE>
}
