import type { Schema } from '~/schema/types/schema.js'

import type { ZodFormatterOptions } from './v3/formatter/index.js'
import type { ZodFormatter as ZodV3Formatter, ZodParser as ZodV3Parser } from './v3/index.js'
import { ZodSchemer as ZodV3Schemer } from './v3/index.js'
import type { ZodParserOptions } from './v3/parser/index.js'

/**
 * Derive `zod` v3 schemas (parser + formatter) from a schema.
 *
 * @deprecated Import from the `dynamodb-toolbox/schema/actions/zodSchemer/v3` subpath instead
 * (or `.../zodSchemer/v4` to derive zod v4 schemas).
 */
export const ZodSchemer = ZodV3Schemer

/**
 * Derive `zod` v3 schemas (parser + formatter) from a schema.
 *
 * @deprecated Import from the `dynamodb-toolbox/schema/actions/zodSchemer/v3` subpath instead
 * (or `.../zodSchemer/v4` to derive zod v4 schemas).
 */
export type ZodSchemer<SCHEMA extends Schema = Schema> = ZodV3Schemer<SCHEMA>

/**
 * `zod` v3 schema validating a formatted (read) value.
 *
 * @deprecated Import from the `dynamodb-toolbox/schema/actions/zodSchemer/v3` subpath instead
 * (or `.../zodSchemer/v4` to derive zod v4 schemas).
 */
export type ZodFormatter<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions = {}
> = ZodV3Formatter<SCHEMA, OPTIONS>

/**
 * `zod` v3 schema validating an input (write) value.
 *
 * @deprecated Import from the `dynamodb-toolbox/schema/actions/zodSchemer/v3` subpath instead
 * (or `.../zodSchemer/v4` to derive zod v4 schemas).
 */
export type ZodParser<SCHEMA extends Schema, OPTIONS extends ZodParserOptions = {}> = ZodV3Parser<
  SCHEMA,
  OPTIONS
>
