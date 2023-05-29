import type { HasComputedDefaults, Schema } from 'v1/schema'
import type { TableV2, PrimaryKey } from 'v1/table'
import type { PutItemCommand, GetItemCommand, DeleteItemCommand } from 'v1/commands'
import type { PutItemCommandClass } from 'v1/commands/putItem/command'
import type { GetItemCommandClass } from 'v1/commands/getItem/command'
import type { DeleteItemCommandClass } from 'v1/commands/deleteItem/command'
import type { CommandClass } from 'v1/commands/class'
import { DynamoDBToolboxError } from 'v1/errors'

import type {
  NeedsKeyCompute,
  KeyInput,
  SchemaPutDefaultsComputer,
  SchemaDefaultsComputer
} from './generics'
import {
  addInternalAttributes,
  WithInternalAttributes,
  doesSchemaValidateTableSchema
} from './utils'

export class EntityV2<
  NAME extends string = string,
  TABLE extends TableV2 = TableV2,
  SCHEMA extends Schema = Schema,
  ENTITY_NAME_ATTRIBUTE_NAME extends string = string extends NAME ? string : 'entity',
  TIMESTAMPS extends boolean = string extends NAME ? boolean : true,
  CREATED_TIMESTAMP_ATTRIBUTE_NAME extends string = string extends NAME ? string : 'created',
  CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string = string extends NAME ? string : '_ct',
  MODIFIED_TIMESTAMP_ATTRIBUTE_NAME extends string = string extends NAME ? string : 'modified',
  MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS extends string = string extends NAME ? string : '_md',
  PUT_DEFAULTS_COMPUTER = Schema extends SCHEMA
    ? SchemaDefaultsComputer
    : SchemaPutDefaultsComputer<SCHEMA>,
  CONSTRUCTOR_PUT_DEFAULTS_COMPUTER extends PUT_DEFAULTS_COMPUTER = PUT_DEFAULTS_COMPUTER
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public schema: WithInternalAttributes<
    SCHEMA,
    TABLE,
    ENTITY_NAME_ATTRIBUTE_NAME,
    NAME,
    TIMESTAMPS,
    CREATED_TIMESTAMP_ATTRIBUTE_NAME,
    CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
    MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
    MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  >
  public entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
  public timestamps: TIMESTAMPS
  public createdTimestampAttributeName: CREATED_TIMESTAMP_ATTRIBUTE_NAME
  public createdTimestampAttributeSavedAs: CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  public modifiedTimestampAttributeName: MODIFIED_TIMESTAMP_ATTRIBUTE_NAME
  public modifiedTimestampAttributeSavedAs: MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  // any is needed for contravariance
  public computeKey?: (
    keyInput: Schema extends SCHEMA ? any : KeyInput<SCHEMA>
  ) => PrimaryKey<TABLE>
  public computedDefaults?: SchemaDefaultsComputer
  // TODO: Maybe there's a way not to have to list all commands here
  // (use COMMAND_CLASS somehow) but I haven't found it yet
  public build: <COMMAND_CLASS extends typeof CommandClass = typeof CommandClass>(
    commandClass: COMMAND_CLASS
  ) => string extends NAME
    ? unknown
    : COMMAND_CLASS extends PutItemCommandClass
    ? PutItemCommand<this>
    : COMMAND_CLASS extends GetItemCommandClass
    ? GetItemCommand<this>
    : COMMAND_CLASS extends DeleteItemCommandClass
    ? DeleteItemCommand<this>
    : never

  /**
   * Define an Entity for a given table
   *
   * @param name string
   * @param table Table
   * @param schema Schema
   * @param computeKey _(optional)_ Transforms key input to primary key
   * @param computedDefaults _(optional)_ Computes computed defaults
   * @param timestamps _(optional)_ Activates internal `created` & `modified` attributes (defaults to `true`)
   * @param entityNameAttributeName _(optional)_ Renames internal entity name string attribute (defaults to `entity`)
   */
  constructor({
    name,
    table,
    schema,
    computeKey,
    computedDefaults,
    entityNameAttributeName = 'entity' as ENTITY_NAME_ATTRIBUTE_NAME,
    timestamps = true as TIMESTAMPS,
    created = 'created' as CREATED_TIMESTAMP_ATTRIBUTE_NAME,
    createdSavedAs = '_ct' as CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS,
    modified = 'modified' as MODIFIED_TIMESTAMP_ATTRIBUTE_NAME,
    modifiedSavedAs = '_md' as MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  }: {
    name: NAME
    table: TABLE
    schema: SCHEMA
    entityNameAttributeName?: ENTITY_NAME_ATTRIBUTE_NAME
    /**
     * @debt interface "Find a way to group all of this in single attribute"
     */
    timestamps?: TIMESTAMPS
    created?: CREATED_TIMESTAMP_ATTRIBUTE_NAME
    createdSavedAs?: CREATED_TIMESTAMP_ATTRIBUTE_SAVED_AS
    modified?: MODIFIED_TIMESTAMP_ATTRIBUTE_NAME
    modifiedSavedAs?: MODIFIED_TIMESTAMP_ATTRIBUTE_SAVED_AS
  } & (NeedsKeyCompute<SCHEMA, TABLE> extends true
    ? { computeKey: (keyInput: KeyInput<SCHEMA>) => PrimaryKey<TABLE> }
    : { computeKey?: undefined }) &
    (HasComputedDefaults<SCHEMA> extends true
      ? { computedDefaults: CONSTRUCTOR_PUT_DEFAULTS_COMPUTER }
      : { computedDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table
    this.entityNameAttributeName = entityNameAttributeName
    this.timestamps = timestamps
    this.createdTimestampAttributeName = created
    this.createdTimestampAttributeSavedAs = createdSavedAs
    this.modifiedTimestampAttributeName = modified
    this.modifiedTimestampAttributeSavedAs = modifiedSavedAs

    if (computeKey === undefined && !doesSchemaValidateTableSchema(schema, table)) {
      throw new DynamoDBToolboxError('entity.invalidSchema', {
        message: `Entity ${name} schema does not follow its table primary key schema`
      })
    }

    this.schema = addInternalAttributes({
      schema,
      table,
      entityNameAttributeName,
      entityName: name,
      timestamps,
      createdTimestampAttributeName: created,
      createdTimestampAttributeSavedAs: createdSavedAs,
      modifiedTimestampAttributeName: modified,
      modifiedTimestampAttributeSavedAs: modifiedSavedAs
    })

    this.computeKey = computeKey as any
    this.computedDefaults = computedDefaults as SchemaDefaultsComputer
    this.build = commandClass => new commandClass(this) as any
  }
}
