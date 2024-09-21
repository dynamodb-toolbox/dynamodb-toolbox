import type { A } from 'ts-toolbelt'

import type { ResolvePrimitiveAttributeType } from './types.js'

const assertResolveNull: A.Equals<ResolvePrimitiveAttributeType<'null'>, null> = 1
assertResolveNull
