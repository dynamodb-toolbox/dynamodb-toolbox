export type NarrowObject<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY]
}
