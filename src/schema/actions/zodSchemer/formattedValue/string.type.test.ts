import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { string } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = string()
const zodFormatter = z.string()
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt

const literalSchema = schema.const('foo')
const literalZodFormatter = z.literal('foo')
const assertLiteral: A.Equals<ZodFormatter<typeof literalSchema>, typeof literalZodFormatter> = 1
assertLiteral

const enumSchema = schema.enum('foo', 'bar')
const enumZodFormatter = z.enum(['foo', 'bar'])
const assertEnum: A.Equals<ZodFormatter<typeof enumSchema>, typeof enumZodFormatter> = 1
assertEnum
