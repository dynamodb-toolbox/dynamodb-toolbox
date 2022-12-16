import { isObject } from 'v1/utils/validation/isObject'
import { isArray } from 'v1/utils/validation/isArray'

import { DefinedValuesKeys } from './definedValuesKeys'

export type FilterUndefinedValues<INPUT> = INPUT extends unknown[]
  ? number extends INPUT['length']
    ? FilterUndefinedValues<INPUT[number]>[]
    : INPUT extends [infer HEAD, ...infer TAIL]
    ? [FilterUndefinedValues<HEAD>, ...FilterUndefinedValues<TAIL>]
    : []
  : INPUT extends object
  ? {
      [KEY in DefinedValuesKeys<INPUT>]: INPUT[KEY] extends object
        ? FilterUndefinedValues<INPUT[KEY]>
        : INPUT[KEY]
    }
  : INPUT

type UndefinedValuesFilterer = <INPUT>(input: INPUT) => FilterUndefinedValues<INPUT>

export const filterUndefinedValues: UndefinedValuesFilterer = input =>
  isArray(input)
    ? input.map(filterUndefinedValues)
    : isObject(input)
    ? (Object.fromEntries(
        Object.entries(input)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) =>
            isObject(value) ? [key, filterUndefinedValues(value)] : [key, value]
          )
      ) as any)
    : input
