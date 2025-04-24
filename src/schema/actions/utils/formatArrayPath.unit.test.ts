import { formatArrayPath } from './formatArrayPath.js'

describe('formatValuePath', () => {
  test('it correctly formats simple paths', () => {
    expect(formatArrayPath(['foo', 'bar'])).toStrictEqual('foo.bar')
    expect(formatArrayPath(['foo', 1, 2, 'bar'])).toStrictEqual('foo[1][2].bar')
  })

  test('it correctly formats complex paths', () => {
    expect(formatArrayPath(['f.oo', 'ba[r', 'ba]z'])).toStrictEqual(`['f.oo']['ba[r']['ba]z']`)
  })
})
