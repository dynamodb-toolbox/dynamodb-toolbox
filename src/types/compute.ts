export type Compute<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY]
}
