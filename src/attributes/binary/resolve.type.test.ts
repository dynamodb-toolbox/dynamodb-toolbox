import type { A } from 'ts-toolbelt'

import type { ResolveBinaryAttribute } from './resolve.js'
import { binary } from './typer.js'

const standardBin = binary().freeze()
const assertResolveStandard: A.Equals<ResolveBinaryAttribute<typeof standardBin>, Uint8Array> = 1
assertResolveStandard

const enumBin = binary()
  .enum(new Uint8Array([1, 2, 3]), new Uint8Array([2, 3, 4]))
  .freeze()
const assertResolveEnum: A.Equals<ResolveBinaryAttribute<typeof enumBin>, Uint8Array> = 1
assertResolveEnum

const constBin = binary()
  .const(new Uint8Array([1, 2, 3]))
  .freeze()
const assertResolveConst: A.Equals<ResolveBinaryAttribute<typeof constBin>, Uint8Array> = 1
assertResolveConst
