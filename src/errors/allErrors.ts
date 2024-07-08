import type { AttributeErrorBlueprints } from '~/attributes/errors.js'
import type { EntityErrorBlueprints } from '~/entity/errors.js'
import type { OptionsErrorBlueprints } from '~/options/errors.js'
import type { SchemaErrorBlueprints } from '~/schema/errors.js'
import type { TableErrorBlueprints } from '~/table/errors.js'

import type { ErrorBlueprint } from './blueprint.js'

type ErrorBlueprints =
  | AttributeErrorBlueprints
  | SchemaErrorBlueprints
  | EntityErrorBlueprints
  | TableErrorBlueprints
  | OptionsErrorBlueprints

type IndexErrors<ERROR_BLUEPRINTS extends ErrorBlueprint> = {
  [ERROR_BLUEPRINT in ERROR_BLUEPRINTS as ERROR_BLUEPRINT['code']]: ERROR_BLUEPRINT
}

export type IndexedErrors = IndexErrors<ErrorBlueprints>

export type ErrorCodes = keyof IndexedErrors
