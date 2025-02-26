import type { A } from 'ts-toolbelt'

import type { ResolveNumberSchema } from './resolve.js'
import { number } from './typer.js'

const standardNumber = number()
const assertResolveStandard: A.Equals<ResolveNumberSchema<typeof standardNumber>, number> = 1
assertResolveStandard

const enumNumber = number().enum(1, 2, 3)
const assertResolveEnum: A.Equals<ResolveNumberSchema<typeof enumNumber>, 1 | 2 | 3> = 1
assertResolveEnum

const constNumber = number().const(1)
const assertResolveConst: A.Equals<ResolveNumberSchema<typeof constNumber>, 1> = 1
assertResolveConst

const bigNumber = number().big()
const assertResolveBig: A.Equals<ResolveNumberSchema<typeof bigNumber>, number | bigint> = 1
assertResolveBig
