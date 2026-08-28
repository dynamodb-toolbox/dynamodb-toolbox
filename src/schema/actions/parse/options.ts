import type { ArrayPath } from '~/schema/actions/utils/types.js'
import type { $contextExtension, $extension, ExtensionParser, WriteMode } from '~/schema/index.js'

/**
 * Options accepted by the parser.
 */
export interface ParseValueOptions {
  mode?: WriteMode
  fill?: boolean
  transform?: boolean
  defined?: boolean
  parseExtension?: ExtensionParser
}

/**
 * Parser options extended with the value's array path.
 */
export interface ParseAttrValueOptions extends ParseValueOptions {
  valuePath?: ArrayPath
}

/**
 * Derives write value options from parser options.
 */
export interface InferWriteValueOptions<
  OPTIONS extends ParseValueOptions,
  USE_CONTEXT_EXTENSION extends boolean = false
> {
  mode: OPTIONS extends { mode: WriteMode } ? OPTIONS['mode'] : undefined
  defined: OPTIONS extends { defined: boolean } ? OPTIONS['defined'] : undefined
  extension: OPTIONS extends { parseExtension: ExtensionParser }
    ? NonNullable<
        OPTIONS['parseExtension'][USE_CONTEXT_EXTENSION extends true
          ? $contextExtension
          : $extension]
      >
    : undefined
}
