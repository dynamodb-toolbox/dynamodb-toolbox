import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { binary, boolean, nul, number, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const nulSchema = nul()
const nulZodSchema = z.null()
const assertNulSchema: A.Equals<FormattedValueZodSchema<typeof nulSchema>, typeof nulZodSchema> = 1
assertNulSchema

const boolSchema = boolean()
const boolZodSchema = z.boolean()
const assertBoolSchema: A.Equals<
  FormattedValueZodSchema<typeof boolSchema>,
  typeof boolZodSchema
> = 1
assertBoolSchema

const numSchema = number()
const numZodSchema = z.number()
const assertNumSchema: A.Equals<FormattedValueZodSchema<typeof numSchema>, typeof numZodSchema> = 1
assertNumSchema

const strSchema = string()
const strZodSchema = z.string()
const assertStrSchema: A.Equals<FormattedValueZodSchema<typeof strSchema>, typeof strZodSchema> = 1
assertStrSchema

const binSchema = binary()
const binZodSchema = z.instanceof(Uint8Array)
const assertBinSchema: A.Equals<FormattedValueZodSchema<typeof binSchema>, typeof binZodSchema> = 1
assertBinSchema
