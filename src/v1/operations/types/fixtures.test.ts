import {
  schema,
  any,
  string,
  number,
  boolean,
  binary,
  set,
  list,
  map,
  record,
  anyOf
} from 'v1/schema'

export const mySchema = schema({
  parentId: string().key().savedAs('pk'),
  childId: string().key().savedAs('sk'),
  any: any(),
  const: string().const('const'),
  num: number(),
  bool: boolean(),
  bin: binary(),
  stringSet: set(string()),
  stringList: list(string()),
  mapList: list(map({ num: number() })),
  map: map({
    num: number(),
    stringList: list(string()),
    map: map({
      num: number()
    })
  }),
  record: record(string().enum('foo', 'bar'), map({ num: number() })),
  union: anyOf(map({ str: string() }), map({ num: number() }))
})
