import type { SchemaErrorBlueprints } from 'v1/schema/errors.js'
import type { EntityErrorBlueprints } from 'v1/entity/errors.js'
import type { OptionsErrorBlueprints } from 'v1/options/errors.js'
import type { TableErrorBlueprints } from 'v1/table/errors.js'

import type { ErrorBlueprint } from './blueprint.js'

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
