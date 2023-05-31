import type { SchemaErrorBlueprints } from 'v1/schema/errors'
import type { EntityErrorBlueprints } from 'v1/entity/errors'
import type { CommandsErrorBlueprints } from 'v1/commands/errors'
import type { ParsingErrorBlueprints } from 'v1/validation/errors'

import type { ErrorBlueprint } from './blueprint'

type ErrorBlueprints =
  | SchemaErrorBlueprints
  | EntityErrorBlueprints
  | CommandsErrorBlueprints
  | ParsingErrorBlueprints

type IndexErrors<ERROR_BLUEPRINTS extends ErrorBlueprint> = {
  [ERROR_BLUEPRINT in ERROR_BLUEPRINTS as ERROR_BLUEPRINT['code']]: ERROR_BLUEPRINT
}

export type IndexedErrors = IndexErrors<ErrorBlueprints>

export type ErrorCodes = keyof IndexedErrors