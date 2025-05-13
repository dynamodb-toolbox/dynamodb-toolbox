import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { any } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = any()
const zodFormatter = z.custom()
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

const castSchema = schema.castAs<string>()
const castZodFormatter = z.custom<string>()
const assertCast: A.Equals<ZodFormatter<typeof castSchema>, typeof castZodFormatter> = 1
assertCast
