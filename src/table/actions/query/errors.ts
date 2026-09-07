import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { QueryCommandParamsErrorBlueprints } from './queryParams/errors.js'

type NoEntityMatchedErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.noEntityMatched'
  hasPath: false
  payload: { item: unknown }
}>

/** Union of every error blueprint a `QueryCommand` can raise. */
export type QueryCommandErrorBlueprints =
  | QueryCommandParamsErrorBlueprints
  | NoEntityMatchedErrorBlueprint
