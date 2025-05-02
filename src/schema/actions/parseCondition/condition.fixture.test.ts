import {
  any,
  anyOf,
  binary,
  boolean,
  item,
  list,
  map,
  nul,
  number,
  record,
  set,
  string
} from '~/schema/index.js'

export const mySchema = item({
  any: any().castAs<{ foo: 'bar' }>(),
  nul: nul(),
  bool: boolean(),
  num: number(),
  str: string().key().savedAs('pk').enum('foo', 'bar'),
  bin: binary(),
  stringSet: set(string()),
  stringList: list(string()),
  mapList: list(map({ num: number() })),
  map: map({
    num: number(),
    stringList: list(string()),
    map: map({ num: number() })
  }),
  record: record(string().enum('foo', 'bar'), map({ num: number() })),
  dict: record(string(), string()),
  union: anyOf(map({ str: string() }), map({ num: number() }))
})
