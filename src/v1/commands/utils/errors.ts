import type { FormatSavedItemErrorBlueprints } from './formatSavedItem/errors'
import type { ParsePrimaryKeyErrorBlueprints } from './parsePrimaryKey/errors'
import type { ExpressionParsersErrorBlueprints } from './expressionParsers/errors'

export type CommandUtilsErrorBlueprints =
  | FormatSavedItemErrorBlueprints
  | ParsePrimaryKeyErrorBlueprints
  | ExpressionParsersErrorBlueprints
