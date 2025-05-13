import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const numSchema = number()
const numZodSchema = z.number()
const assertNumSchema: A.Equals<FormattedValueZodSchema<typeof numSchema>, typeof numZodSchema> = 1
assertNumSchema

const optNumSchema = numSchema.optional()
const optZodNumSchema = numZodSchema.optional()
const assertOptNumSchema: A.Equals<
  FormattedValueZodSchema<typeof optNumSchema>,
  typeof optZodNumSchema
> = 1
assertOptNumSchema

const literalNumSchema = numSchema.const(42)
const literalZodNumSchema = z.literal(42)
const assertLiteralNumSchema: A.Equals<
  FormattedValueZodSchema<typeof literalNumSchema>,
  typeof literalZodNumSchema
> = 1
assertLiteralNumSchema

const enumNumSchema = numSchema.enum(42, 43)
const enumNumZodSchema = z.union([z.literal(42), z.literal(43)])
const assertEnumNumSchema: A.Equals<
  FormattedValueZodSchema<typeof enumNumSchema>,
  typeof enumNumZodSchema
> = 1
assertEnumNumSchema

const bigSchema = numSchema.big()
const zodBigSchema = z.union([z.number(), z.bigint()])
const assertBigNumSchema: A.Equals<
  FormattedValueZodSchema<typeof bigSchema>,
  typeof zodBigSchema
> = 1
assertBigNumSchema
