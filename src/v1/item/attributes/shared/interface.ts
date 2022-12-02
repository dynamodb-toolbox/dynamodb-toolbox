import { RequiredOption } from '../constants/requiredOptions'

export interface _AttributeProperties<
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

export interface AttributeProperties<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined
> {
  required: IsRequired
  hidden: IsHidden
  key: IsKey
  savedAs: SavedAs
}
