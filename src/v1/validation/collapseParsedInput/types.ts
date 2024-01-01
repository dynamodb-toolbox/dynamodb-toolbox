import type { Attribute, AttributeValue, AttributeBasicValue, Extension } from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'

export type ExtensionCollapser<EXTENSION extends Extension> = (
  attribute: Attribute,
  input: AttributeValue<EXTENSION> | undefined,
  options: CollapsingOptions<EXTENSION>
) =>
  | { isExtension: true; collapsedExtension: AttributeValue<EXTENSION>; basicInput?: never }
  | {
      isExtension: false
      collapsedExtension?: never
      basicInput: AttributeBasicValue<EXTENSION> | undefined
    }

export type CollapsingOptions<EXTENSION extends Extension> = If<
  HasExtension<EXTENSION>,
  { collapseExtension: ExtensionCollapser<EXTENSION> },
  { collapseExtension?: never }
>
