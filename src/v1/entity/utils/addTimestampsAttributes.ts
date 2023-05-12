import type { Item, AtLeastOnce, PrimitiveAttribute } from 'v1/item'

import { WithRootAttribute, addRootAttribute } from './addRootAttribute'

export type TimestampAttribute<SAVED_AS extends string> = PrimitiveAttribute<
  'string',
  {
    required: AtLeastOnce
    hidden: false
    key: false
    savedAs: SAVED_AS
    enum: undefined
    default: () => string
  }
>

export type WithTimestampAttributes<
  ITEM extends Item,
  ENTITY_NAME extends string
> = string extends ENTITY_NAME
  ? ITEM
  : WithRootAttribute<
      WithRootAttribute<ITEM, 'created', TimestampAttribute<'_ct'>>,
      'modified',
      TimestampAttribute<'_md'>
    >

type TimestampAttributesAdder = <ITEM extends Item, ENTITY_NAME extends string>({
  item,
  entityName
}: {
  item: ITEM
  entityName: ENTITY_NAME
}) => WithTimestampAttributes<ITEM, ENTITY_NAME>

export const addTimestampAttributes: TimestampAttributesAdder = <
  ITEM extends Item,
  ENTITY_NAME extends string
>({
  item
}: {
  item: ITEM
  entityName: ENTITY_NAME
}) => {
  const createdAttribute: TimestampAttribute<'_ct'> = {
    path: 'created',
    type: 'string',
    required: 'atLeastOnce',
    hidden: false,
    key: false,
    savedAs: '_ct',
    enum: undefined,
    default: () => new Date().toISOString()
  }

  const withCreatedAttribute = addRootAttribute(item, 'created', createdAttribute)

  const lastModifiedAttribute: TimestampAttribute<'_md'> = {
    path: 'modified',
    type: 'string',
    required: 'atLeastOnce',
    hidden: false,
    key: false,
    savedAs: '_md',
    enum: undefined,
    default: () => new Date().toISOString()
  }

  const withTimestampAttributes = addRootAttribute(
    withCreatedAttribute,
    'modified',
    lastModifiedAttribute
  )

  return withTimestampAttributes as WithTimestampAttributes<ITEM, ENTITY_NAME>
}
