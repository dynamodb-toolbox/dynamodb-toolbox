import { cloneDeep } from 'lodash'

import type { AnyAttribute, ResolveAnyAttribute } from '~/schema/attributes/any/index.js'

export type AnyAttrFormattedValue<ATTRIBUTE extends AnyAttribute> = AnyAttribute extends ATTRIBUTE
  ? unknown
  : ResolveAnyAttribute<ATTRIBUTE>

export const formatAnyAttrRawValue = <ATTRIBUTE extends AnyAttribute>(
  _: ATTRIBUTE,
  rawValue: unknown
): AnyAttrFormattedValue<ATTRIBUTE> => cloneDeep(rawValue)
