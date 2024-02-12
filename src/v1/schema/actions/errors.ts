import type { FormatterErrorBlueprints } from './format/errors'
import type { ParserErrorBlueprints } from './parse/errors'

export type ActionErrorBlueprints = FormatterErrorBlueprints | ParserErrorBlueprints
