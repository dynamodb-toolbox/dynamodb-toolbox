export type NarrowObject<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY]
}

export type NarrowObjectRec<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY] extends object ? NarrowObjectRec<OBJECT[KEY]> : OBJECT[KEY]
}
