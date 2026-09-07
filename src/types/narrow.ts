/** Map an object type key-by-key, preserving its shape. */
export type NarrowObject<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY]
}

type Narrowable = string | number | bigint | boolean

/** Infer the narrowest literal type of a value, recursing through arrays and objects. */
export type Narrow<VALUE> =
  | (VALUE extends [] ? [] : never)
  | (VALUE extends Narrowable ? VALUE : never)
  | {
      [KEY in keyof VALUE]: VALUE[KEY] extends Function ? VALUE[KEY] : Narrow<VALUE[KEY]>
    }
