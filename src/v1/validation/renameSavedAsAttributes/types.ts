import type { AttributeValue, Extension } from 'v1/schema'
import type { If } from 'v1/types'

import type { AttributeParsedValue, AttributeParsedBasicValue, HasExtension } from '../types'

export type ExtensionRenamer<EXTENSION extends Extension> = (
  input: AttributeParsedValue<EXTENSION> | undefined,
  options: RenamingOptions<EXTENSION>
) =>
  | { isExtension: true; renamedExtension: AttributeValue<EXTENSION>; basicInput?: never }
  | {
      isExtension: false
      renamedExtension?: never
      basicInput: AttributeParsedBasicValue<EXTENSION> | undefined
    }

export type RenamingOptions<EXTENSION extends Extension> = If<
  HasExtension<EXTENSION>,
  { renameExtension: ExtensionRenamer<EXTENSION> },
  { renameExtension?: never }
>
