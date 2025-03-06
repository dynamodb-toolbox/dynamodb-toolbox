import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ItemSchema, ValidValue } from '~/schema/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'
import type { Table } from '~/table/index.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { If } from '~/types/if.js'

import { $interceptor, $sentArgs } from './constants.js'
import type {
  BuildEntitySchema,
  EntityAttrDefaultOptions,
  EntityAttrOptions,
  EntityAttributes,
  NarrowOptions,
  NeedsKeyCompute,
  SchemaOf,
  TimestampsDefaultOptions,
  TimestampsOptions
} from './utils/index.js'
import { buildEntitySchema, doesSchemaValidateTableSchema } from './utils/index.js'

export class Entity<
  NAME extends string = string,
  TABLE extends Table = Table,
  ATTRIBUTES extends EntityAttributes = EntityAttributes,
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions = string extends NAME
    ? EntityAttrOptions
    : EntityAttrDefaultOptions,
  TIMESTAMPS_OPTIONS extends TimestampsOptions = string extends NAME
    ? TimestampsOptions
    : TimestampsDefaultOptions
> {
  public type: 'entity'
  public entityName: NAME
  public table: TABLE
  public attributes: ATTRIBUTES
  public schema: BuildEntitySchema<ATTRIBUTES, TABLE, NAME, ENTITY_ATTR_OPTIONS, TIMESTAMPS_OPTIONS>
  public entityAttribute: ENTITY_ATTR_OPTIONS
  public timestamps: TIMESTAMPS_OPTIONS
  // any is needed for contravariance
  public computeKey?: (
    keyInput: EntityAttributes extends ATTRIBUTES
      ? any
      : ValidValue<ItemSchema<ATTRIBUTES>, { mode: 'key' }>
  ) => PrimaryKey<TABLE>;

  [$interceptor]?: (action: EntitySendableAction) => any

  constructor({
    name,
    table,
    schema,
    computeKey,
    entityAttribute = true as ENTITY_ATTR_OPTIONS,
    timestamps = true as NarrowOptions<TIMESTAMPS_OPTIONS>
  }: {
    name: NAME
    table: TABLE
    schema: SchemaOf<ATTRIBUTES>
    entityAttribute?: ENTITY_ATTR_OPTIONS
    timestamps?: NarrowOptions<TIMESTAMPS_OPTIONS>
  } & If<
    NeedsKeyCompute<ATTRIBUTES, TABLE>,
    {
      computeKey: (
        keyInput: ValidValue<ItemSchema<ATTRIBUTES>, { mode: 'key' }>
      ) => PrimaryKey<TABLE>
    },
    { computeKey?: undefined }
  >) {
    this.type = 'entity'
    this.entityName = name
    this.table = table
    this.entityAttribute = entityAttribute
    this.timestamps = timestamps as TIMESTAMPS_OPTIONS

    if (computeKey === undefined && !doesSchemaValidateTableSchema(schema, table)) {
      throw new DynamoDBToolboxError('entity.invalidSchema', {
        message: `Entity ${name} schema does not follow its table primary key schema`
      })
    }

    this.attributes = schema.attributes
    this.schema = buildEntitySchema({ ...this, schema })
    this.schema.check()

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
  send(documentClientOptions?: DocumentClientOptions): Promise<any>
}
