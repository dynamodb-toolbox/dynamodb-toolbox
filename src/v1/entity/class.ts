import type { Schema } from 'v1/schema'
import type { TableV2, PrimaryKey } from 'v1/table'
import type { KeyInput } from 'v1/commands/types'
import type { EntityCommand } from 'v1/commands/class'
import type { If } from 'v1/types/if'
import { DynamoDBToolboxError } from 'v1/errors'

import type { NeedsKeyCompute } from './generics'
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
    : TimestampsDefaultOptions
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
  public build: <COMMAND_CLASS extends typeof EntityCommand = typeof EntityCommand>(
    commandClass: COMMAND_CLASS
  ) => InstanceType<COMMAND_CLASS>

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
    { computeKey: (keyInput: KeyInput<SCHEMA, true>) => PrimaryKey<TABLE> },
    { computeKey?: undefined }
  >) {
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

    // TODO: Simplify now that '.and(...)' method is available?
    this.schema = addInternalAttributes({
      schema,
      table: this.table,
      entityAttributeName: this.entityAttributeName,
      entityName: this.name,
      timestamps: this.timestamps
    })

    this.computeKey = computeKey as any
    this.build = commandClass => new commandClass(this) as any
  }
}
