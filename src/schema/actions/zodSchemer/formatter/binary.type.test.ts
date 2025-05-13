import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { binary } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = binary()
const zodFormatter = z.instanceof(Uint8Array)
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt

const assertPartial: A.Equals<
  ZodFormatter<typeof schema, { partial: true }>,
  typeof optZodFormatter
> = 1
assertPartial

const assertDefined: A.Equals<
  ZodFormatter<typeof schema, { partial: true; defined: true }>,
  typeof zodFormatter
> = 1
assertDefined
