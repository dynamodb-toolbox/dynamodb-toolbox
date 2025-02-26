import type { A } from 'ts-toolbelt'

import type { ResolveBinarySchema } from './resolve.js'
import { binary } from './typer.js'

const standardBin = binary()
const assertResolveStandard: A.Equals<ResolveBinarySchema<typeof standardBin>, Uint8Array> = 1
assertResolveStandard

const binA = new Uint8Array([1, 2, 3])
const binB = new Uint8Array([2, 3, 4])

const enumBin = binary().enum(binA, binB)
const assertResolveEnum: A.Equals<ResolveBinarySchema<typeof enumBin>, typeof binA> = 1
assertResolveEnum

const constBin = binary().const(binA)
const assertResolveConst: A.Equals<ResolveBinarySchema<typeof constBin>, typeof binA> = 1
assertResolveConst
