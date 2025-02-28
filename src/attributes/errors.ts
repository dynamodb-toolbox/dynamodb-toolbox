import type { AnyOfAttributeErrorBlueprints } from './anyOf/errors.js'
import type { ItemSchemaErrorBlueprints } from './item/errors.js'
import type { ListAttributeErrorBlueprints } from './list/errors.js'
import type { MapAttributeErrorBlueprints } from './map/errors.js'
import type { PrimitiveAttributeErrorBlueprints } from './primitive/errors.js'
import type { RecordAttributeErrorBlueprints } from './record/errors.js'
import type { SetAttributeErrorBlueprints } from './set/errors.js'
import type { SharedAttributeErrorBlueprints } from './shared/errors.js'

export type AttributeErrorBlueprints =
  | PrimitiveAttributeErrorBlueprints
  | SetAttributeErrorBlueprints
  | ListAttributeErrorBlueprints
  | MapAttributeErrorBlueprints
  | RecordAttributeErrorBlueprints
  | AnyOfAttributeErrorBlueprints
  | SharedAttributeErrorBlueprints
  | ItemSchemaErrorBlueprints
