import type { $extension, ExtensionParser, WriteMode } from '~/schema/index.js'

export interface ParseItemOptions {
  mode?: WriteMode | undefined
  fill?: boolean
  parseExtension?: ExtensionParser | undefined
}

export interface InferWriteItemOptions<OPTIONS extends ParseItemOptions> {
  mode: OPTIONS extends { mode: WriteMode } ? OPTIONS['mode'] : undefined
  extension: OPTIONS extends { parseExtension: ExtensionParser }
    ? NonNullable<OPTIONS['parseExtension'][$extension]>
    : undefined
}
