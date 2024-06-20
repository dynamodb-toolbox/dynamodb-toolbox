export * from './any/index.js'
export * from './primitive/index.js'
export * from './set/index.js'
export * from './list/index.js'
export * from './map/index.js'
export * from './record/index.js'
export * from './anyOf/index.js'

export * from './constants/index.js'
export * from './types/index.js'

import { any } from './any/index.js'
import { binary, boolean, number, string } from './primitive/index.js'
import { set } from './set/index.js'
import { list } from './list/index.js'
import { map } from './map/index.js'
import { record } from './record/index.js'
import { anyOf } from './anyOf/index.js'

export const attribute: {
  any: typeof any
  binary: typeof binary
  boolean: typeof boolean
  number: typeof number
  string: typeof string
  set: typeof set
  list: typeof list
  map: typeof map
  record: typeof record
  anyOf: typeof anyOf
} = {
  any,
  binary,
  boolean,
  number,
  string,
  set,
  list,
  map,
  record,
  anyOf
}
export const attr = attribute
