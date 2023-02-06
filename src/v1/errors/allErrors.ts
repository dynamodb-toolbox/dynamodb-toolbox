import {
  InvalidCapacityOptionErrorBlueprint,
  InvalidMetricsOptionErrorBlueprint
} from 'v1/commands/errors'

import { ErrorBlueprint } from './blueprint'

type ErrorBlueprints = InvalidCapacityOptionErrorBlueprint | InvalidMetricsOptionErrorBlueprint

type IndexErrors<ERROR_BLUEPRINTS extends ErrorBlueprint> = {
  [ERROR_BLUEPRINT in ERROR_BLUEPRINTS as ERROR_BLUEPRINT['code']]: ERROR_BLUEPRINT
}

export type IndexedErrors = IndexErrors<ErrorBlueprints>

export type ErrorCodes = keyof IndexedErrors
