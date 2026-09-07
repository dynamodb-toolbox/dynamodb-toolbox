import type { EntityErrorBlueprints } from '~/entity/errors.js'
import type { OptionsErrorBlueprints } from '~/options/errors.js'
import type { SchemaErrorBlueprints } from '~/schema/errors.js'
import type { TableErrorBlueprints } from '~/table/errors.js'

import type { ErrorBlueprint } from './blueprint.js'

type ErrorBlueprints =
  | SchemaErrorBlueprints
  | EntityErrorBlueprints
  | TableErrorBlueprints
  | OptionsErrorBlueprints

type IndexErrors<ERROR_BLUEPRINTS extends ErrorBlueprint> = {
  [ERROR_BLUEPRINT in ERROR_BLUEPRINTS as ERROR_BLUEPRINT['code']]: ERROR_BLUEPRINT
}

/** Every DynamoDB-Toolbox error blueprint, indexed by its `code`. */
export type IndexedErrors = IndexErrors<ErrorBlueprints>

/** Union of every valid DynamoDB-Toolbox error `code`. */
export type ErrorCodes = keyof IndexedErrors
