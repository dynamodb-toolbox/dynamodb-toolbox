/** Remove `readonly` modifiers from all properties of `OBJECT`. */
export type Writable<OBJECT extends object> = { -readonly [KEY in keyof OBJECT]: OBJECT[KEY] }
