import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number, record, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = record(string(), number())
const zodSchema = z.record(z.string(), z.number())
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema

const optSchema = schema.optional()
const optZodSchema = zodSchema.optional()
const assertOptSchema: A.Equals<FormattedValueZodSchema<typeof optSchema>, typeof optZodSchema> = 1
assertOptSchema

const strictSchema = record(string().enum('foo', 'bar'), number())
const zodStrictSchema = z.object({ foo: z.number(), bar: z.number() })
const assertStrictSchema: A.Equals<
  FormattedValueZodSchema<typeof strictSchema>,
  typeof zodStrictSchema
> = 1
assertStrictSchema

const partialSchema = strictSchema.partial()
const zodPartialSchema = z.record(z.enum(['foo', 'bar']), z.number())
const assertPartialSchema: A.Equals<
  FormattedValueZodSchema<typeof partialSchema>,
  typeof zodPartialSchema
> = 1
assertPartialSchema
