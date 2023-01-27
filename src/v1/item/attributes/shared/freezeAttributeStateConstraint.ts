import type {
  $AttributeOptionSymbol,
  AttributeOptionSymbolName,
  AttributeOptionNameSymbol
} from '../constants/attributeOptions'

export type FreezeAttributeStateConstraint<
  _ATTRIBUTE_STATE_CONSTRAINTS extends Partial<Record<$AttributeOptionSymbol, unknown>>
> = {
  [KEY in AttributeOptionSymbolName[Extract<
    keyof _ATTRIBUTE_STATE_CONSTRAINTS,
    $AttributeOptionSymbol
  >]]: _ATTRIBUTE_STATE_CONSTRAINTS[AttributeOptionNameSymbol[KEY]]
}
