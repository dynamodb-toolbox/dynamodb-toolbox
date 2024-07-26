import type { If } from './if.js'

export type Compute<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY]
}

type BuiltIn =
  | Function
  | Error
  | Date
  | { readonly [Symbol.toStringTag]: string }
  | RegExp
  | Generator

type Has<U, U1> = [U1] extends [U] ? true : false

export type ComputeDeep<OBSCURE, SEEN = never> = OBSCURE extends BuiltIn
  ? OBSCURE
  : If<
      Has<SEEN, OBSCURE>,
      OBSCURE,
      OBSCURE extends Array<any>
        ? OBSCURE extends Array<Record<string | number | symbol, any>>
          ? Array<
              {
                [KEY in keyof OBSCURE[number]]: ComputeDeep<OBSCURE[number][KEY], OBSCURE | SEEN>
              } & unknown
            >
          : OBSCURE
        : OBSCURE extends ReadonlyArray<any>
          ? OBSCURE extends ReadonlyArray<Record<string | number | symbol, any>>
            ? ReadonlyArray<
                {
                  [KEY in keyof OBSCURE[number]]: ComputeDeep<OBSCURE[number][KEY], OBSCURE | SEEN>
                } & unknown
              >
            : OBSCURE
          : { [KEY in keyof OBSCURE]: ComputeDeep<OBSCURE[KEY], OBSCURE | SEEN> } & unknown
    >
