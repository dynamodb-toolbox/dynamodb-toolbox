import validateTypes, { typeOf, hasSameTypes } from '../lib/validateTypes'

import { ddbDocClient as DocumentClient } from './bootstrap-tests'

describe('validateTypes', () => {
  describe('typeOf', () => {
    it('detects null type', () => {
      expect(typeOf(null)).toBe('null')
    })

    it('detects binary type', () => {
      expect(typeOf(new Int32Array())).toBe('Binary')
    })

    it('detects string type', () => {
      expect(typeOf('str')).toBe('String')
    })

    it('detects object type', () => {
      expect(typeOf(Object.create(null))).toBe('Object')
    })

    it('detects undefined type', () => {
      expect(typeOf()).toBe('undefined')
    })
  })

  describe('hasSameType', () => {
    it('should have same types for empty array', () => {
      expect(hasSameTypes([])).toBeTruthy()
    })

    it('should have same types for one element array', () => {
      expect(hasSameTypes([''])).toBeTruthy()
    })

    it('should have same types for all numbers array', () => {
      expect(hasSameTypes([1, 2])).toBeTruthy()
    })

    it('should have different types for string/numbers array', () => {
      expect(hasSameTypes([1, '2'])).toBeFalsy()
    })
  })

  it('validates string', async () => {
    let result = validateTypes(DocumentClient)(
      { type: 'string' },
      'attr',
      'string value'
    )
    expect(result).toBe('string value')
  })

  it('fails with invalid string', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'string' }, 'attr', [])
    }).toThrow(`'attr' must be of type string`)
  })

  it('validates boolean', async () => {
    let result = validateTypes(DocumentClient)(
      { type: 'boolean' },
      'attr',
      false
    )
    expect(result).toBe(false)
  })

  it('fails with invalid boolean', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'boolean' }, 'attr', 'string')
    }).toThrow(`'attr' must be of type boolean`)
  })

  it('validates number (int)', async () => {
    let result = validateTypes(DocumentClient)({ type: 'number' }, 'attr', 123)
    expect(result).toBe(123)
  })

  it('validates number (float)', async () => {
    let result = validateTypes(DocumentClient)({ type: 'number' }, 'attr', 1.23)
    expect(result).toBe(1.23)
  })

  it('fails with invalid number', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number' }, 'attr', 'string')
    }).toThrow(`'attr' must be of type number`)
  })

  it('validates list', async () => {
    let result = validateTypes(DocumentClient)({ type: 'list' }, 'attr', [
      1,
      2,
      3,
    ])
    expect(result).toEqual([1, 2, 3])
  })

  it('fails with invalid list', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'list' }, 'attr', false)
    }).toThrow(`'attr' must be a list (array)`)
  })

  it('validates map', async () => {
    let result = validateTypes(DocumentClient)({ type: 'map' }, 'attr', {
      test: true,
    })
    expect(result).toEqual({ test: true })
  })

  it('fails with invalid map', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'map' }, 'attr', false)
    }).toThrow(`'attr' must be a map (object)`)
  })

  it('validates set from array', async () => {
    let result = validateTypes(DocumentClient)(
      { type: 'set', setType: 'number' },
      'attr',
      [1, 2, 3]
    )
    expect(result).toEqual(new Set([1, 2, 3]))
  })

  it('validates set from well formed string', async () => {
    let result = validateTypes(DocumentClient)(
      { type: 'set', setType: 'string', coerce: true },
      'attr',
      'a,b,c'
    )
    expect(result).toEqual(new Set(['a', 'b', 'c']))
  })

  it('validates set from set', async () => {
    let result = validateTypes(DocumentClient)(
      { type: 'set', setType: 'string', coerce: true },
      'attr',
      new Set(['a', 'b', 'c'])
    )
    expect(result).toEqual(new Set(['a', 'b', 'c']))
  })

  it('fails with invalid set', async () => {
    expect(() => {
      validateTypes(DocumentClient)(
        { type: 'set', setType: 'string' },
        'attr',
        false
      )
    }).toThrow(`'attr' must be a valid set (array)`)
  })
})
