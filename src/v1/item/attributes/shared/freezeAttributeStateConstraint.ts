import type {
  $AttributeOptionSymbol,
  AttributeOptionSymbolName,
  AttributeOptionNameSymbol
} from '../constants/attributeOptions'

export type FreezeAttributeStateConstraint<
  $ATTRIBUTE_STATE_CONSTRAINTS extends Partial<Record<$AttributeOptionSymbol, unknown>>
> = {
  [KEY in AttributeOptionSymbolName[Extract<
    keyof $ATTRIBUTE_STATE_CONSTRAINTS,
    $AttributeOptionSymbol
  >]]: $ATTRIBUTE_STATE_CONSTRAINTS[AttributeOptionNameSymbol[KEY]]
}
