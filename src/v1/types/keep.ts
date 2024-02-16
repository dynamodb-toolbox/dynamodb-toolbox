export type Keep<OBJECT extends object, KEYS extends string | number | symbol> = {
  [KEY in Extract<keyof OBJECT, KEYS>]: OBJECT[KEY]
}
