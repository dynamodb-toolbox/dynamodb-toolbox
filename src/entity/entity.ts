import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema, ValidValue } from '~/schema/index.js'
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
    : TimestampsDefaultOptions,
  ENTITY_ATTRIBUTE_HIDDEN extends boolean = string extends NAME ? boolean : true
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public constructorSchema: SCHEMA
  public schema: WithInternalAttributes<
    SCHEMA,
    TABLE,
    ENTITY_ATTRIBUTE_NAME,
    ENTITY_ATTRIBUTE_HIDDEN,
    NAME,
    TIMESTAMPS_OPTIONS
  >
  /**
   * @debt v2 "merge in a single `entityAttribute` options object like `timestamps`. Also true for generics"
   */
  public entityAttributeName: ENTITY_ATTRIBUTE_NAME
  public entityAttributeHidden: ENTITY_ATTRIBUTE_HIDDEN
  public timestamps: TIMESTAMPS_OPTIONS
  // any is needed for contravariance
  public computeKey?: (
    keyInput: Schema extends SCHEMA ? any : ValidValue<SCHEMA, { mode: 'key' }>
  ) => PrimaryKey<TABLE>;

  [$interceptor]?: (action: EntitySendableAction) => any

  constructor({
    name,
    table,
    schema,
    computeKey,
    entityAttributeName = 'entity' as ENTITY_ATTRIBUTE_NAME,
    entityAttributeHidden = true as ENTITY_ATTRIBUTE_HIDDEN,
    timestamps = true as NarrowTimestampsOptions<TIMESTAMPS_OPTIONS>
  }: {
    name: NAME
    table: TABLE
    schema: SCHEMA
    entityAttributeName?: ENTITY_ATTRIBUTE_NAME
    entityAttributeHidden?: ENTITY_ATTRIBUTE_HIDDEN
    timestamps?: NarrowTimestampsOptions<TIMESTAMPS_OPTIONS>
  } & If<
    NeedsKeyCompute<SCHEMA, TABLE>,
    { computeKey: (keyInput: ValidValue<SCHEMA, { mode: 'key' }>) => PrimaryKey<TABLE> },
    { computeKey?: undefined }
  >) {
    this.type = 'entity'
    this.name = name
    this.table = table
    this.entityAttributeName = entityAttributeName
    this.entityAttributeHidden = entityAttributeHidden
    this.timestamps = timestamps as TIMESTAMPS_OPTIONS

    if (computeKey === undefined && !doesSchemaValidateTableSchema(schema, table)) {
      throw new DynamoDBToolboxError('entity.invalidSchema', {
        message: `Entity ${name} schema does not follow its table primary key schema`
      })
    }

    this.constructorSchema = schema
    this.schema = addInternalAttributes({
      schema,
      table: this.table,
      entityAttributeName: this.entityAttributeName,
      entityAttributeHidden: this.entityAttributeHidden,
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
