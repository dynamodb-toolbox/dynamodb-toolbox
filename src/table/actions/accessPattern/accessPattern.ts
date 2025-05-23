import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'
import type { Table } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'

import { $options, $pattern, $schema } from './constants.js'

export type Pattern<TABLE extends Table, SCHEMA extends Schema> = (
  input: TransformedValue<SCHEMA>
) => Query<TABLE>

export class AccessPattern<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  SCHEMA extends Schema = Schema,
  OPTIONS extends QueryOptions<TABLE, ENTITIES> = QueryOptions<TABLE, ENTITIES>
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  [$pattern]?: Pattern<TABLE, SCHEMA>;
  [$options]: OPTIONS

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    schema?: SCHEMA,
    pattern?: Pattern<TABLE, SCHEMA>,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$schema] = schema
    this[$pattern] = pattern
    this[$options] = options
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): AccessPattern<
    TABLE,
    NEXT_ENTITIES,
    SCHEMA,
    OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
      ? OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES>
  > {
    return new AccessPattern(
      this.table,
      nextEntities,
      this[$schema],
      this[$pattern] as unknown as Pattern<TABLE, SCHEMA>,
      this[$options] as OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
        ? OPTIONS
        : QueryOptions<TABLE, NEXT_ENTITIES>
    )
  }

  schema<NEXT_SCHEMA extends Schema>(
    nextSchema: NEXT_SCHEMA
  ): AccessPattern<TABLE, ENTITIES, NEXT_SCHEMA, OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      nextSchema,
      this[$pattern] as unknown as Pattern<TABLE, NEXT_SCHEMA>,
      this[$options]
    )
  }

  pattern(nextPattern: Pattern<TABLE, SCHEMA>): AccessPattern<TABLE, ENTITIES, SCHEMA, OPTIONS> {
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
  ): AccessPattern<TABLE, ENTITIES, SCHEMA, NEXT_OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      this[$schema],
      this[$pattern],
      nextOptions
    )
  }

  query(input: InputValue<SCHEMA>): QueryCommand<TABLE, ENTITIES, Query<TABLE>, OPTIONS> {
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
    )
  }
}
