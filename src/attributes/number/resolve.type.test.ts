import type { A } from 'ts-toolbelt'

import type { ResolveNumberAttribute } from './resolve.js'
import { number } from './typer.js'

const standardNumber = number().freeze()
const assertResolveStandard: A.Equals<ResolveNumberAttribute<typeof standardNumber>, number> = 1
assertResolveStandard

const enumNumber = number().enum(1, 2, 3).freeze()
const assertResolveEnum: A.Equals<ResolveNumberAttribute<typeof enumNumber>, 1 | 2 | 3> = 1
assertResolveEnum

const constNumber = number().const(1).freeze()
const assertResolveConst: A.Equals<ResolveNumberAttribute<typeof constNumber>, 1> = 1
assertResolveConst

const bigNumber = number().big().freeze()
const assertResolveBig: A.Equals<ResolveNumberAttribute<typeof bigNumber>, number | bigint> = 1
assertResolveBig
