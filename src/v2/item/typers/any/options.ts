import { RequiredOption, Never } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'

export interface AnyOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> {
  required: R
  hidden: H
  key: K
  savedAs: S
  default: D
}

export const anyDefaultOptions: AnyOptions<Never, false, false, undefined, undefined> = {
  required: Never,
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
