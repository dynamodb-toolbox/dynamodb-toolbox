import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { QueryCommandParamsErrorBlueprints } from './queryParams/errors.js'

type NoEntityMatchedErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.noEntityMatched'
  hasPath: false
  payload: { item: unknown }
}>

export type QueryCommandErrorBlueprints =
  | QueryCommandParamsErrorBlueprints
  | NoEntityMatchedErrorBlueprint
