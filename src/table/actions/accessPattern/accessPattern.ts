import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { Parser } from '~/schema/actions/parse/parser.js'
import type { InputValue, Schema, TransformedValue } from '~/schema/index.js'
import type { IQueryCommand, Query, QueryOptions } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/queryCommand.js'
import type { Table } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'
import type { Cast, _Omit } from '~/types/index.js'

import { $meta, $options, $pattern, $schema } from './constants.js'

interface AccessPatternMetadata {
  title?: string
  description?: string
  [x: string]: unknown
}

type MergeOptions<
  TABLE extends Table,
  ENTITIES extends Entity[],
  QUERY extends Query<TABLE>,
  DEFAULT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>,
  CONTEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
> =
  QueryOptions<TABLE, ENTITIES, QUERY> extends DEFAULT_OPTIONS
    ? CONTEXT_OPTIONS
    : QueryOptions<TABLE, ENTITIES, QUERY> extends CONTEXT_OPTIONS
      ? DEFAULT_OPTIONS
      : DEFAULT_OPTIONS & CONTEXT_OPTIONS

export class IAccessPattern<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  SCHEMA extends Schema = Schema,
  QUERY extends Query<TABLE> = Query<TABLE>,
  DEFAULT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<
    TABLE,
    ENTITIES,
    QUERY
  >,
  CONTEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<
    TABLE,
    ENTITIES,
    QUERY
  >
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'access-pattern' as const;

  [$schema]?: SCHEMA;
  // any is needed for contravariance
  [$pattern]?: (
    input: Schema extends SCHEMA ? any : TransformedValue<SCHEMA>
  ) => QUERY & { options?: CONTEXT_OPTIONS };
  [$options]: DEFAULT_OPTIONS;
  [$meta]: AccessPatternMetadata

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY & { options?: CONTEXT_OPTIONS },
    options: DEFAULT_OPTIONS = {} as DEFAULT_OPTIONS,
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
  ): Table extends TABLE
    ? IQueryCommand
    : QueryCommand<
        TABLE,
        ENTITIES,
        QUERY,
        MergeOptions<TABLE, ENTITIES, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS>
      > {
    type MERGED_OPTIONS = MergeOptions<TABLE, ENTITIES, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS>
    type QUERY_COMMAND = Table extends TABLE
      ? IQueryCommand
      : QueryCommand<TABLE, ENTITIES, QUERY, MERGED_OPTIONS>

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

    return new QueryCommand<TABLE, ENTITIES, QUERY, MERGED_OPTIONS>(
      this.table,
      this[$entities],
      query as QUERY,
      { ...defaultOptions, ...contextOptions } as MERGED_OPTIONS
    ) as QUERY_COMMAND
  }
}

export class AccessPattern<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  SCHEMA extends Schema = Schema,
  QUERY extends Query<TABLE> = Query<TABLE>,
  DEFAULT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<
    TABLE,
    ENTITIES,
    QUERY
  >,
  CONTEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<
    TABLE,
    ENTITIES,
    QUERY
  >
> extends IAccessPattern<TABLE, ENTITIES, SCHEMA, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    schema?: SCHEMA,
    pattern?: (input: TransformedValue<SCHEMA>) => QUERY & { options?: CONTEXT_OPTIONS },
    options: DEFAULT_OPTIONS = {} as DEFAULT_OPTIONS,
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
    DEFAULT_OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
      ? DEFAULT_OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES, QUERY>,
    CONTEXT_OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
      ? CONTEXT_OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
  > {
    return new AccessPattern(
      this.table,
      nextEntities,
      this[$schema],
      this[$pattern] as (input: TransformedValue<SCHEMA>) => QUERY & {
        options: CONTEXT_OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
          ? CONTEXT_OPTIONS
          : QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
      },
      this[$options] as DEFAULT_OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
        ? DEFAULT_OPTIONS
        : QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
    )
  }

  schema<NEXT_SCHEMA extends Schema>(
    nextSchema: NEXT_SCHEMA
  ): AccessPattern<TABLE, ENTITIES, NEXT_SCHEMA, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      nextSchema,
      this[$pattern] as (
        input: TransformedValue<NEXT_SCHEMA>
      ) => QUERY & { options?: CONTEXT_OPTIONS },
      this[$options]
    )
  }

  pattern<
    NEXT_QUERY extends Query<TABLE>,
    NEXT_CONTEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, NEXT_QUERY>
  >(
    nextPattern: (
      input: TransformedValue<SCHEMA>
    ) => NEXT_QUERY & { options?: NEXT_CONTEXT_OPTIONS }
  ): AccessPattern<
    TABLE,
    ENTITIES,
    SCHEMA,
    Cast<_Omit<NEXT_QUERY, 'options'>, Query<TABLE>>,
    DEFAULT_OPTIONS,
    NEXT_CONTEXT_OPTIONS
  > {
    return new AccessPattern(
      this.table,
      this[$entities],
      this[$schema],
      /**
       * @debt v3 "put query in a 'query' key so it's not polluted by the options"
       */
      nextPattern as any,
      this[$options]
    )
  }

  options<NEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>>(
    nextOptions: NEXT_OPTIONS | ((prevOptions: DEFAULT_OPTIONS) => NEXT_OPTIONS)
  ): AccessPattern<TABLE, ENTITIES, SCHEMA, QUERY, NEXT_OPTIONS, CONTEXT_OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      this[$schema],
      this[$pattern],
      typeof nextOptions === 'function' ? nextOptions(this[$options]) : nextOptions
    )
  }

  meta(
    nextMeta: AccessPatternMetadata
  ): AccessPattern<TABLE, ENTITIES, SCHEMA, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
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
