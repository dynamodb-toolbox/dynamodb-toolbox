import type { PrimaryKeyParserErrorBlueprints } from './actions/parsePrimaryKey/errors.js'
import type { QueryCommandErrorBlueprints } from './actions/query/errors.js'
import type { ScanCommandErrorBlueprints } from './actions/scan/errors.js'

export type TableErrorBlueprints =
  | PrimaryKeyParserErrorBlueprints
  | QueryCommandErrorBlueprints
  | ScanCommandErrorBlueprints
