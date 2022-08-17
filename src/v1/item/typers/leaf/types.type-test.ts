import type { A } from 'ts-toolbelt'

import type { ResolveLeafType } from './types'

const assertResolveString: A.Equals<ResolveLeafType<'string'>, string> = 1
assertResolveString

const assertResolveNumber: A.Equals<ResolveLeafType<'number'>, number> = 1
assertResolveNumber

const assertResolveBoolean: A.Equals<ResolveLeafType<'boolean'>, boolean> = 1
assertResolveBoolean

const assertResolveBinary: A.Equals<ResolveLeafType<'binary'>, Buffer> = 1
assertResolveBinary
