export type DefinedValuesKeys<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY] extends undefined ? never : KEY
}[keyof OBJECT]
