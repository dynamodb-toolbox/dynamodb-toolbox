import type { $contextExtension, $extension, ExtensionParser, WriteMode } from '~/schema/index.js'

export interface ParsingOptions {
  mode?: WriteMode
  fill?: boolean
  transform?: boolean
  defined?: boolean
  parseExtension?: ExtensionParser
}

export interface InferValueOptions<
  OPTIONS extends ParsingOptions,
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
