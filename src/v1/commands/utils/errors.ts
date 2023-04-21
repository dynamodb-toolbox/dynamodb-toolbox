import type { ParseConditionErrorBlueprints } from './parseCondition/errors'
import type { ParseKeyInputErrorBlueprints } from './parseKeyInput/errors'
import type { FormatSavedItemErrorBlueprints } from './formatSavedItem/errors'
import type { ParsePrimaryKeyErrorBlueprints } from './parsePrimaryKey/errors'

export type CommandUtilsErrorBlueprints =
  | ParseConditionErrorBlueprints
  | ParseKeyInputErrorBlueprints
  | FormatSavedItemErrorBlueprints
  | ParsePrimaryKeyErrorBlueprints
