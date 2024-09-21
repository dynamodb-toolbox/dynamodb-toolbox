import type { A } from 'ts-toolbelt'

import type { ResolveBooleanAttribute } from './resolve.js'
import { boolean } from './typer.js'

const standardBool = boolean().freeze()
const assertResolveStandard: A.Equals<ResolveBooleanAttribute<typeof standardBool>, boolean> = 1
assertResolveStandard

const enumBool = boolean().enum(true).freeze()
const assertResolveEnum: A.Equals<ResolveBooleanAttribute<typeof enumBool>, true> = 1
assertResolveEnum

const constBool = boolean().const(true).freeze()
const assertResolveConst: A.Equals<ResolveBooleanAttribute<typeof constBool>, true> = 1
assertResolveConst
