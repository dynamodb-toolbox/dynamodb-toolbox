import { DynamoDBToolboxError } from 'v1/errors'
import type { HasComputedDefaults, Item } from 'v1/item'
import type { TableV2, PrimaryKey } from 'v1/table'

import type {
  NeedsKeyCompute,
  KeyInput,
  ItemPutDefaultsComputer,
  ItemDefaultsComputer
} from './generics'
import { addInternalAttributes, WithInternalAttributes, doesItemValidateTableSchema } from './utils'

export class EntityV2<
  NAME extends string = string,
  TABLE extends TableV2 = TableV2,
  ITEM extends Item = Item,
  ENTITY_NAME_ATTRIBUTE_NAME extends string = string extends NAME ? string : 'entity',
  TIMESTAMPS extends boolean = string extends NAME ? boolean : true,
  PUT_DEFAULTS_COMPUTER = Item extends ITEM ? ItemDefaultsComputer : ItemPutDefaultsComputer<ITEM>,
  CONSTRUCTOR_PUT_DEFAULTS_COMPUTER extends PUT_DEFAULTS_COMPUTER = PUT_DEFAULTS_COMPUTER
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public item: WithInternalAttributes<ITEM, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, NAME, TIMESTAMPS>
  public timestamps: TIMESTAMPS
  public entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  // any is needed for contravariance
  computeKey?: (keyInput: Item extends ITEM ? any : KeyInput<ITEM>) => PrimaryKey<TABLE>
  computedDefaults?: PUT_DEFAULTS_COMPUTER

  /**
   * Define an Entity for a given table
   *
   * @param name string
   * @param table Table
   * @param item Item
   * @param computeKey _(optional)_ Transforms key input to primary key
   * @param computedDefaults _(optional)_ Computes computed defaults
   * @param timestamps _(optional)_ Activates internal `created` & `modified` attributes (defaults to `true`)
   * @param entityNameAttributeName _(optional)_ Renames internal entity name string attribute (defaults to `entity`)
   */
  constructor({
    name,
    table,
    item,
    computeKey,
    computedDefaults,
    timestamps = true as TIMESTAMPS,
    entityNameAttributeName = 'entity' as ENTITY_NAME_ATTRIBUTE_NAME
  }: {
    name: NAME
    table: TABLE
    item: ITEM
    entityNameAttributeName?: ENTITY_NAME_ATTRIBUTE_NAME
    timestamps?: TIMESTAMPS
  } & (NeedsKeyCompute<ITEM, TABLE> extends true
    ? { computeKey: (keyInput: KeyInput<ITEM>) => PrimaryKey<TABLE> }
    : { computeKey?: undefined }) &
    (HasComputedDefaults<ITEM> extends true
      ? { computedDefaults: CONSTRUCTOR_PUT_DEFAULTS_COMPUTER }
      : { computedDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table
    this.timestamps = timestamps
    this.entityNameAttributeName = entityNameAttributeName

    if (computeKey === undefined && !doesItemValidateTableSchema(item, table)) {
      throw new DynamoDBToolboxError('entity.invalidItemSchema', {
        message: `Entity ${name}'s item does not follow its table primary key schema`
      })
    }

    this.item = addInternalAttributes({
      item,
      table,
      entityNameAttributeName,
      entityName: name,
      timestamps
    })

    this.computeKey = computeKey as any
    this.computedDefaults = computedDefaults
  }
}
