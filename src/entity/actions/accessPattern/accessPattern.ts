import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'

import { $pattern, $schema } from './constants.js'

type Pattern<ENTITY extends Entity, INPUT> = (
  input: INPUT
) => Query<ENTITY['table']> & { options?: QueryOptions<ENTITY['table'], [ENTITY]> }

export class AccessPattern<
  ENTITY extends Entity = Entity,
  SCHEMA extends Schema = Schema
> extends EntityAction<ENTITY> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  [$pattern]?: Pattern<ENTITY, TransformedValue<SCHEMA>>

  constructor(
    entity: ENTITY,
    schema?: SCHEMA,
    pattern?: Pattern<ENTITY, TransformedValue<SCHEMA>>
  ) {
    super(entity)
    this[$schema] = schema
    this[$pattern] = pattern
  }

  schema<NEXT_SCHEMA extends Schema>(nextSchema: NEXT_SCHEMA): AccessPattern<ENTITY, NEXT_SCHEMA> {
    return new AccessPattern(
      this.entity,
      nextSchema,
      this[$pattern] as unknown as Pattern<ENTITY, TransformedValue<NEXT_SCHEMA>>
    )
  }

  pattern(nextPattern: Pattern<ENTITY, TransformedValue<SCHEMA>>): AccessPattern<ENTITY, SCHEMA> {
    return new AccessPattern(this.entity, this[$schema], nextPattern)
  }

  query(input: InputValue<SCHEMA>): QueryCommand<ENTITY['table'], [ENTITY]> {
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

    return new QueryCommand<ENTITY['table'], [ENTITY]>(
      this.entity.table,
      [this.entity],
      query,
      query.options
    )
  }
}
