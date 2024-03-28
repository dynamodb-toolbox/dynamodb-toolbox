import type { PrimaryKeyParserErrorBlueprints } from './actions/parsePrimaryKey/errors'
import type { QueryCommandErrorBlueprints } from './actions/queryCommand/errors'
import type { ScanCommandErrorBlueprints } from './actions/scanCommand/errors'

export type TableErrorBlueprints =
  | PrimaryKeyParserErrorBlueprints
  | QueryCommandErrorBlueprints
  | ScanCommandErrorBlueprints
