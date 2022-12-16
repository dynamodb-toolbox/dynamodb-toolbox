import type { A } from 'ts-toolbelt'

import type { ResolvePrimitiveAttributeType } from './types'

const assertResolveString: A.Equals<ResolvePrimitiveAttributeType<'string'>, string> = 1
assertResolveString

const assertResolveNumber: A.Equals<ResolvePrimitiveAttributeType<'number'>, number> = 1
assertResolveNumber

const assertResolveBoolean: A.Equals<ResolvePrimitiveAttributeType<'boolean'>, boolean> = 1
assertResolveBoolean

const assertResolveBinary: A.Equals<ResolvePrimitiveAttributeType<'binary'>, Buffer> = 1
assertResolveBinary
