import type { ItemErrorBlueprints } from 'v1/item/errors'
import type { EntityErrorBlueprints } from 'v1/entity/errors'
import type { CommandErrorBlueprints } from 'v1/commands/errors'

import type { ErrorBlueprint } from './blueprint'

type ErrorBlueprints = ItemErrorBlueprints | EntityErrorBlueprints | CommandErrorBlueprints

type IndexErrors<ERROR_BLUEPRINTS extends ErrorBlueprint> = {
  [ERROR_BLUEPRINT in ERROR_BLUEPRINTS as ERROR_BLUEPRINT['code']]: ERROR_BLUEPRINT
}

export type IndexedErrors = IndexErrors<ErrorBlueprints>

export type ErrorCodes = keyof IndexedErrors
