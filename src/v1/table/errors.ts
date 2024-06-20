import type { PrimaryKeyParserErrorBlueprints } from './actions/parsePrimaryKey/errors.js'
import type { QueryCommandErrorBlueprints } from './actions/queryCommand/errors.js'
import type { ScanCommandErrorBlueprints } from './actions/scanCommand/errors.js'

export type TableErrorBlueprints =
  | PrimaryKeyParserErrorBlueprints
  | QueryCommandErrorBlueprints
  | ScanCommandErrorBlueprints
