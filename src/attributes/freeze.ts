import type { AnySchema, FreezeAnyAttribute } from './any/index.js'
import type { AnyOfSchema, FreezeAnyOfAttribute } from './anyOf/index.js'
import type { FreezeListAttribute, ListSchema } from './list/index.js'
import type { FreezeMapAttribute, MapSchema } from './map/index.js'
import type { FreezePrimitiveAttribute, PrimitiveSchema } from './primitive/index.js'
import type { FreezeRecordAttribute, RecordSchema } from './record/index.js'
import type { FreezeSetAttribute, SetSchema } from './set/index.js'
import type { AttrSchema } from './types/index.js'

export type FreezeAttribute<
  $ATTRIBUTE extends AttrSchema,
  EXTENDED extends boolean = false
> = $ATTRIBUTE extends AnySchema
  ? FreezeAnyAttribute<$ATTRIBUTE, EXTENDED>
  : $ATTRIBUTE extends PrimitiveSchema
    ? FreezePrimitiveAttribute<$ATTRIBUTE, EXTENDED>
    : $ATTRIBUTE extends SetSchema
      ? FreezeSetAttribute<$ATTRIBUTE, EXTENDED>
      : $ATTRIBUTE extends ListSchema
        ? FreezeListAttribute<$ATTRIBUTE, EXTENDED>
        : $ATTRIBUTE extends MapSchema
          ? FreezeMapAttribute<$ATTRIBUTE, EXTENDED>
          : $ATTRIBUTE extends RecordSchema
            ? FreezeRecordAttribute<$ATTRIBUTE, EXTENDED>
            : $ATTRIBUTE extends AnyOfSchema
              ? FreezeAnyOfAttribute<$ATTRIBUTE, EXTENDED>
              : never
