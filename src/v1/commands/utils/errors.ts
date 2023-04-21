import type { ParseConditionErrorBlueprints } from './parseCondition/errors'
import type { ParseKeyInputErrorBlueprints } from './parseKeyInput/errors'
import type { FormatSavedItemErrorBlueprints } from './formatSavedItem/errors'

export type CommandUtilsErrorBlueprints =
  | ParseConditionErrorBlueprints
  | ParseKeyInputErrorBlueprints
  | FormatSavedItemErrorBlueprints
