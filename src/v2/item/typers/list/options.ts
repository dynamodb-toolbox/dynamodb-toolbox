import { ComputedDefault, RequiredOption, Never } from '../constants'

export interface ListOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  key: K
  savedAs: S
  default: D
}

export const listDefaultOptions: ListOptions<Never, false, false, undefined, undefined> = {
  required: Never,
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
