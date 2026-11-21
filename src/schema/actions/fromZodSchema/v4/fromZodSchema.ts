import type { $ZodDiscriminatedUnionDef, $ZodTypes, SomeType } from 'zod/v4/core'

import type { Schema } from '~/schema/types/schema.js'

import type { FromZodSchema } from './types.js'
import { fromZodArray } from './zodArray.js'
import { fromZodBigInt } from './zodBigInt.js'
import { fromZodBoolean } from './zodBoolean.js'
import { fromZodCustom } from './zodCustom.js'
import { fromZodDefault } from './zodDefault.js'
import { fromZodDiscriminatedUnion } from './zodDiscriminatedUnion.js'
import { fromZodEnum } from './zodEnum.js'
import { fromZodLiteral } from './zodLiteral.js'
import { fromZodNull } from './zodNull.js'
import { fromZodNumber } from './zodNumber.js'
import { fromZodObject } from './zodObject.js'
import { fromZodOptional } from './zodOptional.js'
import { fromZodPipe } from './zodPipe.js'
import { fromZodRecord } from './zodRecord.js'
import { fromZodSet } from './zodSet.js'
import { fromZodString } from './zodString.js'
import { fromZodTuple } from './zodTuple.js'
import { fromZodUnion } from './zodUnion.js'

const _fromZodSchema = (zodSchema: SomeType): Schema => {
  /**
   * `SomeType` types `_zod.def` as the base `$ZodTypeDef`, which holds the discriminant and nothing
   * else: widening it to zod's own def union is what lets the `switch` narrow each node's `def`.
   * `$ZodDiscriminatedUnion` is absent from `$ZodTypes` — its def only extends `$ZodUnionDef` — so
   * its def is added for `'discriminator' in def` to narrow below. Holds for first-party zod nodes.
   */
  const { def } = zodSchema._zod as { def: $ZodTypes['_zod']['def'] | $ZodDiscriminatedUnionDef }

  switch (def.type) {
    case 'null':
      return fromZodNull(zodSchema)
    case 'boolean':
      return fromZodBoolean(zodSchema)
    case 'number':
      return fromZodNumber(zodSchema)
    case 'bigint':
      return fromZodBigInt(zodSchema)
    case 'string':
      return fromZodString(zodSchema)
    case 'literal':
      return fromZodLiteral(zodSchema, def)
    case 'enum':
      return fromZodEnum(zodSchema)
    case 'set':
      return fromZodSet(zodSchema, def)
    case 'array':
      return fromZodArray(zodSchema, def)
    case 'tuple':
      return fromZodTuple(zodSchema, def)
    case 'object':
      return fromZodObject(zodSchema, def)
    case 'record':
      return fromZodRecord(zodSchema, def)
    case 'union':
      return 'discriminator' in def
        ? fromZodDiscriminatedUnion(zodSchema, def)
        : fromZodUnion(zodSchema, def)
    case 'optional':
      return fromZodOptional(zodSchema, def)
    case 'default':
      return fromZodDefault(zodSchema, def)
    case 'pipe':
      return fromZodPipe(zodSchema, def)
    /**
     * Nodes DynamoDB-Toolbox has no equivalent for. The switch lists them rather than falling
     * through on a `default` clause, so that a node added by a `zod` release fails to compile
     * instead of silently degrading.
     *
     * @debt feature "Degrades to any(); the node's type goes unchecked unless it carries zod checks, in which case `withRefinements` enforces the whole schema"
     */
    case 'any':
    case 'unknown':
    case 'never':
    case 'void':
    case 'undefined':
    case 'symbol':
    case 'date':
    case 'file':
    case 'nan':
    case 'map':
    case 'intersection':
    case 'function':
    case 'promise':
    case 'lazy':
    case 'nullable':
    case 'prefault':
    case 'nonoptional':
    case 'success':
    case 'catch':
    case 'readonly':
    case 'template_literal':
    case 'transform':
    case 'custom':
      return fromZodCustom(zodSchema)
  }
}

/**
 * Convert a `zod` schema to a DDB-TB schema.
 */
export const fromZodSchema = <ZOD_SCHEMA extends SomeType>(
  zodSchema: ZOD_SCHEMA
): FromZodSchema<ZOD_SCHEMA> => _fromZodSchema(zodSchema) as FromZodSchema<ZOD_SCHEMA>
