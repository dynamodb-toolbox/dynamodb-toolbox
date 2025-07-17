import { matchItemProjection, matchListProjection, matchMapProjection, sanitize } from './utils.js'

describe('sanitizes', () => {
  test('sanitizes str with special chars', () => {
    expect(sanitize('-a[b]c/d{e}f(g)h*i+j?k.l\\m^n$o|p')).toBe(
      '\\-a\\[b\\]c\\/d\\{e\\}f\\(g\\)h\\*i\\+j\\?k\\.l\\\\m\\^n\\$o\\|p'
    )
  })
})

describe('matchProjection', () => {
  test('matchListProjection', () => {
    expect(matchListProjection(['foo', 'bar'])).toStrictEqual({ isProjected: false })
    expect(matchListProjection(['[1]', '[2].bar'])).toStrictEqual({ isProjected: true })
    expect(matchListProjection(['[1].foo', '[2].bar'])).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })
  })

  test('map/record', () => {
    expect(matchMapProjection('key', ['.foo', '.bar'])).toStrictEqual({
      isProjected: false
    })

    expect(matchMapProjection('key', ['.key', '.bar'])).toStrictEqual({
      isProjected: true
    })

    expect(matchMapProjection('key', ['.key.foo', '.key.bar'])).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })

    expect(matchMapProjection('key', [`['key'].foo`, `['key'].bar`])).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })

    expect(matchMapProjection('key', ['.keyWithSuffix'])).toStrictEqual({
      isProjected: false
    })
  })

  test('item', () => {
    expect(matchItemProjection('key', ['foo', 'bar'])).toStrictEqual({
      isProjected: false
    })

    expect(matchItemProjection('key', ['key', 'bar'])).toStrictEqual({
      isProjected: true
    })

    expect(matchItemProjection('key', ['key.foo', 'key.bar'])).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })

    expect(matchItemProjection('key', [`['key'].foo`, `['key'].bar`])).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })

    expect(matchItemProjection('key', ['keyWithSuffix'])).toStrictEqual({
      isProjected: false
    })
  })
})
