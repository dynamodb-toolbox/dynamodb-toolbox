import validateTypes from '../lib/validateTypes';
import { DocumentClient } from './bootstrap-tests';

describe('validateTypes', () => {

  it('validates string', async () => {
    let result = validateTypes(DocumentClient)({ type: 'string' },'attr','string value')
    expect(result).toBe('string value')
  })

  it('fails with invalid string', async () => {
    expect(() => { validateTypes(DocumentClient)({ type: 'string' },'attr',[]) })
      .toThrow(`'attr' must be of type string`)
  })

  it('validates boolean', async () => {
    let result = validateTypes(DocumentClient)({ type: 'boolean' },'attr',false)
    expect(result).toBe(false)
  })

  it('fails with invalid boolean', async () => {
    expect(() => { validateTypes(DocumentClient)({ type: 'boolean' },'attr','string') })
      .toThrow(`'attr' must be of type boolean`)
  })

  it('validates number (int)', async () => {
    let result = validateTypes(DocumentClient)({ type: 'number' },'attr',123)
    expect(result).toBe(123)
  })

  it('validates number (float)', async () => {
    let result = validateTypes(DocumentClient)({ type: 'number' },'attr',1.23)
    expect(result).toBe(1.23)
  })

  it('fails with invalid number', async () => {
    expect(() => { validateTypes(DocumentClient)({ type: 'number' },'attr','string') })
      .toThrow(`'attr' must be of type number`)
  })

  it('validates list', async () => {
    let result = validateTypes(DocumentClient)({ type: 'list' },'attr',[1,2,3])
    expect(result).toEqual([1,2,3])
  })

  it('fails with invalid list', async () => {
    expect(() => { validateTypes(DocumentClient)({ type: 'list' },'attr',false) })
      .toThrow(`'attr' must be a list (array)`)
  })

  it('validates map', async () => {
    let result = validateTypes(DocumentClient)({ type: 'map' },'attr',{ test: true })
    expect(result).toEqual({ test: true })
  })

  it('fails with invalid map', async () => {
    expect(() => { validateTypes(DocumentClient)({ type: 'map' },'attr',false) })
      .toThrow(`'attr' must be a map (object)`)
  })

  it('validates set', async () => {
    let result = validateTypes(DocumentClient)({ type: 'set', setType: 'number' },'attr',[1,2,3])
    expect(result).toEqual(DocumentClient.createSet([1,2,3]))
  })

  it('fails with invalid set', async () => {
    expect(() => { validateTypes(DocumentClient)({ type: 'set', setType: 'string' },'attr',false) })
      .toThrow(`'attr' must be a valid set (array)`)
  })

  it('fails with parsing set if DocumentClient is missing', async () => {
    expect(() => { validateTypes()({ type: 'set', setType: 'string' },'attr',[]) })
      .toThrow(`DocumentClient required for this operation`)
  })

  it('fails with parsing set if DocumentClient is missing', async () => {
    expect(() => { validateTypes()({ type: 'set', setType: 'string', coerce: true },'attr','test') })
      .toThrow(`DocumentClient required for this operation`)
  })


})
