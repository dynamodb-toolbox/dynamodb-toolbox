const getKey = require('../../lib/getKey')

describe('getKey', () => {
  describe('pk', () => {
    describe('is a string', () => {
      it('returns the pk data in an object', () => {
        const data = { pk: 'id1' }
        const schema = {
          pk: { partitionKey: true, type: 'string', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk')
  
        expect(result).toEqual({ pk: 'id1' })
      })

      it('can not be empty, its an AWS Dynamodb thing', () => {
        const data = { pk: '' }
        const schema = {
          pk: { partitionKey: true, type: 'string', coerce: true },
        }
        const dummyDocumentClient = {}
  
        expect(() => getKey(dummyDocumentClient)(data, schema, 'pk')).toThrow(new Error('\'pk\' is required'))
      })
    })

    describe('can be a number', () => {
      it('returns the pk data', () => {
        const data = { pk: 123 }
        const schema = {
          pk: { partitionKey: true, type: 'number', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk')
  
        expect(result).toEqual({ pk: 123 })
      })

      it('can be 0', () => {
        const data = { pk: 0 }
        const schema = {
          pk: { partitionKey: true, type: 'number', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk')
  
        expect(result).toEqual({ pk: 0 })
      })

      it('can coerce from string', () => {
        const data = { pk: '123' }
        const schema = {
          pk: { partitionKey: true, type: 'number', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk')
  
        expect(result).toEqual({ pk: 123 })
      })
    })

    it('if no partitionKey in data will error', () => {
      const data = {}
      const schema = {
        pk: { partitionKey: true, type: 'string', coerce: true },
      }
      const dummyDocumentClient = {}

      expect(() => getKey(dummyDocumentClient)(data, schema, 'pk', 'sk')).toThrow(new Error('\'pk\' is required'))
    })
  })

  describe('sk', () => {
    it('returned object does not contain sort key if not required', () => {
      const data = { pk: 'id1' }
      const schema = {
        pk: { partitionKey: true, type: 'string', coerce: true },
      }
      const dummyDocumentClient = {}

      const result = getKey(dummyDocumentClient)(data, schema, 'pk')

      expect(result).toEqual({
        pk: 'id1'
      })
    })

    describe('can be a string', () => {
      it('returns the sk data', () => {
        const data = { pk: 'id1', sk: 'sk1' }
        const schema = {
          pk: { partitionKey: true, type: 'string', coerce: true },
          sk: { sortKey: true, type: 'string', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk', 'sk')
  
        expect(result).toEqual({ pk: 'id1', sk: 'sk1' })
      })

      it('can not be empty, its an AWS Dynamodb thing', () => {
        const data = { pk: 'id1', sk: '' }
        const schema = {
          pk: { partitionKey: true, type: 'string', coerce: true },
          sk: { sortKey: true, type: 'string', coerce: true },
        }
        const dummyDocumentClient = {}
  
        expect(() => getKey(dummyDocumentClient)(data, schema, 'pk', 'sk')).toThrow(new Error('\'sk\' is required'))
      })
    })

    describe('can be a number', () => {
      it('returns the sk data', () => {
        const data = { pk: 'id1', sk: 5 }
        const schema = {
          pk: { partitionKey: true, type: 'string', coerce: true },
          sk: { sortKey: true, type: 'number', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk', 'sk')
  
        expect(result).toEqual({ pk: 'id1', sk: 5 })
      })
  
      it('can coerce sortKey string to number', () => {
        const data = { pk: 'id1', sk: '5' }
        const schema = {
          pk: { partitionKey: true, type: 'string', coerce: true },
          sk: { sortKey: true, type: 'number', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk', 'sk')
  
        expect(result).toEqual({
          pk: 'id1',
          sk: 5
        })
      })
  
      it('can be 0', () => {
        const data = { pk: 'id1', sk: 0 }
        const schema = {
          pk: { partitionKey: true, type: 'string', coerce: true },
          sk: { sortKey: true, type: 'number', coerce: true },
        }
        const dummyDocumentClient = {}
  
        const result = getKey(dummyDocumentClient)(data, schema, 'pk', 'sk')
  
        expect(result).toEqual({
          pk: 'id1',
          sk: 0
        })
      })
    })

    it('if no sortKey in data will error', () => {
      const data = { pk: 'id1' }
      const schema = {
        pk: { partitionKey: true, type: 'string', coerce: true },
        sk: { sortKey: true, type: 'number', coerce: true },
      }
      const dummyDocumentClient = {}

      expect(() => getKey(dummyDocumentClient)(data, schema, 'pk', 'sk')).toThrow(new Error('\'sk\' is required'))
    })
  })
})
