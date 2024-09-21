import type { A } from 'ts-toolbelt'

import type { ResolveNullAttribute } from './resolve.js'
import { nul } from './typer.js'

const standardNul = nul().freeze()
const assertResolveStandard: A.Equals<ResolveNullAttribute<typeof standardNul>, null> = 1
assertResolveStandard
