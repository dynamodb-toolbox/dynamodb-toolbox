import { parseStringPath } from './parseStringPath.js'

describe('parseStringPath', () => {
  test('it correctly parses simple paths', () => {
    expect(parseStringPath('foo.bar')).toStrictEqual(['foo', 'bar'])
    expect(parseStringPath('foo[1][2].bar')).toStrictEqual(['foo', 1, 2, 'bar'])
  })

  test('it correctly parses complex paths', () => {
    expect(parseStringPath("['f.oo']['ba[r']['ba]z']")).toStrictEqual(['f.oo', 'ba[r', 'ba]z'])
  })
})
