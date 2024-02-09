type Key = string | number | symbol

type BuiltIn =
  | Function
  | Error
  | Date
  | { readonly [Symbol.toStringTag]: string }
  | RegExp
  | Generator

export type Prettify<A> = A extends BuiltIn
  ? A
  : A extends Array<any>
  ? A extends Array<Record<Key, any>>
    ? Array<
        {
          [K in keyof A[number]]: A[number][K]
        } &
          unknown
      >
    : A
  : A extends ReadonlyArray<any>
  ? A extends ReadonlyArray<Record<Key, any>>
    ? ReadonlyArray<
        {
          [K in keyof A[number]]: A[number][K]
        } &
          unknown
      >
    : A
  : {
      [K in keyof A]: A[K]
    } &
      unknown

// export type Prettify<A> = A extends unknown[]
//   ? Prettify<A[number]>[]
//   : A extends Record<string | number | symbol, any>
//   ? {
//       [K in keyof A]: A[K]
//     } &
//       unknown
//   : A
