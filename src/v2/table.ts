type IndexableKeyType = 'string' | 'binary' | 'number'

export interface Key<N extends string = string, T extends IndexableKeyType = IndexableKeyType> {
  name: N
  type: T
}

export type NarrowKey<I extends Key> = {
  [K in keyof I]: I[K]
}

export class Table<PK extends Key = Key, SK extends Key = Key> {
  public name: string
  public partitionKey: PK
  public sortKey?: SK

  constructor({
    name,
    partitionKey,
    sortKey
  }: {
    name: string
    partitionKey: NarrowKey<PK>
    sortKey?: NarrowKey<SK>
  }) {
    this.name = name
    this.partitionKey = partitionKey

    if (sortKey) {
      this.sortKey = sortKey
    }
  }
}
