import type { ExtendsStr } from './extends.js'

export type OmitKeys<OBJECT extends object, VALUE_CONSTRAINT> =
  // Important to spread unions
  OBJECT extends unknown
    ? {
        [KEY in keyof OBJECT]-?: {
          true: never
          false: KEY
        }[ExtendsStr<OBJECT[KEY], VALUE_CONSTRAINT>]
      }[keyof OBJECT]
    : never
