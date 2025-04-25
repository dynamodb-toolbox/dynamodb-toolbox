import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { BatchGetCommandErrorBlueprints } from './actions/batchGet/errors.js'
import type { PrimaryKeyParserErrorBlueprints } from './actions/parsePrimaryKey/errors.js'
import type { QueryCommandErrorBlueprints } from './actions/query/errors.js'
import type { ScanCommandErrorBlueprints } from './actions/scan/errors.js'

type MissingTableNameErrorBlueprint = ErrorBlueprint<{
  code: 'table.missingTableName'
  hasPath: false
  payload: undefined
}>

export type TableErrorBlueprints =
  | MissingTableNameErrorBlueprint
  | PrimaryKeyParserErrorBlueprints
  | BatchGetCommandErrorBlueprints
  | QueryCommandErrorBlueprints
  | ScanCommandErrorBlueprints
