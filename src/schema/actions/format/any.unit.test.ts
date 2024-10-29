import { any } from '~/attributes/index.js'

import { anyAttrFormatter } from './any.js'

describe('anyAttrFormatter', () => {
  test('simply clones the value', () => {
    const _any = any().freeze()

    const raw = { foo: 'bar' }
    const formatter = anyAttrFormatter(_any, raw)

    const { value: transformedValue } = formatter.next()

    expect(transformedValue).not.toBe(raw)
    expect(transformedValue).toStrictEqual(raw)

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toStrictEqual(raw)
    expect(done).toBe(true)
  })

  test('does not transform if transform is set to false', () => {
    const _any = any().freeze()

    const raw = { foo: 'bar' }
    const formatter = anyAttrFormatter(_any, raw, { transform: false })

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toStrictEqual(raw)
    expect(done).toBe(true)
  })

  // TODO: Apply validation
})
