import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { binary, boolean, nul, number, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const nulSchema = nul()
const nulZodSchema = z.null()
const assertNulSchema: A.Equals<FormattedValueZodSchema<typeof nulSchema>, typeof nulZodSchema> = 1
assertNulSchema

const optNulSchema = nul().optional()
const optZodNulSchema = z.null().optional()
const assertOptNulSchema: A.Equals<
  FormattedValueZodSchema<typeof optNulSchema>,
  typeof optZodNulSchema
> = 1
assertOptNulSchema

// --- BOOL ---

const boolSchema = boolean()
const boolZodSchema = z.boolean()
const assertBoolSchema: A.Equals<
  FormattedValueZodSchema<typeof boolSchema>,
  typeof boolZodSchema
> = 1
assertBoolSchema

const optBoolSchema = boolean().optional()
const optZodBoolSchema = z.boolean().optional()
const assertOptBoolSchema: A.Equals<
  FormattedValueZodSchema<typeof optBoolSchema>,
  typeof optZodBoolSchema
> = 1
assertOptBoolSchema

// --- NUM ---

const numSchema = number()
const numZodSchema = z.number()
const assertNumSchema: A.Equals<FormattedValueZodSchema<typeof numSchema>, typeof numZodSchema> = 1
assertNumSchema

const optNumSchema = number().optional()
const optZodNumSchema = z.number().optional()
const assertOptNumSchema: A.Equals<
  FormattedValueZodSchema<typeof optNumSchema>,
  typeof optZodNumSchema
> = 1
assertOptNumSchema

// --- STR ---

const strSchema = string()
const strZodSchema = z.string()
const assertStrSchema: A.Equals<FormattedValueZodSchema<typeof strSchema>, typeof strZodSchema> = 1
assertStrSchema

const optStrSchema = string().optional()
const optZodStrSchema = z.string().optional()
const assertOptStrSchema: A.Equals<
  FormattedValueZodSchema<typeof optStrSchema>,
  typeof optZodStrSchema
> = 1
assertOptStrSchema

// --- BIN ---

const binSchema = binary()
const binZodSchema = z.instanceof(Uint8Array)
const assertBinSchema: A.Equals<FormattedValueZodSchema<typeof binSchema>, typeof binZodSchema> = 1
assertBinSchema

const optBinSchema = binary().optional()
const optZodBinSchema = z.instanceof(Uint8Array).optional()
const assertOptBinSchema: A.Equals<
  FormattedValueZodSchema<typeof optBinSchema>,
  typeof optZodBinSchema
> = 1
assertOptBinSchema
