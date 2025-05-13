import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { map, number, record, string } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const elmtSchema = map({ num: number() })
const elmtZodFormatter = z.object({ num: z.number() })

const schema = record(string(), elmtSchema)
const zodFormatter = z.record(z.string(), elmtZodFormatter)
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt

const deepPartialZodFormatter = z.record(z.string(), elmtZodFormatter.partial()).optional()
const assertDeepPartial: A.Equals<
  ZodFormatter<typeof schema, { partial: true }>,
  typeof deepPartialZodFormatter
> = 1
assertDeepPartial

const definedZodFormatter = deepPartialZodFormatter.unwrap()
const assertDefined: A.Equals<
  ZodFormatter<typeof schema, { partial: true; defined: true }>,
  typeof definedZodFormatter
> = 1
assertDefined

const strictSchema = record(string().enum('foo', 'bar'), number())
const strictZodFormatter = z.object({ foo: z.number(), bar: z.number() })
const assertStrict: A.Equals<ZodFormatter<typeof strictSchema>, typeof strictZodFormatter> = 1
assertStrict

const partialSchema = strictSchema.partial()
const partialZodFormatter = z.record(z.enum(['foo', 'bar']), z.number())
const assertPartial: A.Equals<ZodFormatter<typeof partialSchema>, typeof partialZodFormatter> = 1
assertPartial
