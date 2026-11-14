import { parseStringPath } from './parseStringPath.js'

describe('parseStringPath', () => {
  test('it correctly parses simple paths', () => {
    expect(parseStringPath('foo.bar')).toStrictEqual(['foo', 'bar'])
    expect(parseStringPath('foo[1][2].bar')).toStrictEqual(['foo', 1, 2, 'bar'])
  })

  test('it correctly parses complex paths', () => {
    expect(parseStringPath("['f.oo']['ba[r']['ba]z']")).toStrictEqual(['f.oo', 'ba[r', 'ba]z'])
  })

  test('it preserves spaces, special characters, and non-ASCII characters', () => {
    expect(parseStringPath('first name')).toStrictEqual(['first name'])
    expect(parseStringPath('$price')).toStrictEqual(['$price'])
    expect(parseStringPath('prénom')).toStrictEqual(['prénom'])
    expect(parseStringPath('scores.a b')).toStrictEqual(['scores', 'a b'])
    expect(parseStringPath("scores['a b']")).toStrictEqual(['scores', 'a b'])
  })
})
