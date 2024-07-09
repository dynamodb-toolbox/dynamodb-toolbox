import type { AnyAttribute, ResolveAnyAttribute } from '~/attributes/any/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

export type AnyAttrFormattedValue<ATTRIBUTE extends AnyAttribute> = AnyAttribute extends ATTRIBUTE
  ? unknown
  : ResolveAnyAttribute<ATTRIBUTE>

type AnyAttrRawValueFormatter = <ATTRIBUTE extends AnyAttribute>(
  _: ATTRIBUTE,
  rawValue: unknown
) => AnyAttrFormattedValue<ATTRIBUTE>

export const formatAnyAttrRawValue: AnyAttrRawValueFormatter = (_, rawValue) => cloneDeep(rawValue)
