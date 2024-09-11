import type { Extension } from '~/attributes/index.js'

import type { $contextExtension, $extension } from '../constants.js'
import type { ExtensionParser } from './extensionParser.js'

export type ParsingMode = 'key' | 'put' | 'update'

export type ParsingOptions = {
  fill?: boolean
  transform?: boolean
  mode?: ParsingMode
  parseExtension?: ExtensionParser
  defined?: boolean
}

export type ParsingDefaultOptions = {
  fill: true
  transform: true
  mode: 'put'
  parseExtension: undefined
  defined: false
}

export type ParsedValueOptions = {
  fill?: boolean
  transform?: boolean
  mode?: ParsingMode
  extension?: Extension
  defined?: boolean
}

export type ParsedValueDefaultOptions = {
  fill: true
  transform: true
  mode: 'put'
  extension: undefined
  defined: false
}

export type FromParsingOptions<OPTIONS extends ParsingOptions, CONTEXT extends boolean = false> = {
  fill: OPTIONS extends { fill: boolean } ? OPTIONS['fill'] : ParsedValueDefaultOptions['fill']
  transform: OPTIONS extends { transform: boolean }
    ? OPTIONS['transform']
    : ParsedValueDefaultOptions['transform']
  mode: OPTIONS extends { mode: ParsingMode } ? OPTIONS['mode'] : ParsedValueDefaultOptions['mode']
  extension: OPTIONS extends { parseExtension: ExtensionParser }
    ? NonNullable<OPTIONS['parseExtension'][CONTEXT extends true ? $contextExtension : $extension]>
    : ParsedValueDefaultOptions['extension']
}
