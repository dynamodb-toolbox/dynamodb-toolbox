export * from './any'
export * from './primitive'
export * from './set'
export * from './list'
export * from './map'
export * from './record'
export * from './anyOf'

export * from './constants'
export * from './types'
export { freezeAttribute } from './freeze'

import { any } from './any'
import { binary, boolean, number, string } from './primitive'
import { set } from './set'
import { list } from './list'
import { map } from './map'
import { record } from './record'
import { anyOf } from './anyOf'

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
