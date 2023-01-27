import { RequiredOption } from '../constants/requiredOptions'

import { $required, $hidden, $key, $savedAs } from '../constants/attributeOptions'

export interface _AttributeProperties<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined
> {
  [$required]: IS_REQUIRED
  [$hidden]: IS_HIDDEN
  [$key]: IS_KEY
  [$savedAs]: SAVED_AS
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
