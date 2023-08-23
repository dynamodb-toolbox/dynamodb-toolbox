import type { FormatSavedItemErrorBlueprints } from './formatSavedItem/errors'
import type { ParsePrimaryKeyErrorBlueprints } from './parsePrimaryKey/errors'

export type CommandUtilsErrorBlueprints =
  | FormatSavedItemErrorBlueprints
  | ParsePrimaryKeyErrorBlueprints
