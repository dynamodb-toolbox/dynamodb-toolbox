import { RequiredOption } from '../constants/requiredOptions'

export interface PropertyState<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined
> {
  _required: Required
  _hidden: Hidden
  _key: Key
  _savedAs: SavedAs
}
