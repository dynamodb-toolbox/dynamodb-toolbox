import {
  any,
  anyOf,
  binary,
  boolean,
  list,
  map,
  nul,
  number,
  prefix,
  record,
  schema,
  set,
  string
} from '~/index.js'

export const pokemonSchema = schema({
  any: any(),
  nul: nul().optional(),
  bool: boolean().required('always'),
  defaultedNum: number().default(1),
  bigNum: number().big(),
  keyStr: string().key(),
  prefixedStr: string().enum('foo', 'bar').transform(prefix('PREFIX')),
  savedAsBin: binary().savedAs('_b'),
  set: set(string()),
  list: list(number()),
  map: map({
    str: string(),
    num: number()
  }),
  record: record(string(), string()),
  anyOf: anyOf(string(), number())
}).and(s => ({
  linkedStr: string().link<typeof s>(({ keyStr }) => keyStr)
}))
