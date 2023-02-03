import type {
  $AttributeOptionSymbol,
  AttributeOptionSymbolName
} from '../constants/attributeOptions'

export type FreezeAttributeStateConstraint<
  $ATTRIBUTE_STATE_CONSTRAINTS extends Partial<Record<$AttributeOptionSymbol, unknown>>
> = {
  [KEY in Extract<
    keyof $ATTRIBUTE_STATE_CONSTRAINTS,
    $AttributeOptionSymbol
  > as AttributeOptionSymbolName[KEY]]: $ATTRIBUTE_STATE_CONSTRAINTS[KEY]
}
