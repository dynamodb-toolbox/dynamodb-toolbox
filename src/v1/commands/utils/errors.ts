import type { ParseConditionErrorBlueprints } from './parseCondition/errors'
import type { ParseKeyInputErrorBlueprints } from './parseKeyInput/errors'

export type CommandUtilsErrorBlueprints =
  | ParseConditionErrorBlueprints
  | ParseKeyInputErrorBlueprints
