import { O } from 'ts-toolbelt'

import {
  Item,
  ItemSavedAs,
  ItemInput,
  ItemOutput,
  ItemKeyInput,
  ItemPreComputeKey,
  HasComputedDefaults,
  PreComputeDefaults,
  PostComputeDefaults
} from './attributes'
import { Table, PrimaryKey, IndexableKeyType, HasSK } from './table'

type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false

type NeedsKeyPartCompute<
  I extends Item,
  N extends string,
  T extends IndexableKeyType
> = I['_properties'] extends Record<
  N,
  { _type: T; _required: true; _key: true; _savedAs: undefined }
>
  ? false
  : O.SelectKeys<
      I['_properties'],
      { _type: T; _required: true; _key: true; _savedAs: N }
    > extends never
  ? true
  : false

type NeedsKeyCompute<I extends Item, T extends Table> = HasSK<T> extends true
  ? Or<
      NeedsKeyPartCompute<I, T['partitionKey']['name'], T['partitionKey']['type']>,
      NeedsKeyPartCompute<I, NonNullable<T['sortKey']>['name'], NonNullable<T['sortKey']>['type']>
    >
  : NeedsKeyPartCompute<I, T['partitionKey']['name'], T['partitionKey']['type']>

export class EntityV2<N extends string = string, T extends Table = Table, I extends Item = Item> {
  public name: N
  public table: T
  public item: I
  // any is needed for contravariance
  computeKey: (preComputeKey: Item extends I ? any : ItemPreComputeKey<I>) => PrimaryKey<T>
  computeDefaults: (
    // any is needed for contravariance
    preComputeDefaults: Item extends I ? any : PreComputeDefaults<I>
  ) => PostComputeDefaults<I>

  constructor({
    name,
    table,
    item,
    computeKey,
    computeDefaults
  }: {
    name: N
    table: T
    item: I
  } & (NeedsKeyCompute<I, T> extends true
    ? { computeKey: (preComputeKey: ItemPreComputeKey<I>) => PrimaryKey<T> }
    : { computeKey?: undefined }) &
    (HasComputedDefaults<I> extends true
      ? { computeDefaults: (input: PreComputeDefaults<I>) => PostComputeDefaults<I> }
      : { computeDefaults?: undefined })) {
    this.name = name
    this.table = table

    // TODO: validate that item respects table key design
    this.item = item

    if (computeKey) {
      this.computeKey = computeKey
    } else {
      this.computeKey = ((preComputeKey: Record<string, any>) => {
        const partitionKeyValue = preComputeKey[this.table.partitionKey.name]

        if (!this.table.sortKey?.name) {
          return { [this.table.partitionKey.name]: partitionKeyValue }
        }

        const sortKeyValue = preComputeKey[this.table.sortKey.name]

        return {
          [this.table.partitionKey.name]: partitionKeyValue,
          [this.table.sortKey.name]: sortKeyValue
        }
      }) as any
    }

    if (computeDefaults) {
      this.computeDefaults = computeDefaults
    } else {
      this.computeDefaults = ((preComputeDefaults: PreComputeDefaults<I>) =>
        preComputeDefaults) as any
    }
  }
}

export type SavedAs<E extends EntityV2> = ItemSavedAs<E['item']> & PrimaryKey<E['table']>

export type KeyInputs<E extends EntityV2> = ItemKeyInput<E['item']>
export type KeyOutputs<E extends EntityV2> = ItemPreComputeKey<E['item']>

export type Input<E extends EntityV2> = ItemInput<E['item']>
export type Output<E extends EntityV2> = ItemOutput<E['item']>

export type Parser = <
  E extends EntityV2,
  S extends Record<string, any> = SavedAs<E>,
  O extends Record<string, any> = Output<E>
>(
  entity: E,
  savedAs: S
) => O

export const parse: Parser = (entity, savedAs) => {
  entity
  // TODO
  return savedAs as any
}

export type KeyInputsValidator = <E extends EntityV2, K extends Record<string, any> = KeyInputs<E>>(
  entity: E,
  keyInputs: Record<string, any>
) => keyInputs is K

export const validateKeyInputs: KeyInputsValidator = <
  E extends EntityV2,
  K extends Record<string, any> = KeyInputs<E>
>(
  entity: E,
  keyInputs: Record<string, any>
): keyInputs is K => {
  entity
  keyInputs
  // TODO
  return true
}

export type SavedAsValidator = <E extends EntityV2, S extends Record<string, any> = SavedAs<E>>(
  entity: E,
  savedItem: Record<string, any>
) => savedItem is S

export const validateSavedAs: SavedAsValidator = <
  E extends EntityV2,
  S extends Record<string, any> = SavedAs<E>
>(
  entity: E,
  savedItem: Record<string, any>
): savedItem is S => {
  entity
  savedItem
  // TODO
  return true
}

export type InputValidator = <E extends EntityV2, I extends Record<string, any> = Input<E>>(
  entity: E,
  input: Record<string, any>
) => input is I

export const validateInput: InputValidator = <
  E extends EntityV2,
  I extends Record<string, any> = Input<E>
>(
  entity: E,
  input: Record<string, any>
): input is I => {
  entity
  input
  // TODO
  return true
}
