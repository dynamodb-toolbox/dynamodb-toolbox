import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { IQueryCommand, Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'
import type { Overwrite } from '~/types/index.js'

import { $meta, $options, $pattern, $schema } from './constants.js'

interface AccessPatternMetadata {
  title?: string
  description?: string
}

type MergeOptions<
  ENTITY extends Entity,
  QUERY extends Query<ENTITY['table']>,
  DEFAULT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY>,
  CONTEXT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY>
> =
  QueryOptions<ENTITY['table'], [ENTITY], QUERY> extends DEFAULT_OPTIONS
    ? CONTEXT_OPTIONS
    : QueryOptions<ENTITY['table'], [ENTITY], QUERY> extends CONTEXT_OPTIONS
      ? DEFAULT_OPTIONS
      : Overwrite<DEFAULT_OPTIONS, CONTEXT_OPTIONS> & CONTEXT_OPTIONS

/** Internal `AccessPattern` that builds a `QueryCommand` from a parsed input. */
export class IAccessPattern<
  ENTITY extends Entity = Entity,
  SCHEMA extends Schema = Schema,
  QUERY extends Query<ENTITY['table']> = Query<ENTITY['table']>,
  DEFAULT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY> = QueryOptions<
    ENTITY['table'],
    [ENTITY],
    QUERY
  >,
  CONTEXT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY> = QueryOptions<
    ENTITY['table'],
    [ENTITY],
    QUERY
  >
> extends EntityAction<ENTITY> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  // any is needed for contravariance
  [$pattern]?: (
    input: Schema extends SCHEMA ? any : TransformedValue<SCHEMA>
  ) => QUERY & { options?: CONTEXT_OPTIONS };
  [$options]: DEFAULT_OPTIONS;
  [$meta]: AccessPatternMetadata

  /** Bind the pattern to an entity, schema, transform, options and metadata. */
  constructor(
    entity: ENTITY,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY & { options?: CONTEXT_OPTIONS },
    options: DEFAULT_OPTIONS = {} as DEFAULT_OPTIONS,
    meta: AccessPatternMetadata = {}
  ) {
    super(entity)
    this[$schema] = schema
    this[$pattern] = pattern
    this[$options] = options
    this[$meta] = meta
  }

  // IQueryCommand is needed for contravariance
  /** Parse an input against the schema, run the pattern transform and build the resulting `QueryCommand`. */
  query(
    input: InputValue<SCHEMA>
  ): Entity extends ENTITY
    ? IQueryCommand
    : QueryCommand<
        ENTITY['table'],
        [ENTITY],
        QUERY,
        MergeOptions<ENTITY, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS>
      > {
    type MERGED_OPTIONS = MergeOptions<ENTITY, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS>
    type QUERY_COMMAND = Entity extends ENTITY
      ? IQueryCommand
      : QueryCommand<ENTITY['table'], [ENTITY], QUERY, MERGED_OPTIONS>

    const schema = this[$schema]
    const transformedInput =
      schema !== undefined
        ? new Parser(schema).parse(input)
        : (undefined as TransformedValue<SCHEMA>)

    const pattern = this[$pattern]
    if (pattern === undefined) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'AccessPattern incomplete: Missing "pattern" property'
      })
    }

    const defaultOptions = this[$options]
    const { options: contextOptions, ...query } = pattern(transformedInput)

    return new QueryCommand<ENTITY['table'], [ENTITY], QUERY, MERGED_OPTIONS>(
      this.entity.table,
      [this.entity],
      query as QUERY,
      { ...defaultOptions, ...contextOptions } as MERGED_OPTIONS
    ) as QUERY_COMMAND
  }
}

/** A reusable, named query pattern binding a typed input schema to a `query` transform. */
export class AccessPattern<
  ENTITY extends Entity = Entity,
  SCHEMA extends Schema = Schema,
  QUERY extends Query<ENTITY['table']> = Query<ENTITY['table']>,
  DEFAULT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY> = QueryOptions<
    ENTITY['table'],
    [ENTITY],
    QUERY
  >,
  CONTEXT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY> = QueryOptions<
    ENTITY['table'],
    [ENTITY],
    QUERY
  >
> extends IAccessPattern<ENTITY, SCHEMA, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
  /** Bind the pattern to an entity, schema, transform, options and metadata. */
  constructor(
    entity: ENTITY,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY & { options?: CONTEXT_OPTIONS },
    options: DEFAULT_OPTIONS = {} as DEFAULT_OPTIONS,
    meta: AccessPatternMetadata = {}
  ) {
    super(entity, schema, pattern, options, meta)
  }

  /** Set the input schema parsed before running the pattern. */
  schema<NEXT_SCHEMA extends Schema>(
    nextSchema: NEXT_SCHEMA
  ): AccessPattern<ENTITY, NEXT_SCHEMA, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
    return new AccessPattern(
      this.entity,
      nextSchema,
      this[$pattern] as (
        input: TransformedValue<NEXT_SCHEMA>
      ) => QUERY & { options?: CONTEXT_OPTIONS },
      this[$options],
      this[$meta]
    )
  }

  /** Set the transform mapping a parsed input to a `query` (and optional context options). */
  pattern<
    NEXT_QUERY extends Query<ENTITY['table']>,
    NEXT_CONTEXT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], NEXT_QUERY>
  >(
    nextPattern: (
      input: TransformedValue<SCHEMA>
    ) => NEXT_QUERY & { options?: NEXT_CONTEXT_OPTIONS }
  ): AccessPattern<ENTITY, SCHEMA, NEXT_QUERY, DEFAULT_OPTIONS, NEXT_CONTEXT_OPTIONS> {
    return new AccessPattern(
      this.entity,
      this[$schema],
      /**
       * @debt v3 "put query in a 'query' key so it's not polluted by the options"
       */
      nextPattern as any,
      this[$options],
      this[$meta]
    )
  }

  /** Set the default query options, or derive them from the previous ones. */
  options<NEXT_DEFAULT_OPTIONS extends QueryOptions<ENTITY['table'], [ENTITY], QUERY>>(
    nextOptions: NEXT_DEFAULT_OPTIONS | ((prevOptions: DEFAULT_OPTIONS) => NEXT_DEFAULT_OPTIONS)
  ): AccessPattern<ENTITY, SCHEMA, QUERY, NEXT_DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
    return new AccessPattern(
      this.entity,
      this[$schema],
      this[$pattern],
      typeof nextOptions === 'function' ? nextOptions(this[$options]) : nextOptions,
      this[$meta]
    )
  }

  /** Set the pattern's metadata (title, description, ...). */
  meta(
    nextMeta: AccessPatternMetadata
  ): AccessPattern<ENTITY, SCHEMA, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
    return new AccessPattern(this.entity, this[$schema], this[$pattern], this[$options], nextMeta)
  }
}
