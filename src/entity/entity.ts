import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'
import type { Table } from '~/table/index.js'
import type { If } from '~/types/if.js'

import {
  NarrowTimestampsOptions,
  NeedsKeyCompute,
  TimestampsDefaultOptions,
  TimestampsOptions,
  WithInternalAttributes,
  addInternalAttributes,
  doesSchemaValidateTableSchema
} from './utils/index.js'

export class Entity<
  NAME extends string = string,
  TABLE extends Table = Table,
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
    keyInput: Schema extends SCHEMA ? any : ParserInput<SCHEMA, { mode: 'key'; fill: false }>
  ) => PrimaryKey<TABLE>

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
    {
      computeKey: (keyInput: ParserInput<SCHEMA, { mode: 'key'; fill: false }>) => PrimaryKey<TABLE>
    },
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

    this.schema = addInternalAttributes({
      schema,
      table: this.table,
      entityAttributeName: this.entityAttributeName,
      entityName: this.name,
      timestamps: this.timestamps
    })

    this.computeKey = computeKey as any
  }

  build<ACTION_CLASS extends EntityAction<this> = EntityAction<this>>(
    actionClass: new (entity: this) => ACTION_CLASS
  ): ACTION_CLASS {
    return new actionClass(this)
  }
}

export const $entity = Symbol('$entity')
export type $entity = typeof $entity

export class EntityAction<ENTITY extends Entity = Entity> {
  static actionName: string;

  [$entity]: ENTITY

  constructor(entity: ENTITY) {
    this[$entity] = entity
  }
}
