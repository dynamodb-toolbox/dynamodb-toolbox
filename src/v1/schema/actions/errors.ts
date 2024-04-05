import type { FormatterErrorBlueprints } from './format/errors'
import type { ParserErrorBlueprints } from './parse/errors'
import type { ConditionParserErrorBlueprints } from './parseCondition/errors'

export type ActionErrorBlueprints =
  | FormatterErrorBlueprints
  | ParserErrorBlueprints
  | ConditionParserErrorBlueprints
