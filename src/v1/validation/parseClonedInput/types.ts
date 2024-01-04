import type {
  Attribute,
  AttributeBasicValue,
  AttributeValue,
  RequiredOption,
  Extension
} from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'

export type ExtensionParser<EXTENSION extends Extension> = (
  attribute: Attribute,
  input: AttributeValue<EXTENSION> | undefined,
  options: ParsingOptions<EXTENSION>
) =>
  | {
      isExtension: true
      extensionParser: () => Generator<AttributeValue<EXTENSION>, AttributeValue<EXTENSION>>
      basicInput?: never
    }
  | {
      isExtension: false
      extensionParser?: never
      basicInput: AttributeBasicValue<EXTENSION> | undefined
    }

export interface AttributeFilters {
  key?: boolean
}

export type ParsingOptions<EXTENSION extends Extension> = {
  requiringOptions?: Set<RequiredOption>
  filters?: AttributeFilters
  transform?: boolean
} & If<
  HasExtension<EXTENSION>,
  { parseExtension: ExtensionParser<EXTENSION> },
  { parseExtension?: never }
>
