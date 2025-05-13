import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { boolean } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = boolean()
const zodFormatter = z.boolean()
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt

const literalSchema = schema.const(true)
const literalZodFormatter = z.literal(true)
const assertLiteral: A.Equals<ZodFormatter<typeof literalSchema>, typeof literalZodFormatter> = 1
assertLiteral

const enumSchema = schema.enum(true, false)
const enumZodFormatter = z.union([z.literal(true), z.literal(false)])
const assertEnum: A.Equals<ZodFormatter<typeof enumSchema>, typeof enumZodFormatter> = 1
assertEnum
