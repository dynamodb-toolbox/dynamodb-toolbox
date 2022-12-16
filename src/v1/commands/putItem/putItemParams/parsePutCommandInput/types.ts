import { EntityV2, Item, Attribute, PutItemInput, PossiblyUndefinedResolvedAttribute } from 'v1'

export type PutCommandInputParser<SCHEMA_CONSTRAINT extends EntityV2 | Item | Attribute> = <
  SCHEMA extends SCHEMA_CONSTRAINT,
  PUT_ITEM_INPUT extends PutItemInput<SCHEMA, true> = PutItemInput<SCHEMA, true>
>(
  schema: SCHEMA,
  putItemInput: PossiblyUndefinedResolvedAttribute
) => PUT_ITEM_INPUT
