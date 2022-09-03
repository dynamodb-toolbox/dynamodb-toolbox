import { RequiredOption } from '../constants/requiredOptions'

export interface PropertyState<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
}
