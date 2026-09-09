import type { $extension, ExtensionParser, WriteMode } from '~/schema/index.js'

/** Options accepted by an `EntityParser` (write mode, defaults filling, extension parser). */
export interface ParseItemOptions {
  mode?: WriteMode | undefined
  fill?: boolean
  parseExtension?: ExtensionParser | undefined
}

/** Write item options inferred from some `ParseItemOptions`. */
export interface InferWriteItemOptions<OPTIONS extends ParseItemOptions> {
  mode: OPTIONS extends { mode: WriteMode } ? OPTIONS['mode'] : undefined
  extension: OPTIONS extends { parseExtension: ExtensionParser }
    ? NonNullable<OPTIONS['parseExtension'][$extension]>
    : undefined
}
