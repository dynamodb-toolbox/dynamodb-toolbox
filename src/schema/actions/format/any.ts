import type { AnyAttribute } from '~/attributes/any/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

type AnyAttrRawValueFormatter = <ATTRIBUTE extends AnyAttribute>(
  _: ATTRIBUTE,
  rawValue: unknown
) => FormattedValue<AnyAttribute>

export const formatAnyAttrRawValue: AnyAttrRawValueFormatter = <ATTRIBUTE extends AnyAttribute>(
  _: ATTRIBUTE,
  rawValue: unknown
) => cloneDeep(rawValue)
