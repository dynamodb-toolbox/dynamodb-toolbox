import validateTypes from '../lib/validateTypes'

import { DocumentClient } from './bootstrap.test'

describe('validateTypes', () => {
  it('validates string', async () => {
    const result = validateTypes(DocumentClient)({ type: 'string' }, 'attr', 'string value')
    expect(result).toBe('string value')
  })

  it('fails with invalid string', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'string' }, 'attr', [])
    }).toThrow(`'attr' must be of type string`)
  })

  it('validates boolean', async () => {
    const result = validateTypes(DocumentClient)({ type: 'boolean' }, 'attr', false)
    expect(result).toBe(false)
  })

  it('fails with invalid boolean', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'boolean' }, 'attr', 'string')
    }).toThrow(`'attr' must be of type boolean`)
  })

  it('validates number (123)', async () => {
    const result = validateTypes(DocumentClient)({ type: 'number' }, 'attr', 123)
    expect(result).toBe(123)
  })

  it('validates number (1.23)', async () => {
    const result = validateTypes(DocumentClient)({ type: 'number' }, 'attr', 1.23)
    expect(result).toBe(1.23)
  })

  it('validates number (0)', async () => {
    const result = validateTypes(DocumentClient)({ type: 'number' }, 'attr', 0)
    expect(result).toBe(0)
  })

  // parseFloat("123.00") === 123 -> String(parseFloat("123.00")) !== "123.00"
  it('validates number (coerce, float "123.00")', async () => {
    const result = validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', '123.00')
    expect(result).toBe(123)
  })

  it('fails with invalid number (NaN)', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number' }, 'attr', NaN)
    }).toThrow(`'attr' must be a finite number`)
  })

  it('fails with invalid number (Infinity)', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number' }, 'attr', Infinity)
    }).toThrow(`'attr' must be a finite number`)
  })

  it('fails with invalid number (string)', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number' }, 'attr', 'string')
    }).toThrow(`'attr' must be of type number`)
  })

  // parseInt("123abc"), parseFloat("123abc") === 123
  it('fails with invalid number (coerce, "123abc")', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', '123abc')
    }).toThrow(`Could not convert '123abc' to a number for 'attr'`)
  })

  // Number("") === 0
  it('fails with invalid number (coerce, "")', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', '')
    }).toThrow(`Could not convert '' to a number for 'attr'`)
  })

  // Number(true) === 1, Number(false) === 0
  it('fails with invalid number (coerce, boolean)', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', true)
    }).toThrow(`Could not convert 'true' to a number for 'attr'`)
  })

  // Number([]) === 0
  it('fails with invalid number (coerce, [])', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', [])
    }).toThrow(`Could not convert '[]' to a number for 'attr'`)
  })

  // Number([123]) === 123
  it('fails with invalid number (coerce, [123])', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', [123])
    }).toThrow(`Could not convert '[123]' to a number for 'attr'`)
  })

  // Number("Infinity") === Infinity
  it('fails with invalid number (coerce, "Infinity")', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', 'Infinity')
    }).toThrow(`Could not convert 'Infinity' to a number for 'attr'`)
  })

  // Number("NaN") === NaN
  it('fails with invalid number (coerce, "NaN")', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'number', coerce: true }, 'attr', 'NaN')
    }).toThrow(`Could not convert 'NaN' to a number for 'attr'`)
  })

  it('validates list', async () => {
    const result = validateTypes(DocumentClient)({ type: 'list' }, 'attr', [1, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })

  it('fails with invalid list', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'list' }, 'attr', false)
    }).toThrow(`'attr' must be a list (array)`)
  })

  it('validates map', async () => {
    const result = validateTypes(DocumentClient)({ type: 'map' }, 'attr', { test: true })
    expect(result).toEqual({ test: true })
  })

  it('fails with invalid map', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'map' }, 'attr', false)
    }).toThrow(`'attr' must be a map (object)`)
  })

  it('validates set', async () => {
    const result = validateTypes(DocumentClient)({ type: 'set', setType: 'number' }, 'attr', [
      1,
      2,
      3
    ])
    expect(result).toEqual(DocumentClient.createSet([1, 2, 3]))
  })

  it('fails with invalid set', async () => {
    expect(() => {
      validateTypes(DocumentClient)({ type: 'set', setType: 'string' }, 'attr', false)
    }).toThrow(`'attr' must be a valid set (array)`)
  })

  it('fails with parsing set if DocumentClient is missing', async () => {
    expect(() => {
      // @ts-expect-error
      validateTypes()({ type: 'set', setType: 'string' }, 'attr', [])
    }).toThrow(`DocumentClient required for this operation`)
  })

  it('fails with parsing set if DocumentClient is missing', async () => {
    expect(() => {
      // @ts-expect-error
      validateTypes()({ type: 'set', setType: 'string', coerce: true }, 'attr', 'test')
    }).toThrow(`DocumentClient required for this operation`)
  })
})
