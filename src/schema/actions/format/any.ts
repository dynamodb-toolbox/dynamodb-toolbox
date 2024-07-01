import { cloneDeep } from 'lodash'

import type { AnyAttribute, ResolveAnyAttribute } from '~/schema/attributes/any/index.js'

export type AnyAttrFormattedValue<ATTRIBUTE extends AnyAttribute> = AnyAttribute extends ATTRIBUTE
  ? unknown
  : ResolveAnyAttribute<ATTRIBUTE>

type AnyAttrRawValueFormatter = <ATTRIBUTE extends AnyAttribute>(
  _: ATTRIBUTE,
  rawValue: unknown
) => AnyAttrFormattedValue<ATTRIBUTE>

export const formatAnyAttrRawValue: AnyAttrRawValueFormatter = (_, rawValue) => cloneDeep(rawValue)
