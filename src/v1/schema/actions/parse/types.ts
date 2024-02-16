import type {
  Extension,
  Schema,
  Attribute,
  AttributeBasicValue,
  RequiredOption,
  ValidValue
} from 'v1/schema'
import type { If } from 'v1/types'

export type HasExtension<EXTENSION extends Extension> = [EXTENSION] extends [never] ? false : true

export type ExtensionParser<
  INPUT_EXTENSION extends Extension,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
> = (
  attribute: Attribute,
  input: unknown,
  options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>
) =>
  | {
      isExtension: true
      extensionParser: () => Generator<
        ValidValue<Attribute, INPUT_EXTENSION>,
        ValidValue<Attribute, INPUT_EXTENSION>,
        ValidValue<Schema, SCHEMA_EXTENSION> | undefined
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

export type FillKey = 'key' | 'put' | 'update'

export type ParsingOptions<
  INPUT_EXTENSION extends Extension,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
> = {
  fill?: boolean | FillKey
  transform?: boolean
  requiringOptions?: Set<RequiredOption>
  filters?: AttributeFilters
} & If<
  HasExtension<INPUT_EXTENSION>,
  { parseExtension: ExtensionParser<INPUT_EXTENSION, SCHEMA_EXTENSION> },
  { parseExtension?: never }
>
