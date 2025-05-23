import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'

import { $options, $pattern, $schema } from './constants.js'

export type Pattern<ENTITY extends Entity, SCHEMA extends Schema> = (
  input: TransformedValue<SCHEMA>
) => Query<ENTITY['table']>

export class AccessPattern<
  ENTITY extends Entity = Entity,
  SCHEMA extends Schema = Schema,
  OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY]> = QueryOptions<ENTITY['table'], [ENTITY]>
> extends EntityAction<ENTITY> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  [$pattern]?: Pattern<ENTITY, SCHEMA>;
  [$options]: OPTIONS

  constructor(
    entity: ENTITY,
    schema?: SCHEMA,
    pattern?: Pattern<ENTITY, SCHEMA>,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(entity)
    this[$schema] = schema
    this[$pattern] = pattern
    this[$options] = options
  }

  schema<NEXT_SCHEMA extends Schema>(
    nextSchema: NEXT_SCHEMA
  ): AccessPattern<ENTITY, NEXT_SCHEMA, OPTIONS> {
    return new AccessPattern(
      this.entity,
      nextSchema,
      this[$pattern] as unknown as Pattern<ENTITY, NEXT_SCHEMA>,
      this[$options]
    )
  }

  pattern(nextPattern: Pattern<ENTITY, SCHEMA>): AccessPattern<ENTITY, SCHEMA, OPTIONS> {
    return new AccessPattern(this.entity, this[$schema], nextPattern, this[$options])
  }

  options<NEXT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY]>>(
    nextOptions: NEXT_OPTIONS
  ): AccessPattern<ENTITY, SCHEMA, NEXT_OPTIONS> {
    return new AccessPattern(this.entity, this[$schema], this[$pattern], nextOptions)
  }

  query(
    input: InputValue<SCHEMA>
  ): QueryCommand<ENTITY['table'], [ENTITY], Query<ENTITY['table']>, OPTIONS> {
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

    return new QueryCommand<ENTITY['table'], [ENTITY], Query<ENTITY['table']>, OPTIONS>(
      this.entity.table,
      [this.entity],
      query,
      options
    )
  }
}
