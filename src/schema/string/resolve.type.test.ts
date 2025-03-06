import type { A } from 'ts-toolbelt'

import type { ResolveStringSchema } from './resolve.js'
import { string } from './schema_.js'

const standardStr = string()
const assertResolveStandard: A.Equals<ResolveStringSchema<typeof standardStr>, string> = 1
assertResolveStandard

const enumStr = string().enum('foo', 'bar', 'baz')
const assertResolveEnum: A.Equals<ResolveStringSchema<typeof enumStr>, 'foo' | 'bar' | 'baz'> = 1
assertResolveEnum

const constStr = string().const('foo')
const assertResolveConst: A.Equals<ResolveStringSchema<typeof constStr>, 'foo'> = 1
assertResolveConst
