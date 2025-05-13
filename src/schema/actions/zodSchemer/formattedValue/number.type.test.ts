import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = number()
const zodFormatter = z.number()
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt

const literalSchema = schema.const(42)
const literalZodFormatter = z.literal(42)
const assertLiteral: A.Equals<ZodFormatter<typeof literalSchema>, typeof literalZodFormatter> = 1
assertLiteral

const enumSchema = schema.enum(42, 43)
const enumZodFormatter = z.union([z.literal(42), z.literal(43)])
const assertEnum: A.Equals<ZodFormatter<typeof enumSchema>, typeof enumZodFormatter> = 1
assertEnum

const bigSchema = schema.big()
const bigZodFormatter = z.union([z.number(), z.bigint()])
const assertBig: A.Equals<ZodFormatter<typeof bigSchema>, typeof bigZodFormatter> = 1
assertBig
