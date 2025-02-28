import type { AnyOfSchemaErrorBlueprint } from './anyOf/errors.js'
import type { ItemSchemaErrorBlueprints } from './item/errors.js'
import type { ListSchemaErrorBlueprint } from './list/errors.js'
import type { MapSchemaErrorBlueprint } from './map/errors.js'
import type { PrimitiveSchemaErrorBlueprint } from './primitive/errors.js'
import type { RecordSchemaErrorBlueprint } from './record/errors.js'
import type { SetSchemaErrorBlueprint } from './set/errors.js'
import type { SharedSchemaErrorBlueprint } from './utils/errors.js'

export type SchemaErrorBlueprint =
  | PrimitiveSchemaErrorBlueprint
  | SetSchemaErrorBlueprint
  | ListSchemaErrorBlueprint
  | MapSchemaErrorBlueprint
  | RecordSchemaErrorBlueprint
  | AnyOfSchemaErrorBlueprint
  | SharedSchemaErrorBlueprint
  | ItemSchemaErrorBlueprints
