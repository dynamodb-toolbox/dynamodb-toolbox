import type { ZodSchema } from 'zod/v3'

import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type {
  FromZodSchema as FromZodV3Schema,
  FromZodSchemaRec as FromZodV3SchemaRec
} from './v3/index.js'
import { fromZodSchema as fromZodV3Schema } from './v3/index.js'

/**
 * Convert a `zod` v3 schema to a DDB-TB schema.
 *
 * @deprecated Import from the `dynamodb-toolbox/schema/actions/fromZodSchema/v3` subpath instead
 * (or `.../fromZodSchema/v4` for zod v4 schemas).
 */
export const fromZodSchema = fromZodV3Schema

/**
 * DDB-TB schema derived from a `zod` v3 schema.
 *
 * @deprecated Import from the `dynamodb-toolbox/schema/actions/fromZodSchema/v3` subpath instead
 * (or `.../fromZodSchema/v4` for zod v4 schemas).
 */
export type FromZodSchema<
  ZOD_SCHEMA extends ZodSchema,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = FromZodV3Schema<ZOD_SCHEMA, ROOT, PROPS>

/**
 * DDB-TB schemas derived from a tuple of `zod` v3 schemas.
 *
 * @deprecated Import from the `dynamodb-toolbox/schema/actions/fromZodSchema/v3` subpath instead
 * (or `.../fromZodSchema/v4` for zod v4 schemas).
 */
export type FromZodSchemaRec<
  ZOD_SCHEMAS extends readonly ZodSchema[],
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {},
  RESULT_SCHEMAS extends Schema[] = []
> = FromZodV3SchemaRec<ZOD_SCHEMAS, ROOT, PROPS, RESULT_SCHEMAS>
