import { RequiredOption } from '../constants/requiredOptions'

export interface PropertyState<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined
> {
  _required: IsRequired
  _hidden: IsHidden
  _key: IsKey
  _savedAs: SavedAs
}
