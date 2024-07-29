import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'
import type { Table } from '~/table/index.js'
import type { If } from '~/types/if.js'

import { $interceptor, $sentArgs } from './constants.js'
import { addInternalAttributes, doesSchemaValidateTableSchema } from './utils/index.js'
import type {
  NarrowTimestampsOptions,
  NeedsKeyCompute,
  TimestampsDefaultOptions,
  TimestampsOptions,
  WithInternalAttributes
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
  ) => PrimaryKey<TABLE>;

  [$interceptor]?: (action: EntitySendableAction) => any

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

  build<ACTION extends EntityAction<this> = EntityAction<this>>(
    Action: new (entity: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}

export class EntityAction<ENTITY extends Entity = Entity> {
  static actionName: string

  constructor(public entity: ENTITY) {}
}

export interface EntitySendableAction<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  [$sentArgs](): any[]
  send(): Promise<any>
}
