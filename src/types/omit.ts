type Anyfy<OBJECT extends object> = { [KEY in keyof OBJECT]: any }

export type _Omit<OBJECT extends object, KEYS extends string> =
  // Important to spread unions
  OBJECT extends unknown
    ? {
        [KEY in keyof Anyfy<Omit<OBJECT, KEYS>>]: OBJECT[KEY]
      }
    : never
