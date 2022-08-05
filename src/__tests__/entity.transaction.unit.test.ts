import { Table, Entity } from '../index'
import { DocumentClient } from './bootstrap-tests'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient,
  indexes: {
    GSI1: { partitionKey: 'GSI1pk' },
  },
})

const TestEntity = new Entity({
  name: 'TestEntity',
  autoExecute: false,
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', sortKey: true },
    testString: 'string',
  },
  table: TestTable,
})

const deleteParams = jest.spyOn(Entity.prototype, 'deleteParams')
const putParams = jest.spyOn(Entity.prototype, 'putParams')
const updateParams = jest.spyOn(Entity.prototype, 'updateParams')

describe('Entity transactional operations', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('deleteTransaction', () => {
    it('throws an error when given options that are not conditions or returnValues.', async () => {
      expect(() => {
        // @ts-expect-error
        TestEntity.deleteTransaction({ pk: 'some-pk', sk: 'some-sk' }, { invalidOption: true })
      }).toThrow(`Invalid delete transaction options: invalidOption`)
    })

    it('allows to provide conditions or returnValues as options.', async () => {
      expect(() => {
        TestEntity.deleteTransaction({ pk: 'some-pk', sk: 'some-sk' }, {
          returnValues: 'ALL_OLD',
          conditions: {
            attr: 'testString',
            exists: true,
          },
        })
      }).not.toThrow()
    })

    it('passes the correct parameters to deleteParams.', async () => {
      TestEntity.deleteTransaction(
        { pk: 'some-pk', sk: 'some-sk' },
        {
          returnValues: 'ALL_OLD',
        },
        {
          ExpressionAttributeValues: {
            ':pk': 'better-pk-to-delete',
          },
        },
      )

      expect(deleteParams).toHaveBeenCalledWith(
        {
          pk: 'some-pk',
          sk: 'some-sk',
        },
        { returnValues: 'ALL_OLD' },
        {
          ExpressionAttributeValues: {
            ':pk': 'better-pk-to-delete',
          },
        },
      )
    })

    it('transforms ReturnValues into ReturnValuesOnConditionCheckFailure if provided.', async () => {
      deleteParams.mockReturnValueOnce(
        {
          TableName: TestTable.name,
          Key: {
            pk: 'some-pk',
            sk: 'some-sk',
          },
          ReturnValues: 'ALL_OLD',
        },
      )

      const result = TestEntity.deleteTransaction(
        { pk: 'some-pk', sk: 'some-sk' },
        {
          returnValues: 'ALL_OLD',
        },
      )

      // @ts-expect-error
      expect(result.ReturnValues).toBeUndefined()
      expect(result).toEqual({
        Delete: expect.objectContaining({
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
        }),
      })
    })

    it('returns the item in transaction format.', async () => {
      deleteParams.mockReturnValueOnce({
        TableName: 'test-table',
        Key: ({
          pk: 'some-pk',
          sk: 'some-sk',
        }),
      })

      const result = TestEntity.deleteTransaction(
        { pk: 'some-pk', sk: 'some-sk' })

      expect(result).toEqual({
        Delete: {
          TableName: 'test-table',
          Key: {
            pk: 'some-pk',
            sk: 'some-sk',
          },
        },
      })
    })
  })


  describe('putTransaction', () => {
    it('throws an error when given options that are not conditions or returnValues.', async () => {
      expect(() => {
        // @ts-expect-error
        TestEntity.putTransaction({ pk: 'some-pk', sk: 'some-sk' }, { invalidOption: true })
      }).toThrow(`Invalid put transaction options: invalidOption`)
    })

    it('allows to provide conditions or returnValues as options.', async () => {
      expect(() => {
        TestEntity.putTransaction({ pk: 'some-pk', sk: 'some-sk' }, {
          returnValues: 'ALL_OLD',
          conditions: {
            attr: 'testString',
            exists: true,
          },
        })
      }).not.toThrow()
    })

    it('allows adding non mapped fields when strictSchemaCheck is false.', () => {
      expect(() => TestEntity.putTransaction({
        pk: 'test',
        sk: 'testsk',
        unknown: '?',
      }, {
        strictSchemaCheck: false,
      })).not.toThrow()
    })

    it('omits unmapped attributes when strictSchemaCheck is false.', () => {
      let { Put: { Item } } = TestEntity.putTransaction(
        { pk: 'x', sk: 'y', unknown: '?' },
        { strictSchemaCheck: false }
      )

      expect(Item.unknown).toBeUndefined()
    })

    it('throws an error when adding non mapped fields when strictSchemaCheck is true.', () => {
      expect(() => TestEntity.putTransaction({
        pk: 'test',
        sk: 'testsk',
        // @ts-expect-error
        unknown: 'unknown',
      }, {
        strictSchemaCheck: true,
      })).toThrow(`Field 'unknown' does not have a mapping or alias`)
    })

    it('passes the correct parameters to putParams.', async () => {
      TestEntity.putTransaction(
        { pk: 'some-pk', sk: 'some-sk', testString: 'some-test-string' },
        {
          returnValues: 'ALL_OLD',
        },
        {
          ExpressionAttributeValues: {
            ':testString': 'best-test-string',
          },
        },
      )

      expect(putParams).toHaveBeenCalledWith(
        {
          pk: 'some-pk',
          sk: 'some-sk',
          testString: 'some-test-string',
        },
        { returnValues: 'ALL_OLD' },
        {
          ExpressionAttributeValues: {
            ':testString': 'best-test-string',
          },
        },
      )
    })

    it('transforms ReturnValues into ReturnValuesOnConditionCheckFailure if provided.', async () => {
      putParams.mockReturnValueOnce(
        {
          TableName: TestTable.name,
          Item: {
            pk: 'some-pk',
            sk: 'some-sk',
            testString: 'some-test-string-with-change',
          },
          ReturnValues: 'ALL_OLD',
        },
      )

      const result = TestEntity.putTransaction(
        { pk: 'some-pk', sk: 'some-sk', testString: 'some-test-string-with-change' },
        {
          returnValues: 'ALL_OLD',
        },
      )

      // @ts-expect-error
      expect(result.ReturnValues).toBeUndefined()
      expect(result).toEqual({
        Put: expect.objectContaining({
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
        }),
      })
    })

    it('returns the item in transaction format.', async () => {
      putParams.mockReturnValueOnce({
        TableName: 'test-table',
        Item: ({
          pk: 'some-pk',
          sk: 'some-sk',
          testString: 'some-test-string-with-change',
        }),
      })

      const result = TestEntity.putTransaction(
        { pk: 'some-pk', sk: 'some-sk', testString: 'some-test-string-with-change' })

      expect(result).toEqual({
        Put: {
          TableName: 'test-table',
          Item: {
            pk: 'some-pk',
            sk: 'some-sk',
            testString: 'some-test-string-with-change',
          },
        },
      })
    })
  })

  describe('updateTransaction', () => {
    it('throws an error when given options that are not conditions or returnValues.', async () => {
      expect(() => {
        // @ts-expect-error
        TestEntity.updateTransaction({ pk: 'some-pk', sk: 'some-sk' }, { invalidOption: true })
      }).toThrow(`Invalid update transaction options: invalidOption`)
    })

    it('allows to provide conditions or returnValues as options.', async () => {
      expect(() => {
        TestEntity.updateTransaction({ pk: 'some-pk', sk: 'some-sk' }, {
          returnValues: 'ALL_OLD',
          conditions: {
            attr: 'testString',
            exists: true,
          },
        })
      }).not.toThrow()
    })

    it('passes the correct parameters to updateParams.', async () => {
      TestEntity.updateTransaction(
        { pk: 'some-pk', sk: 'some-sk', testString: 'some-test-string' },
        {
          returnValues: 'ALL_OLD',
        },
        {
          ExpressionAttributeValues: {
            ':testString': 'best-test-string',
          },
        },
      )

      expect(updateParams).toHaveBeenCalledWith(
        {
          pk: 'some-pk',
          sk: 'some-sk',
          testString: 'some-test-string',
        },
        { returnValues: 'ALL_OLD' },
        {
          ExpressionAttributeValues: {
            ':testString': 'best-test-string',
          },
        },
      )
    })

    it('transforms ReturnValues into ReturnValuesOnConditionCheckFailure if provided.', async () => {
      updateParams.mockReturnValueOnce(
        {
          TableName: TestTable.name,
          Key: {
            pk: 'some-pk',
            sk: 'some-sk',
          },
          UpdateExpression: 'some-update-expression',
          ReturnValues: 'ALL_OLD',
        },
      )

      const result = TestEntity.updateTransaction(
        { pk: 'some-pk', sk: 'some-sk', testString: 'some-test-string-with-change' },
        {
          returnValues: 'ALL_OLD',
        },
      )

      // @ts-expect-error
      expect(result.ReturnValues).toBeUndefined()
      expect(result).toEqual({
        Update: expect.objectContaining({
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
        }),
      })
    })

    it('returns the item in transaction format.', async () => {
      updateParams.mockReturnValueOnce({
        TableName: 'test-table',
        Key: {
          pk: 'some-pk',
          sk: 'some-sk',
        },
        UpdateExpression: 'some-update-expression',
      })

      const result = TestEntity.updateTransaction(
        { pk: 'some-pk', sk: 'some-sk', testString: 'some-test-string-with-change' })

      expect(result).toEqual({
        Update: {
          TableName: 'test-table',
          Key: {
            pk: 'some-pk',
            sk: 'some-sk',
          },
          UpdateExpression: 'some-update-expression'
        },
      })
    })
  })

})
