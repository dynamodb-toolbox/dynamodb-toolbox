import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const strSchema = string()
const strZodSchema = z.string()
const assertStrSchema: A.Equals<FormattedValueZodSchema<typeof strSchema>, typeof strZodSchema> = 1
assertStrSchema

const optStrSchema = strSchema.optional()
const optZodStrSchema = strZodSchema.optional()
const assertOptStrSchema: A.Equals<
  FormattedValueZodSchema<typeof optStrSchema>,
  typeof optZodStrSchema
> = 1
assertOptStrSchema

const literalStrSchema = strSchema.const('foo')
const literalZodStrSchema = z.literal('foo')
const assertLiteralStrSchema: A.Equals<
  FormattedValueZodSchema<typeof literalStrSchema>,
  typeof literalZodStrSchema
> = 1
assertLiteralStrSchema

const enumStrSchema = strSchema.enum('foo', 'bar')
const enumStrZodSchema = z.enum(['foo', 'bar'])
const assertEnumStrSchema: A.Equals<
  FormattedValueZodSchema<typeof enumStrSchema>,
  typeof enumStrZodSchema
> = 1
assertEnumStrSchema
