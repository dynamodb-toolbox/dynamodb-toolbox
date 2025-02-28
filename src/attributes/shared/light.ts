import type { ComputeObject } from '~/types/computeObject.js'

import type { AnySchema } from '../any/index.js'
import type { AnyOfSchema } from '../anyOf/index.js'
import type { BinarySchema } from '../binary/index.js'
import type { BooleanSchema } from '../boolean/index.js'
import type { ListSchema } from '../list/index.js'
import type { MapSchema } from '../map/index.js'
import type { NullSchema } from '../null/index.js'
import type { NumberSchema } from '../number/index.js'
import type { RecordSchema } from '../record/index.js'
import type { SetSchema } from '../set/index.js'
import type { StringSchema } from '../string/index.js'
import type { AttrSchema } from '../types/attrSchema.js'

// Required to support big schemas: We "strip" schema methods when calling a typer to avoid type computes (.required, .hidden etc.)
// NOTE: We don't need to be recursive as every typer lightens its output
export type Light<SCHEMA extends AttrSchema> = SCHEMA extends AnySchema
  ? AnySchema<SCHEMA['props']>
  : SCHEMA extends NullSchema
    ? NullSchema<SCHEMA['props']>
    : SCHEMA extends BooleanSchema
      ? BooleanSchema<SCHEMA['props']>
      : SCHEMA extends NumberSchema
        ? NumberSchema<SCHEMA['props']>
        : SCHEMA extends StringSchema
          ? StringSchema<SCHEMA['props']>
          : SCHEMA extends BinarySchema
            ? BinarySchema<SCHEMA['props']>
            : SCHEMA extends SetSchema
              ? SetSchema<SCHEMA['elements'], SCHEMA['props']>
              : SCHEMA extends ListSchema
                ? ListSchema<SCHEMA['elements'], SCHEMA['props']>
                : SCHEMA extends MapSchema
                  ? MapSchema<SCHEMA['attributes'], SCHEMA['props']>
                  : SCHEMA extends RecordSchema
                    ? RecordSchema<SCHEMA['keys'], SCHEMA['elements'], SCHEMA['props']>
                    : SCHEMA extends AnyOfSchema
                      ? AnyOfSchema<SCHEMA['elements'], SCHEMA['props']>
                      : never

type Lightener = <SCHEMA extends AttrSchema>(schema: SCHEMA) => Light<SCHEMA>

export const light: Lightener = <SCHEMA extends AttrSchema>(schema: SCHEMA) =>
  schema as unknown as Light<SCHEMA>

export type LightTuple<
  SCHEMAS extends AttrSchema[],
  RESULTS extends AttrSchema[] = []
> = SCHEMAS extends [
  infer SCHEMAS_HEAD extends AttrSchema,
  ...infer SCHEMAS_TAIL extends AttrSchema[]
]
  ? LightTuple<SCHEMAS_TAIL, [...RESULTS, Light<SCHEMAS_HEAD>]>
  : RESULTS

type TupleLightener = <SCHEMAS extends AttrSchema[]>(...schemas: SCHEMAS) => LightTuple<SCHEMAS>

export const lightTuple: TupleLightener = <SCHEMAS extends AttrSchema[]>(...schemas: SCHEMAS) =>
  schemas as unknown as LightTuple<SCHEMAS>

export type LightObj<SCHEMAS extends { [KEY in string]: AttrSchema }> = ComputeObject<{
  [KEY in keyof SCHEMAS]: Light<SCHEMAS[KEY]>
}>

type ObjLightener = <SCHEMAS extends { [KEY in string]: AttrSchema }>(
  schemas: SCHEMAS
) => LightObj<SCHEMAS>

export const lightObj: ObjLightener = <SCHEMAS extends { [KEY in string]: AttrSchema }>(
  schemas: SCHEMAS
) => schemas as unknown as LightObj<SCHEMAS>
