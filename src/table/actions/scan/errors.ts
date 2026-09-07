import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { ScanCommandParamsErrorBlueprints } from './scanParams/errors.js'

type NoEntityMatchedErrorBlueprint = ErrorBlueprint<{
  code: 'scanCommand.noEntityMatched'
  hasPath: false
  payload: { item: unknown }
}>

/** Union of every error blueprint a `ScanCommand` can raise. */
export type ScanCommandErrorBlueprints =
  | ScanCommandParamsErrorBlueprints
  | NoEntityMatchedErrorBlueprint
