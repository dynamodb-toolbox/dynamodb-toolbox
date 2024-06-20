import type { FormatterErrorBlueprints } from './format/errors.js'
import type { ParserErrorBlueprints } from './parse/errors.js'
import type { ConditionParserErrorBlueprints } from './parseCondition/errors.js'
import type { SchemaActionUtilsErrorBlueprints } from './utils/errors.js'

export type ActionErrorBlueprints =
  | FormatterErrorBlueprints
  | ParserErrorBlueprints
  | ConditionParserErrorBlueprints
  | SchemaActionUtilsErrorBlueprints
