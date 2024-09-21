import type { A } from 'ts-toolbelt'

import type { ResolveStringAttribute } from './resolve.js'
import { string } from './typer.js'

const standardStr = string().freeze()
const assertResolveStandard: A.Equals<ResolveStringAttribute<typeof standardStr>, string> = 1
assertResolveStandard

const enumStr = string().enum('foo', 'bar', 'baz').freeze()
const assertResolveEnum: A.Equals<ResolveStringAttribute<typeof enumStr>, 'foo' | 'bar' | 'baz'> = 1
assertResolveEnum

const constStr = string().const('foo').freeze()
const assertResolveConst: A.Equals<ResolveStringAttribute<typeof constStr>, 'foo'> = 1
assertResolveConst
