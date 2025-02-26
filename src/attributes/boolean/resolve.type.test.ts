import type { A } from 'ts-toolbelt'

import type { ResolveBooleanSchema } from './resolve.js'
import { boolean } from './typer.js'

const standardBool = boolean()
const assertResolveStandard: A.Equals<ResolveBooleanSchema<typeof standardBool>, boolean> = 1
assertResolveStandard

const enumBool = boolean().enum(true)
const assertResolveEnum: A.Equals<ResolveBooleanSchema<typeof enumBool>, true> = 1
assertResolveEnum

const constBool = boolean().const(true)
const assertResolveConst: A.Equals<ResolveBooleanSchema<typeof constBool>, true> = 1
assertResolveConst
