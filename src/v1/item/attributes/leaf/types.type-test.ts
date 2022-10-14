import type { A } from 'ts-toolbelt'

import type { ResolveLeafAttributeType } from './types'

const assertResolveString: A.Equals<ResolveLeafAttributeType<'string'>, string> = 1
assertResolveString

const assertResolveNumber: A.Equals<ResolveLeafAttributeType<'number'>, number> = 1
assertResolveNumber

const assertResolveBoolean: A.Equals<ResolveLeafAttributeType<'boolean'>, boolean> = 1
assertResolveBoolean

const assertResolveBinary: A.Equals<ResolveLeafAttributeType<'binary'>, Buffer> = 1
assertResolveBinary
