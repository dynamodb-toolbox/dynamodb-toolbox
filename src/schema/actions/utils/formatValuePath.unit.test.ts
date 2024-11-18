import { formatValuePath } from './formatValuePath.js'

describe('formatValuePath', () => {
  test('it correctly formats simple paths', () => {
    expect(formatValuePath(['foo', 'bar'])).toStrictEqual('foo.bar')
    expect(formatValuePath(['foo', 1, 2, 'bar'])).toStrictEqual('foo[1][2].bar')
  })

  test('it correctly formats complex paths', () => {
    expect(formatValuePath(['f.oo', 'ba[r', 'ba]z'])).toStrictEqual(`['f.oo']['ba[r']['ba]z']`)
  })
})
