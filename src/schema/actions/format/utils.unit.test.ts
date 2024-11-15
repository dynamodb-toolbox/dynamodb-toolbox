import { formatValuePath, matchProjection, sanitize } from './utils.js'

describe('sanitizes', () => {
  test('sanitizes str with special chars', () => {
    expect(sanitize('-a[b]c/d{e}f(g)h*i+j?k.l\\m^n$o|p')).toBe(
      '\\-a\\[b\\]c\\/d\\{e\\}f\\(g\\)h\\*i\\+j\\?k\\.l\\\\m\\^n\\$o\\|p'
    )
  })
})

describe('matchProjection', () => {
  test('list', () => {
    expect(matchProjection(/\[\d+\]/, ['foo', 'bar'])).toStrictEqual({ isProjected: false })
    expect(matchProjection(/\[\d+\]/, ['[1]', '[2].bar'])).toStrictEqual({ isProjected: true })
    expect(matchProjection(/\[\d+\]/, ['[1].foo', '[2].bar'])).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })
  })

  test('map/record', () => {
    expect(matchProjection(new RegExp("^\\.key|^\\['key']"), ['.foo', '.bar'])).toStrictEqual({
      isProjected: false
    })

    expect(matchProjection(new RegExp("^\\.key|^\\['key']"), ['.key', '.bar'])).toStrictEqual({
      isProjected: true
    })

    expect(
      matchProjection(new RegExp("^\\.key|^\\['key']"), ['.key.foo', '.key.bar'])
    ).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })

    expect(
      matchProjection(new RegExp("^\\.key|^\\['key']"), [`['key'].foo`, `['key'].bar`])
    ).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })
  })

  test('schema', () => {
    expect(matchProjection(new RegExp("^key|^\\['key']"), ['foo', 'bar'])).toStrictEqual({
      isProjected: false
    })

    expect(matchProjection(new RegExp("^key|^\\['key']"), ['key', 'bar'])).toStrictEqual({
      isProjected: true
    })

    expect(matchProjection(new RegExp("^key|^\\['key']"), ['key.foo', 'key.bar'])).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })

    expect(
      matchProjection(new RegExp("^key|^\\['key']"), [`['key'].foo`, `['key'].bar`])
    ).toStrictEqual({
      isProjected: true,
      childrenAttributes: ['.foo', '.bar']
    })
  })
})

describe('formatValuePath', () => {
  test('it correctly formats simple paths', () => {
    expect(formatValuePath(['foo', 'bar'])).toStrictEqual('foo.bar')
    expect(formatValuePath(['foo', 1, 2, 'bar'])).toStrictEqual('foo[1][2].bar')
  })

  test('it correctly formats complex paths', () => {
    expect(formatValuePath(['f.oo', 'ba[r', 'ba]z'])).toStrictEqual(`['f.oo']['ba[r']['ba]z']`)
  })
})
