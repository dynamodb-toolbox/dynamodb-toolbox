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
  prefix,
  record,
  set,
  string
} from '~/index.js'

export const testSchema = item({
  any: any(),
  nul: nul().optional(),
  bool: boolean().required('always'),
  defaultedNum: number().default(1),
  bigNum: number().big(),
  keyStr: string().key(),
  hiddenStr: string().hidden(),
  prefixedStr: string().enum('foo', 'bar').transform(prefix('PREFIX')),
  savedAsBin: binary().savedAs('_b'),
  set: set(string()),
  list: list(map({ num: number(), str: string() })),
  map: map({ num: number(), str: string() }),
  record: record(string().enum('foo', 'bar'), map({ num: number(), str: string() })),
  partialRecord: record(string().enum('foo', 'bar'), string()).partial(),
  anyOf: anyOf(string(), number())
}).and(s => ({
  linkedStr: string().link<typeof s>(({ keyStr }) => keyStr)
}))

export const bigSchema = item({
  list: list(
    list(list(list(list(list(list(list(list(list(list(list(list(list(list(string()))))))))))))))
  ),
  map: map({
    map: map({
      map: map({
        map: map({
          map: map({
            map: map({
              map: map({
                map: map({
                  map: map({
                    map: map({
                      map: map({
                        map: map({ map: map({ map: map({ map: map({ str: string() }) }) }) })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
