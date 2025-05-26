import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { IQueryCommand, Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'

import { $options, $pattern, $schema } from './constants.js'

export class IAccessPattern<
  ENTITY extends Entity = Entity,
  SCHEMA extends Schema = Schema,
  QUERY extends Query<ENTITY['table']> = Query<ENTITY['table']>,
  OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY> = QueryOptions<
    ENTITY['table'],
    [ENTITY],
    QUERY
  >
> extends EntityAction<ENTITY> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  // any is needed for contravariance
  [$pattern]?: (input: Schema extends SCHEMA ? any : TransformedValue<SCHEMA>) => QUERY;
  [$options]: OPTIONS

  constructor(
    entity: ENTITY,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(entity)
    this[$schema] = schema
    this[$pattern] = pattern
    this[$options] = options
  }

  // IQueryCommand is needed for contravariance
  query(
    input: InputValue<SCHEMA>
  ): Entity extends ENTITY
    ? IQueryCommand
    : QueryCommand<ENTITY['table'], [ENTITY], QUERY, OPTIONS> {
    type QUERY_COMMAND = Entity extends ENTITY
      ? IQueryCommand
      : QueryCommand<ENTITY['table'], [ENTITY], QUERY, OPTIONS>

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

    return new QueryCommand<ENTITY['table'], [ENTITY], QUERY, OPTIONS>(
      this.entity.table,
      [this.entity],
      query,
      options
    ) as QUERY_COMMAND
  }
}

export class AccessPattern<
  ENTITY extends Entity = Entity,
  SCHEMA extends Schema = Schema,
  QUERY extends Query<ENTITY['table']> = Query<ENTITY['table']>,
  OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY> = QueryOptions<
    ENTITY['table'],
    [ENTITY],
    QUERY
  >
> extends IAccessPattern<ENTITY, SCHEMA, QUERY, OPTIONS> {
  constructor(
    entity: ENTITY,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(entity, schema, pattern, options)
  }

  schema<NEXT_SCHEMA extends Schema>(
    nextSchema: NEXT_SCHEMA
  ): AccessPattern<ENTITY, NEXT_SCHEMA, QUERY, OPTIONS> {
    return new AccessPattern(
      this.entity,
      nextSchema,
      this[$pattern] as (input: TransformedValue<NEXT_SCHEMA>) => QUERY,
      this[$options]
    )
  }

  pattern<NEXT_QUERY extends Query<ENTITY['table']>>(
    nextPattern: (input: TransformedValue<SCHEMA>) => NEXT_QUERY
  ): AccessPattern<ENTITY, SCHEMA, NEXT_QUERY, OPTIONS> {
    return new AccessPattern(this.entity, this[$schema], nextPattern, this[$options])
  }

  options<NEXT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY>>(
    nextOptions: NEXT_OPTIONS
  ): AccessPattern<ENTITY, SCHEMA, QUERY, NEXT_OPTIONS> {
    return new AccessPattern(this.entity, this[$schema], this[$pattern], nextOptions)
  }
}
