import type { A } from 'ts-toolbelt'

import type { ResolveBinaryAttribute } from './resolve.js'
import { binary } from './typer.js'

const standardBin = binary().freeze()
const assertResolveStandard: A.Equals<ResolveBinaryAttribute<typeof standardBin>, Uint8Array> = 1
assertResolveStandard

const binA = new Uint8Array([1, 2, 3])
const binB = new Uint8Array([2, 3, 4])

const enumBin = binary().enum(binA, binB).freeze()
const assertResolveEnum: A.Equals<ResolveBinaryAttribute<typeof enumBin>, typeof binA> = 1
assertResolveEnum

const constBin = binary().const(binA).freeze()
const assertResolveConst: A.Equals<ResolveBinaryAttribute<typeof constBin>, typeof binA> = 1
assertResolveConst
