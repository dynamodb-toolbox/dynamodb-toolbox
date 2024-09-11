import type { A } from 'ts-toolbelt'

import { schema, string } from '~/index.js'
import type { ParserInput } from '~/index.js'

const mySchema = schema({
  required: string(),
  alwaysRequired: string().required('always'),
  alwaysRequiredUpdateDefaulted: string().required('always').updateDefault('foo'),
  optional: string().optional(),
  defaulted: string().default('foo'),
  key: string().key(),
  keyOptional: string().key().optional(),
  keyDefaulted: string().key().default('foo')
})

const assertDefaultMode: A.Equals<
  ParserInput<typeof mySchema>,
  {
    required: string
    alwaysRequired: string
    alwaysRequiredUpdateDefaulted: string
    optional?: string
    defaulted?: string
    key: string
    keyOptional?: string
    keyDefaulted?: string
  }
> = 1
assertDefaultMode

const assertDefaultModeNoFill: A.Equals<
  ParserInput<typeof mySchema, { fill: false }>,
  {
    required: string
    alwaysRequired: string
    alwaysRequiredUpdateDefaulted: string
    optional?: string
    // defaulted is required
    defaulted: string
    key: string
    keyOptional?: string
    // keyDefaulted is required
    keyDefaulted: string
  }
> = 1
assertDefaultModeNoFill

const assertKeyMode: A.Equals<
  ParserInput<typeof mySchema, { mode: 'key' }>,
  {
    // only key attributes are kept
    key: string
    keyOptional?: string
    keyDefaulted?: string
  }
> = 1
assertKeyMode

const assertKeyModeNoFill: A.Equals<
  ParserInput<typeof mySchema, { fill: false; mode: 'key' }>,
  {
    key: string
    keyOptional?: string
    // keyDefaulted is required
    keyDefaulted: string
  }
> = 1
assertKeyModeNoFill

const assertUpdateMode: A.Equals<
  ParserInput<typeof mySchema, { mode: 'update' }>,
  {
    required?: string
    // only 'always' required are required
    alwaysRequired: string
    alwaysRequiredUpdateDefaulted?: string
    optional?: string
    defaulted?: string
    // that includes 'key' but not keyDefaulted (keyDefault is used)
    key: string
    keyOptional?: string
    keyDefaulted?: string
  }
> = 1
assertUpdateMode

const assertUpdateModeNoFill: A.Equals<
  ParserInput<typeof mySchema, { fill: false; mode: 'update' }>,
  {
    required?: string
    alwaysRequired: string
    // updateDefaulted is required
    alwaysRequiredUpdateDefaulted: string
    optional?: string
    defaulted?: string
    key: string
    keyOptional?: string
    keyDefaulted: string
  }
> = 1
assertUpdateModeNoFill

const reqStr = string().freeze()

const assertReqStr: A.Equals<ParserInput<typeof reqStr>, string> = 1
assertReqStr

const assertReqStrUpdate: A.Equals<
  ParserInput<typeof reqStr, { mode: 'update' }>,
  string | undefined
> = 1
assertReqStrUpdate

const optionalStr = string().optional().freeze()

const assertOptionalStr: A.Equals<ParserInput<typeof optionalStr>, string | undefined> = 1
assertOptionalStr
