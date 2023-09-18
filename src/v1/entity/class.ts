import type { HasComputedDefaults, Schema } from 'v1/schema'
import type { TableV2, PrimaryKey } from 'v1/table'
import type {
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand
} from 'v1/commands'
import type { KeyInput, UpdateItemInputExtension } from 'v1/commands/types'
import type { PutItemCommandClass } from 'v1/commands/putItem/command'
import type { GetItemCommandClass } from 'v1/commands/getItem/command'
import type { DeleteItemCommandClass } from 'v1/commands/deleteItem/command'
import type { UpdateItemCommandClass } from 'v1/commands/updateItem/command'
import type { CommandClass } from 'v1/commands/class'
import type { If } from 'v1/types/if'
import { DynamoDBToolboxError } from 'v1/errors'

import type {
  NeedsKeyCompute,
  SchemaDefaultsComputer,
  SchemaPutDefaultsComputer,
  SchemaUpdateDefaultsComputer
} from './generics'
import {
  TimestampsOptions,
  TimestampsDefaultOptions,
  NarrowTimestampsOptions,
  doesSchemaValidateTableSchema,
  addInternalAttributes,
  WithInternalAttributes
} from './utils'

export class EntityV2<
  NAME extends string = string,
  TABLE extends TableV2 = TableV2,
  SCHEMA extends Schema = Schema,
  ENTITY_ATTRIBUTE_NAME extends string = string extends NAME ? string : 'entity',
  TIMESTAMPS_OPTIONS extends TimestampsOptions = string extends NAME
    ? TimestampsOptions
    : TimestampsDefaultOptions,
  PUT_DEFAULTS_COMPUTER = string extends NAME
    ? SchemaDefaultsComputer
    : SchemaPutDefaultsComputer<SCHEMA>,
  CONSTRUCTOR_PUT_DEFAULTS_COMPUTER extends PUT_DEFAULTS_COMPUTER = PUT_DEFAULTS_COMPUTER,
  UPDATE_DEFAULTS_COMPUTER = string extends NAME
    ? SchemaDefaultsComputer<UpdateItemInputExtension>
    : SchemaUpdateDefaultsComputer<SCHEMA>,
  CONSTRUCTOR_UPDATE_DEFAULTS_COMPUTER extends UPDATE_DEFAULTS_COMPUTER = UPDATE_DEFAULTS_COMPUTER
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public schema: WithInternalAttributes<
    SCHEMA,
    TABLE,
    ENTITY_ATTRIBUTE_NAME,
    NAME,
    TIMESTAMPS_OPTIONS
  >
  public entityAttributeName: ENTITY_ATTRIBUTE_NAME
  public timestamps: TIMESTAMPS_OPTIONS
  // any is needed for contravariance
  public computeKey?: (
    keyInput: Schema extends SCHEMA ? any : KeyInput<SCHEMA>
  ) => PrimaryKey<TABLE>
  public putDefaults?: SchemaDefaultsComputer
  public updateDefaults?: SchemaDefaultsComputer<UpdateItemInputExtension>
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
    : COMMAND_CLASS extends UpdateItemCommandClass
    ? UpdateItemCommand<this>
    : never

  /**
   * Define an Entity for a given table
   *
   * @param name string
   * @param table Table
   * @param schema Schema
   * @param computeKey _(optional)_ Transforms key input to primary key
   * @param putDefaults _(optional)_ Computes computed defaults
   * @param timestamps _(optional)_ Activates internal `created` & `modified` attributes (defaults to `true`)
   * @param entityAttributeName _(optional)_ Renames internal entity name string attribute (defaults to `entity`)
   */
  constructor({
    name,
    table,
    schema,
    computeKey,
    putDefaults,
    updateDefaults,
    entityAttributeName = 'entity' as ENTITY_ATTRIBUTE_NAME,
    timestamps = true as NarrowTimestampsOptions<TIMESTAMPS_OPTIONS>
  }: {
    name: NAME
    table: TABLE
    schema: SCHEMA
    entityAttributeName?: ENTITY_ATTRIBUTE_NAME
    timestamps?: NarrowTimestampsOptions<TIMESTAMPS_OPTIONS>
  } & If<
    NeedsKeyCompute<SCHEMA, TABLE>,
    { computeKey: (keyInput: KeyInput<SCHEMA>) => PrimaryKey<TABLE> },
    { computeKey?: undefined }
  > &
    // Weirdly using If here triggers an infinite type recursion error
    (HasComputedDefaults<SCHEMA, 'put'> extends true
      ? { putDefaults: CONSTRUCTOR_PUT_DEFAULTS_COMPUTER }
      : { putDefaults?: undefined }) &
    (HasComputedDefaults<SCHEMA, 'update'> extends true
      ? { updateDefaults: CONSTRUCTOR_UPDATE_DEFAULTS_COMPUTER }
      : { updateDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table
    this.entityAttributeName = entityAttributeName
    this.timestamps = timestamps as TIMESTAMPS_OPTIONS

    if (computeKey === undefined && !doesSchemaValidateTableSchema(schema, table)) {
      throw new DynamoDBToolboxError('entity.invalidSchema', {
        message: `Entity ${name} schema does not follow its table primary key schema`
      })
    }

    this.schema = addInternalAttributes({
      schema,
      table,
      entityAttributeName,
      entityName: name,
      timestamps: timestamps as TIMESTAMPS_OPTIONS
    })

    this.computeKey = computeKey as any
    this.putDefaults = putDefaults as any
    this.updateDefaults = updateDefaults as any
    this.build = commandClass => new commandClass(this) as any
  }
}
