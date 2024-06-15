import type { SchemaErrorBlueprints } from 'v1/schema/errors'
import type { EntityErrorBlueprints } from 'v1/entity/errors'
import type { OptionsErrorBlueprints } from 'v1/options/errors'
import type { TableErrorBlueprints } from 'v1/table/errors'

import type { ErrorBlueprint } from './blueprint'

type ErrorBlueprints =
  | SchemaErrorBlueprints
  | EntityErrorBlueprints
  | TableErrorBlueprints
  | OptionsErrorBlueprints

type IndexErrors<ERROR_BLUEPRINTS extends ErrorBlueprint> = {
  [ERROR_BLUEPRINT in ERROR_BLUEPRINTS as ERROR_BLUEPRINT['code']]: ERROR_BLUEPRINT
}

export type IndexedErrors = IndexErrors<ErrorBlueprints>

export type ErrorCodes = keyof IndexedErrors
