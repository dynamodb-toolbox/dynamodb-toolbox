import { RequiredOption } from '../constants/requiredOptions'

export interface _AttributeProperties<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined
> {
  _required: IS_REQUIRED
  _hidden: IS_HIDDEN
  _key: IS_KEY
  _savedAs: SAVED_AS
}

export interface AttributeProperties<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined
> {
  required: IS_REQUIRED
  hidden: IS_HIDDEN
  key: IS_KEY
  savedAs: SAVED_AS
}
