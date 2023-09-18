export type DefinedProperties<OBJECT extends Record<string, unknown>> = {
  [KEY in keyof OBJECT]: OBJECT[KEY] extends undefined ? never : KEY
}[keyof OBJECT]

export type OmitUndefinedProperties<OBJECT extends Record<string, unknown>> = {
  [KEY in DefinedProperties<OBJECT>]: OBJECT[KEY]
}
