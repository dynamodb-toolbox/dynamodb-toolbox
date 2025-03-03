import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { ScanCommandParamsErrorBlueprints } from './scanParams/errors.js'

type NoEntityMatchedErrorBlueprint = ErrorBlueprint<{
  code: 'scanCommand.noEntityMatched'
  hasPath: false
  payload: { item: unknown }
}>

export type ScanCommandErrorBlueprints =
  | ScanCommandParamsErrorBlueprints
  | NoEntityMatchedErrorBlueprint
