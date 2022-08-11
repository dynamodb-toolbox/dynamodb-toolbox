import type { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export type IndexableKeyType = 'string' | 'binary' | 'number'

export interface Key<N extends string = string, T extends IndexableKeyType = IndexableKeyType> {
  name: N
  type: T
}

export type NarrowKey<I extends Key> = {
  [K in keyof I]: I[K]
}

export class Table<PK extends Key = Key, SK extends Key = Key> {
  public dynamoDbClient: DynamoDBClient
  public name: string
  public partitionKey: PK
  public sortKey?: SK

  constructor({
    dynamoDbClient,
    name,
    partitionKey,
    sortKey
  }: {
    dynamoDbClient: DynamoDBClient
    name: string
    partitionKey: NarrowKey<PK>
    sortKey?: NarrowKey<SK>
  }) {
    this.dynamoDbClient = dynamoDbClient

    this.name = name

    this.partitionKey = partitionKey
    if (sortKey) {
      this.sortKey = sortKey
    }
  }
}

export type ResolveIndexableKeyType<T extends IndexableKeyType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'binary'
  ? Buffer
  : never

export type PrimaryKey<T extends Table = Table> = Table extends T
  ? Record<string, ResolveIndexableKeyType<IndexableKeyType>>
  : Key extends T['sortKey']
  ? {
      [K in T['partitionKey']['name']]: ResolveIndexableKeyType<T['partitionKey']['type']>
    }
  : NonNullable<T['sortKey']> extends Key
  ? {
      [K in
        | T['partitionKey']['name']
        | NonNullable<T['sortKey']>['name']]: K extends T['partitionKey']['name']
        ? ResolveIndexableKeyType<T['partitionKey']['type']>
        : K extends NonNullable<T['sortKey']>['name']
        ? ResolveIndexableKeyType<NonNullable<T['sortKey']>['type']>
        : never
    }
  : never
