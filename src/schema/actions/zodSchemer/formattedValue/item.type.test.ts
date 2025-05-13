import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { item, number, string } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = item({ str: string(), num: number() })
const zodFormatter = z.object({ str: z.string(), num: z.number() })
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert
