import type { A } from 'ts-toolbelt'

import type { ResolvePrimitiveAttributeType } from './types.js'

const assertResolveNull: A.Equals<ResolvePrimitiveAttributeType<'null'>, null> = 1
assertResolveNull

const assertResolveBoolean: A.Equals<ResolvePrimitiveAttributeType<'boolean'>, boolean> = 1
assertResolveBoolean

const assertResolveBinary: A.Equals<ResolvePrimitiveAttributeType<'binary'>, Uint8Array> = 1
assertResolveBinary
