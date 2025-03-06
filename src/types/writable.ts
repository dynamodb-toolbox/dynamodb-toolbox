export type Writable<OBJECT extends object> = { -readonly [KEY in keyof OBJECT]: OBJECT[KEY] }
