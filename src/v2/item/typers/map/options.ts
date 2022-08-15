import { ComputedDefault, RequiredOption, Never } from '../constants'

export interface MappedOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  O extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  key: K
  open: O
  savedAs: S
  default: D
}

export const mappedDefaultOptions: MappedOptions<Never, false, false, false, undefined, undefined> =
  {
    required: Never,
    hidden: false,
    key: false,
    open: false,
    savedAs: undefined,
    default: undefined
  }
