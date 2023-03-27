import { O } from 'ts-toolbelt'

import { $required } from './item'

const target = {
  [$required]: 'atLeastOnce' as const,
  required: 'string'
}

const handler1 = {}

const proxy1 = new Proxy(target, handler1)
