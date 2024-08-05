import type { A } from 'ts-toolbelt'

import { any } from './index.js'
import type { ResolveAnyAttribute } from './index.js'

// Regular
const regular = any().freeze()

const assertRegular: A.Equals<ResolveAnyAttribute<typeof regular>, unknown> = 1
assertRegular

// Cast
const cast = any().castAs<'foo' | 'bar'>().freeze()

const assertCast: A.Equals<ResolveAnyAttribute<typeof cast>, 'foo' | 'bar'> = 1
assertCast
