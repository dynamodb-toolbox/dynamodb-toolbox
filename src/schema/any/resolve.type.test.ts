import type { A } from 'ts-toolbelt'

import { any } from './index.js'
import type { ResolveAnySchema } from './index.js'

// Regular
const regular = any()

const assertRegular: A.Equals<ResolveAnySchema<typeof regular>, unknown> = 1
assertRegular

// Cast
const cast = any().castAs<'foo' | 'bar'>()

const assertCast: A.Equals<ResolveAnySchema<typeof cast>, 'foo' | 'bar'> = 1
assertCast
