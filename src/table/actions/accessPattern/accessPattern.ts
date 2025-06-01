import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { IQueryCommand, Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'
import type { Table } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'

import { $meta, $options, $pattern, $schema } from './constants.js'

interface AccessPatternMetadata {
  title?: string
  description?: string
  [x: string]: unknown
}

export class IAccessPattern<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  SCHEMA extends Schema = Schema,
  QUERY extends Query<TABLE> = Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES> = QueryOptions<TABLE, ENTITIES>
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  // any is needed for contravariance
  [$pattern]?: (input: Schema extends SCHEMA ? any : TransformedValue<SCHEMA>) => QUERY;
  [$options]: OPTIONS;
  [$meta]: AccessPatternMetadata

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY,
    options: OPTIONS = {} as OPTIONS,
    meta: AccessPatternMetadata = {}
  ) {
    super(table, entities)
    this[$schema] = schema
    this[$pattern] = pattern
    this[$options] = options
    this[$meta] = meta
  }

  // IQueryCommand is needed for contravariance
  query(
    input: InputValue<SCHEMA>
  ): Table extends TABLE ? IQueryCommand : QueryCommand<TABLE, ENTITIES, Query<TABLE>, OPTIONS> {
    type QUERY_COMMAND = Table extends TABLE
      ? IQueryCommand
      : QueryCommand<TABLE, ENTITIES, Query<TABLE>, OPTIONS>

    const schema = this[$schema]
    if (schema === undefined) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'AccessPattern incomplete: Missing "schema" property'
      })
    }

    const pattern = this[$pattern]
    if (pattern === undefined) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'AccessPattern incomplete: Missing "pattern" property'
      })
    }

    const parser = new Parser(schema)
    const transformedInput = parser.parse(input)
    const query = pattern(transformedInput)
    const options = this[$options]

    return new QueryCommand<TABLE, ENTITIES, Query<TABLE>, OPTIONS>(
      this.table,
      this[$entities],
      query,
      options
    ) as QUERY_COMMAND
  }
}

export class AccessPattern<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  SCHEMA extends Schema = Schema,
  QUERY extends Query<TABLE> = Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES> = QueryOptions<TABLE, ENTITIES>
> extends IAccessPattern<TABLE, ENTITIES, SCHEMA, QUERY, OPTIONS> {
  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY,
    options: OPTIONS = {} as OPTIONS,
    meta: AccessPatternMetadata = {}
  ) {
    super(table, entities, schema, pattern, options, meta)
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): AccessPattern<
    TABLE,
    NEXT_ENTITIES,
    SCHEMA,
    QUERY,
    OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
      ? OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES>
  > {
    return new AccessPattern(
      this.table,
      nextEntities,
      this[$schema],
      this[$pattern],
      this[$options] as OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
        ? OPTIONS
        : QueryOptions<TABLE, NEXT_ENTITIES>
    )
  }

  schema<NEXT_SCHEMA extends Schema>(
    nextSchema: NEXT_SCHEMA
  ): AccessPattern<TABLE, ENTITIES, NEXT_SCHEMA, QUERY, OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      nextSchema,
      this[$pattern] as (input: TransformedValue<NEXT_SCHEMA>) => QUERY,
      this[$options]
    )
  }

  pattern<NEXT_QUERY extends Query<TABLE>>(
    nextPattern: (input: TransformedValue<SCHEMA>) => NEXT_QUERY
  ): AccessPattern<TABLE, ENTITIES, SCHEMA, NEXT_QUERY, OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      this[$schema],
      nextPattern,
      this[$options]
    )
  }

  options<NEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES>>(
    nextOptions: NEXT_OPTIONS
  ): AccessPattern<TABLE, ENTITIES, SCHEMA, QUERY, NEXT_OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      this[$schema],
      this[$pattern],
      nextOptions
    )
  }

  meta(nextMeta: AccessPatternMetadata): AccessPattern<TABLE, ENTITIES, SCHEMA, QUERY, OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      this[$schema],
      this[$pattern],
      this[$options],
      nextMeta
    )
  }
}
