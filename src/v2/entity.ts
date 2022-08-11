import {
  Item,
  ItemSavedAs,
  ItemInput,
  ItemOutput,
  ItemKeyInput,
  ItemPreComputeKey
} from './attributes'
import { Table, PrimaryKey } from './table'

export class EntityV2<
  T extends Table = Table,
  N extends string = string,
  I extends Item = Item,
  // any is needed for contravariance
  K = Item extends I ? any : ItemPreComputeKey<I>,
  PK = PrimaryKey<T>
> {
  public name: N
  public item: I
  public table: T
  computeKey: (preComputeKey: K) => PK

  constructor({
    name,
    item,
    table,
    computeKey
  }: {
    name: N
    item: I
    table: T
  } & (K extends PK
    ? { computeKey?: (preComputeKey: K) => PK }
    : { computeKey: (preComputeKey: K) => PK })) {
    this.name = name
    this.item = item
    this.table = table

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
      }) as (preComputeKey: K) => PK
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
