import cloneDeep from 'lodash.clonedeep'

import type { AnyAttribute, ResolveAnyAttribute } from 'v1/schema/attributes/any'

export type AnyAttrFormattedValue<ATTRIBUTE extends AnyAttribute> = AnyAttribute extends ATTRIBUTE
  ? unknown
  : ResolveAnyAttribute<ATTRIBUTE>

export const formatAnyAttrRawValue = <ATTRIBUTE extends AnyAttribute>(
  _: ATTRIBUTE,
  rawValue: unknown
): AnyAttrFormattedValue<ATTRIBUTE> => cloneDeep(rawValue)
