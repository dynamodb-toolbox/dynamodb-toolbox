import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'
import type { Table } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'

import { $pattern, $schema } from './constants.js'

type Pattern<TABLE extends Table, ENTITIES extends Entity[], INPUT> = (
  input: INPUT
) => Query<TABLE> & { options?: QueryOptions<TABLE, ENTITIES> }

export class AccessPattern<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  SCHEMA extends Schema = Schema
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  [$pattern]?: Pattern<TABLE, ENTITIES, TransformedValue<SCHEMA>>

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    schema?: SCHEMA,
    pattern?: Pattern<TABLE, ENTITIES, TransformedValue<SCHEMA>>
  ) {
    super(table, entities)
    this[$schema] = schema
    this[$pattern] = pattern
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): AccessPattern<TABLE, NEXT_ENTITIES, SCHEMA> {
    return new AccessPattern(
      this.table,
      nextEntities,
      this[$schema],
      this[$pattern] as unknown as Pattern<TABLE, NEXT_ENTITIES, TransformedValue<SCHEMA>>
    )
  }

  schema<NEXT_SCHEMA extends Schema>(
    nextSchema: NEXT_SCHEMA
  ): AccessPattern<TABLE, ENTITIES, NEXT_SCHEMA> {
    return new AccessPattern(
      this.table,
      this[$entities],
      nextSchema,
      this[$pattern] as unknown as Pattern<TABLE, ENTITIES, TransformedValue<NEXT_SCHEMA>>
    )
  }

  pattern(
    nextPattern: Pattern<TABLE, ENTITIES, TransformedValue<SCHEMA>>
  ): AccessPattern<TABLE, ENTITIES, SCHEMA> {
    return new AccessPattern(this.table, this[$entities], this[$schema], nextPattern)
  }

  query(input: InputValue<SCHEMA>): QueryCommand<TABLE, ENTITIES> {
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

    return new QueryCommand<TABLE, ENTITIES>(this.table, this[$entities], query, query.options)
  }
}
