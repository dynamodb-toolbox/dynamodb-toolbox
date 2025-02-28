import { any } from './any/index.js'
import { anyOf } from './anyOf/index.js'
import { binary } from './binary/index.js'
import { boolean } from './boolean/index.js'
import { item } from './item/index.js'
import { list } from './list/index.js'
import { map } from './map/index.js'
import { nul } from './null/index.js'
import { number } from './number/index.js'
import { record } from './record/index.js'
import { set } from './set/index.js'
import { string } from './string/index.js'

export * from './types/index.js'

export * from './any/index.js'
export * from './null/index.js'
export * from './boolean/index.js'
export * from './number/index.js'
export * from './string/index.js'
export * from './binary/index.js'
export * from './primitive/index.js'
export * from './set/index.js'
export * from './list/index.js'
export * from './map/index.js'
export * from './record/index.js'
export * from './anyOf/index.js'
export * from './item/index.js'

export { SchemaAction } from './schema.js'

export const attribute: {
  any: typeof any
  nul: typeof nul
  boolean: typeof boolean
  number: typeof number
  string: typeof string
  binary: typeof binary
  set: typeof set
  list: typeof list
  map: typeof map
  record: typeof record
  anyOf: typeof anyOf
  item: typeof item
} = {
  any,
  nul,
  boolean,
  number,
  string,
  binary,
  set,
  list,
  map,
  record,
  anyOf,
  item
}
export const attr = attribute
