import type {
  Attribute,
  AttributeBasicValue,
  AttributeValue,
  RequiredOption,
  Extension,
  Item
} from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'

export type ExtensionParser<
  INPUT_EXTENSION extends Extension,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
> = (
  attribute: Attribute,
  input: AttributeValue<INPUT_EXTENSION> | undefined,
  options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>
) =>
  | {
      isExtension: true
      extensionParser: () => Generator<
        AttributeValue<INPUT_EXTENSION>,
        AttributeValue<INPUT_EXTENSION>,
        Item<SCHEMA_EXTENSION> | undefined
      >
      basicInput?: never
    }
  | {
      isExtension: false
      extensionParser?: never
      basicInput: AttributeBasicValue<INPUT_EXTENSION> | undefined
    }

export interface AttributeFilters {
  key?: boolean
}

export type OperationName = 'key' | 'put' | 'update'

export type ParsingOptions<
  INPUT_EXTENSION extends Extension,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
> = {
  // TODO: Merge clone & operationName to a boolean or string "fill" option
  clone?: boolean
  operationName?: OperationName
  requiringOptions?: Set<RequiredOption>
  filters?: AttributeFilters
  transform?: boolean
} & If<
  HasExtension<INPUT_EXTENSION>,
  { parseExtension: ExtensionParser<INPUT_EXTENSION, SCHEMA_EXTENSION> },
  { parseExtension?: never }
>
