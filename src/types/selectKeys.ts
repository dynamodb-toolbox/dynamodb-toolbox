import type { ExtendsStr } from './extends.js'

export type SelectKeys<OBJECT extends object, VALUE_CONSTRAINT> =
  // Important to spread unions
  OBJECT extends unknown
    ? {
        [KEY in keyof OBJECT]-?: {
          true: KEY
          false: never
        }[ExtendsStr<OBJECT[KEY], VALUE_CONSTRAINT>]
      }[keyof OBJECT]
    : never
