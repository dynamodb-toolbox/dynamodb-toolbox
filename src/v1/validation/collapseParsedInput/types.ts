import type { AttributeValue, Extension } from 'v1/schema'
import type { If } from 'v1/types'

import type { AttributeParsedValue, AttributeParsedBasicValue, HasExtension } from '../types'

export type ExtensionCollapser<EXTENSION extends Extension> = (
  input: AttributeParsedValue<EXTENSION> | undefined,
  options: CollapsingOptions<EXTENSION>
) =>
  | { isExtension: true; collapsedExtension: AttributeValue<EXTENSION>; basicInput?: never }
  | {
      isExtension: false
      collapsedExtension?: never
      basicInput: AttributeParsedBasicValue<EXTENSION> | undefined
    }

export type CollapsingOptions<EXTENSION extends Extension> = If<
  HasExtension<EXTENSION>,
  { collapseExtension: ExtensionCollapser<EXTENSION> },
  { collapseExtension?: never }
>
