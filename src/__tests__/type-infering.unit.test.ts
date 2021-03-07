import { DynamoDB } from 'aws-sdk'
import MockDate from 'mockdate'
import { A, C, F, O } from 'ts-toolbelt'

import { Table, Entity } from '../index'

const omit = <O extends Record<string, unknown>, K extends (keyof O)[]>(
  obj: O,
  ...keys: K
): Omit<O, K[number]> => {
  const resp = { ...obj }
  keys.forEach(key => {
    delete resp[key]
  })
  return resp
}

const DocumentClient = new DynamoDB.DocumentClient()

describe('Entity', () => {
  const mockedDate = '2020-11-22T23:00:00.000Z'
  MockDate.set(mockedDate)

  const TableName = 'tableName'
  const table = new Table({
    name: TableName,
    partitionKey: 'pk',
    sortKey: 'sk',
    DocumentClient
  })

  describe('Entity definition', () => {
    const entityName = 'TestEntity'

    it('should throw if pk is missing', () => {
      expect(() => {
        // Hard to raise error at the moment
        // It would be better to define PK/SK at predictable path
        new Entity({
          name: entityName,
          attributes: { sk: { sortKey: true } },
          table
        } as const)
      }).toThrow()
    })

    it('should throw if entity pk has map property', () => {
      expect(() => {
        // It would be better to define PK at predictable definition path
        // => To raise error on map property instead of all entity def
        // @ts-expect-error
        new Entity({
          name: entityName,
          attributes: { pk: { partitionKey: true, map: 'pk_mapped' } },
          table
        } as const)
      }).toThrow()
    })

    it('should throw if sk has map property', () => {
      expect(() => {
        // It would be better to define SK at predictable definition path
        // => To raise error on map property instead of all entity def
        // @ts-expect-error
        new Entity({
          name: entityName,
          attributes: {
            pk: { partitionKey: true },
            sk: { sortKey: true, map: 'sk_mapped' }
          },
          table
        } as const)
      }).toThrow()
    })

    it('should throw if attribute name is same as alias', () => {
      const ck = {
        pk: { partitionKey: true },
        sk: { sortKey: true }
      } as const

      expect(() => {
        // @ts-expect-error
        new Entity({
          name: entityName,
          attributes: { ...ck, created: 'string' },
          table
        } as const)
      }).toThrow()

      expect(() => {
        // @ts-expect-error
        new Entity({
          name: entityName,
          createdAlias: 'cr',
          attributes: { ...ck, cr: 'string' },
          table
        } as const)
      }).toThrow()

      expect(() => {
        // @ts-expect-error
        new Entity({
          name: entityName,
          attributes: { ...ck, modified: 'string' },
          table
        } as const)
      }).toThrow()

      expect(() => {
        // @ts-expect-error
        new Entity({
          name: entityName,
          modifiedAlias: 'mod',
          attributes: { ...ck, mod: 'string' },
          table
        } as const)
      }).toThrow()

      // 🔨 TOIMPROVE: Not sure this is expected behavior: overriding typeAlias doesn't throw
      // @ts-expect-error
      new Entity({
        name: entityName,
        typeAlias: 'en',
        attributes: { ...ck, en: 'string' },
        table
      } as const)

      // 🔨 TOIMPROVE: Not sure this is expected behavior: overriding typeAlias doesn't throw
      // @ts-expect-error
      new Entity({
        name: entityName,
        typeAlias: 'en',
        attributes: { ...ck, en: 'string' },
        table
      } as const)
    })
  })

  describe('PK only Entity', () => {
    const tableWithoutSK = new Table({
      name: TableName,
      partitionKey: 'pk',
      DocumentClient
    })

    const entityName = 'TestEntity'
    const pk = 'pk'
    const pkMap1 = 'p1'
    const pkMap2 = 'p2'
    const pkMaps = { pkMap1, pkMap2 }

    const ent = new Entity({
      name: entityName,
      attributes: {
        pk: { type: 'string', partitionKey: true, hidden: true },
        pkMap1: ['pk', 0],
        pkMap2: ['pk', 1]
      },
      table: tableWithoutSK
    } as const)

    type ExpectedItem = {
      created: string
      modified: string
      entity: string
      pk: string
      pkMap1: string
      pkMap2: string
    }

    describe('get method', () => {
      it('nominal case', () => {
        ent.getParams({ pk })
        const getPromise = () => ent.get({ pk })
        type GetItem = C.PromiseOf<F.Return<typeof getPromise>>['Item']
        type TestGetItem = A.Equals<GetItem, ExpectedItem | undefined>
        const testGetItem: TestGetItem = 1
        testGetItem
      })

      it('throws when primary key is incomplete', () => {
        // @ts-expect-error
        expect(() => ent.getParams({})).toThrow()
        // @ts-expect-error
        expect(() => ent.getParams({ pkMap1 })).toThrow()
        // @ts-expect-error
        expect(() => ent.getParams({ pkMap2 })).toThrow()
      })

      it('with filters', () => {
        ent.getParams({ pk }, { attributes: ['pk'] })
        const filteredGetPromise = () => ent.get({ pk }, { attributes: ['pk'] })
        type FilteredGetItem = C.PromiseOf<F.Return<typeof filteredGetPromise>>['Item']
        type TestFilteredGetItem = A.Equals<FilteredGetItem, Pick<ExpectedItem, 'pk'> | undefined>
        const testFilteredGetItem: TestFilteredGetItem = 1
        testFilteredGetItem

        // @ts-expect-error
        expect(() => ent.getParams({ pk }, { attributes: ['sk'] })).toThrow()
      })
    })

    describe('delete method', () => {
      it('nominal case', () => {
        const deletePromise1 = () => ent.delete({ pk }, { returnValues: 'ALL_OLD' })
        type DeleteItem1 = C.PromiseOf<F.Return<typeof deletePromise1>>['Attributes']
        type TestDeleteItem1 = A.Equals<DeleteItem1, ExpectedItem | undefined>
        const testDeleteItem1: TestDeleteItem1 = 1
        testDeleteItem1

        const deletePromise2 = () => ent.delete(pkMaps, { returnValues: 'ALL_OLD' })
        type DeleteItem2 = C.PromiseOf<F.Return<typeof deletePromise2>>['Attributes']
        type TestDeleteItem2 = A.Equals<DeleteItem2, ExpectedItem | undefined>
        const testDeleteItem2: TestDeleteItem2 = 1
        testDeleteItem2
      })

      it('throws when primary key is incomplete', () => {
        // @ts-expect-error
        expect(() => ent.deleteParams({})).toThrow()
        // @ts-expect-error
        expect(() => ent.deleteParams({ pkMap1 })).toThrow()
        // @ts-expect-error
        expect(() => ent.deleteParams({ pkMap2 })).toThrow()
      })

      it('with conditions', () => {
        ent.deleteParams({ pk }, { conditions: { attr: 'pk', exists: true } })
        ;() => ent.delete({ pk }, { conditions: { attr: 'pk', exists: true } })

        expect(() =>
          ent.deleteParams(
            { pk },
            // @ts-expect-error
            { conditions: { attr: 'sk', exists: true } }
          )
        ).toThrow()
        // @ts-expect-error
        ;() => ent.delete({ pk }, { conditions: { attr: 'sk', exists: true } })
      })
    })

    describe('put method', () => {
      it('nominal case', () => {
        const item1 = { pk }
        ent.putParams(item1, { returnValues: 'ALL_OLD' })
        const putPromise1 = () => ent.put({ pk }, { returnValues: 'ALL_OLD' })
        type PutItem1 = C.PromiseOf<F.Return<typeof putPromise1>>['Attributes']
        type TestPutItem1 = A.Equals<PutItem1, ExpectedItem | undefined>
        const testPutItem1: TestPutItem1 = 1
        testPutItem1

        const item2 = pkMaps
        ent.putParams(item2, { returnValues: 'ALL_OLD' })
        const putPromise2 = () => ent.put(item2, { returnValues: 'ALL_OLD' })
        type PutItem2 = C.PromiseOf<F.Return<typeof putPromise2>>['Attributes']
        type TestPutItem2 = A.Equals<PutItem2, ExpectedItem | undefined>
        const testPutItem2: TestPutItem2 = 1
        testPutItem2
      })

      it('throws when primary key is incomplete', () => {
        // @ts-expect-error
        expect(() => ent.putParams({})).toThrow()
        // @ts-expect-error
        expect(() => ent.putParams({ pkMap1 })).toThrow()
        // @ts-expect-error
        expect(() => ent.putParams({ pkMap2 })).toThrow()
      })

      it('with conditions', () => {
        ent.putParams({ pk }, { conditions: { attr: 'pk', exists: true } })
        ;() => ent.put({ pk }, { conditions: { attr: 'pk', exists: true } })

        expect(() =>
          // @ts-expect-error
          ent.putParams({ pk }, { conditions: { attr: 'sk', exists: true } })
        ).toThrow()
        // @ts-expect-error
        ;() => ent.put({ pk }, { conditions: { attr: 'sk', exists: true } })
      })
    })

    describe('update method', () => {
      it('nominal case', () => {
        const item1 = { pk }
        ent.updateParams(item1)
        const updatePromise1 = () => ent.update(item1, { returnValues: 'ALL_OLD' })
        type UpdateItem1 = C.PromiseOf<F.Return<typeof updatePromise1>>['Attributes']
        type TestUpdateItem1 = A.Equals<UpdateItem1, ExpectedItem | undefined>
        const testUpdateItem1: TestUpdateItem1 = 1
        testUpdateItem1

        const item2 = pkMaps
        ent.updateParams(item2)
        const updatePromise2 = () => ent.update(item2, { returnValues: 'ALL_NEW' })
        type UpdateItem2 = C.PromiseOf<F.Return<typeof updatePromise2>>['Attributes']
        type TestUpdateItem2 = A.Equals<UpdateItem2, ExpectedItem | undefined>
        const testUpdateItem2: TestUpdateItem2 = 1
        testUpdateItem2
      })

      it('throws when primary key is incomplete', () => {
        // @ts-expect-error
        expect(() => ent.updateParams({})).toThrow()
        // @ts-expect-error
        expect(() => ent.updateParams({ pkMap1 })).toThrow()
        // @ts-expect-error
        expect(() => ent.updateParams({ pkMap2 })).toThrow()
      })
    })

    it('with conditions', () => {
      ent.updateParams({ pk }, { conditions: { attr: 'pk', exists: true } })
      ;() => ent.update({ pk }, { conditions: { attr: 'pk', exists: true } })

      expect(() =>
        // @ts-expect-error
        ent.updateParams({ pk }, { conditions: { attr: 'sk', exists: true } })
      ).toThrow()
      // @ts-expect-error
      ;() => ent.update({ pk }, { conditions: { attr: 'sk', exists: true } })
    })
  })

  describe('PK (mapped) + SK (mapped) Entity', () => {
    const entityName = 'TestEntity'
    const cr = 'cr'
    const mod = 'mod'
    const en = 'en'
    const pk = 'pk'
    const pkMap1 = 'p1'
    const pkMap2 = 'p2'
    const pkMaps = { pkMap1, pkMap2 }
    const sk = 'sk'
    const skMap1 = 's1'
    const skMap2 = 's2'
    const skMaps = { skMap1, skMap2 }
    const ck = { pk, sk }
    const ckMaps = { ...pkMaps, ...skMaps }
    const alwAttr = 'alw'
    const reqAttr = 'req'
    const alwAttrDef = 'alwAttrDef'
    const reqAttrDef = 'reqAttrDef'
    const existAttrs = { alwAttr, reqAttr }
    const existAttrsDef = { alwAttrDef, reqAttrDef }
    const map1 = '1'
    const map2 = '2'
    const map2b = '2b'
    const map3 = '3'
    const map4 = '4'
    const maps = { map1, map2, map3, map4 }

    const ent = new Entity({
      name: entityName,
      createdAlias: cr,
      modifiedAlias: mod,
      typeAlias: en,
      attributes: {
        pk: { type: 'string', partitionKey: true, hidden: true },
        pkMap1: ['pk', 0],
        pkMap2: ['pk', 1],
        sk: { type: 'string', sortKey: true, hidden: true },
        skMap1: ['sk', 0],
        skMap2: ['sk', 1],
        alwAttr: { type: 'string', required: 'always' },
        alwAttrDef: { type: 'string', required: 'always', default: alwAttrDef },
        reqAttr: { type: 'string', required: true },
        reqAttrDef: { type: 'string', required: true, default: reqAttrDef },
        optAttr: 'number',
        map1: ['mapped', 0, { required: true }],
        map2: ['mapped', 1, { required: true, default: '2' }],
        map3: ['mapped', 2, { required: 'always' }],
        map4: ['mapped', 3, { required: 'always', default: '4' }],
        mapped: { type: 'string' }
      },
      table
    } as const)

    type ExpectedItem = {
      cr: string
      mod: string
      en: string
      pk: string
      sk: string
      pkMap1: string
      pkMap2: string
      skMap1: string
      skMap2: string
      alwAttr: string
      reqAttr: string
      alwAttrDef: string
      reqAttrDef: string
      map1: string
      map2: string
      map3: string
      map4: string
      mapped?: string
      optAttr?: number
    }

    describe('get method', () => {
      it('nominal case', () => {
        const ck1 = ck
        ent.getParams(ck1)
        const getPromise1 = () => ent.get(ck1)
        type GetItem1 = C.PromiseOf<F.Return<typeof getPromise1>>['Item']
        type TestGetItem1 = A.Equals<GetItem1, ExpectedItem | undefined>
        const testGetItem1: TestGetItem1 = 1
        testGetItem1

        const ck2 = { ...pkMaps, sk }
        ent.getParams(ck2)
        const getPromise2 = () => ent.get(ck2)
        type GetItem2 = C.PromiseOf<F.Return<typeof getPromise2>>['Item']
        type TestGetItem2 = A.Equals<GetItem2, ExpectedItem | undefined>
        const testGetItem2: TestGetItem2 = 1
        testGetItem2

        const ck3 = { pk, ...skMaps }
        ent.getParams(ck3)
        const getPromise3 = () => ent.get(ck3)
        type GetItem3 = C.PromiseOf<F.Return<typeof getPromise3>>['Item']
        type TestGetItem3 = A.Equals<GetItem3, ExpectedItem | undefined>
        const testGetItem3: TestGetItem3 = 1
        testGetItem3

        const ck4 = ckMaps
        ent.getParams(ck4)
        const getPromise4 = () => ent.get(ck4)
        type GetItem4 = C.PromiseOf<F.Return<typeof getPromise4>>['Item']
        type TestGetItem4 = A.Equals<GetItem4, ExpectedItem | undefined>
        const testGetItem4: TestGetItem4 = 1
        testGetItem4
      })

      it('filtered attributes', () => {
        ent.getParams(ck, {
          attributes: ['pkMap1', 'skMap1', 'reqAttr', 'optAttr']
        })
        const getPromiseFiltFn = () =>
          ent.get(ck, {
            attributes: ['pkMap1', 'skMap1', 'reqAttr', 'optAttr']
          })
        type GetItemFilt = C.PromiseOf<ReturnType<typeof getPromiseFiltFn>>['Item']
        type TestGetItemFilt = A.Equals<
          GetItemFilt,
          Pick<ExpectedItem, 'pkMap1' | 'skMap1' | 'reqAttr' | 'optAttr'> | undefined
        >
        const testGetItemFilt: TestGetItemFilt = 1
        testGetItemFilt

        expect(() =>
          // @ts-expect-error
          ent.getParams(ck, { attributes: ['incorrectAttr'] })
        ).toThrow()
      })

      it('throws when primary key is incomplete', () => {
        // @ts-expect-error: Missing sort key
        expect(() => ent.getParams({ pk })).toThrow()

        // @ts-expect-error: Missing partition key
        expect(() => ent.getParams({ sk })).toThrow()

        // @ts-expect-error: Partition key mapping incomplete
        expect(() => ent.getParams({ pkMap1, sk })).toThrow()

        // @ts-expect-error: Sort key mapping incomplete
        expect(() => ent.getParams({ pk, skMap1 })).toThrow()
      })

      it('throws when a value has incorrect type', () => {
        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error

        ent.getParams({ pk: ['bad', 'type'], sk })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error

        ent.getParams({ pk: { bad: 'type' }, sk })
      })
    })

    describe('delete method', () => {
      it('nominal case', () => {
        const ck1 = ck
        ent.deleteParams(ck1)
        const deletePromise1 = () => ent.delete(ck1)
        type DeleteItem1 = C.PromiseOf<
          F.Return<typeof deletePromise1>
          // @ts-expect-error
        >['Attributes']
        let deleteItem1: DeleteItem1
        deleteItem1

        const ck2 = { pkMap1, pkMap2, sk }
        ent.deleteParams(ck2)
        const deletePromise2 = () => ent.delete(ck2)
        type DeleteItem2 = C.PromiseOf<
          F.Return<typeof deletePromise2>
          // @ts-expect-error
        >['Attributes']
        let deleteItem2: DeleteItem2
        deleteItem2

        const ck3 = { pk, skMap1, skMap2 }
        ent.deleteParams(ck3)
        const deletePromise3 = () => ent.delete(ck3, { returnValues: 'NONE' })
        type DeleteItem3 = C.PromiseOf<
          F.Return<typeof deletePromise3>
          // @ts-expect-error
        >['Attributes']
        let deleteItem3: DeleteItem3
        deleteItem3

        const ck4 = ckMaps
        ent.deleteParams(ck4)
        const deletePromise4 = () => ent.delete(ck4, { returnValues: 'ALL_OLD' })
        type DeleteItem4 = C.PromiseOf<F.Return<typeof deletePromise4>>['Attributes']
        type TestDeleteItem4 = A.Equals<DeleteItem4, ExpectedItem | undefined>
        const testDeleteItem4: TestDeleteItem4 = 1
        testDeleteItem4
      })

      it('throws when primary key is incomplete', () => {
        // @ts-expect-error: Missing sort key
        expect(() => ent.deleteParams({ pk })).toThrow()

        // @ts-expect-error: Missing partition key
        expect(() => ent.deleteParams({ sk })).toThrow()

        expect(() =>
          // @ts-expect-error: Partition key mapping incomplete
          ent.deleteParams({ pkMap1, sk })
        ).toThrow()

        expect(() =>
          // @ts-expect-error: Sort key mapping incomplete
          ent.deleteParams({ pk, skMap1 })
        ).toThrow()
      })

      it('throws when a value has incorrect type', () => {
        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.deleteParams({ pk: ['bad', 'type'], sk })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.deleteParams({ pk: { bad: 'type' }, sk })
      })

      it('with conditions', () => {
        ent.deleteParams(ck, { conditions: { attr: 'pk', exists: true } })
        ;() => ent.delete(ck, { conditions: { attr: 'pk', exists: true } })

        expect(() =>
          ent.deleteParams(
            ck,
            // @ts-expect-error
            { conditions: { attr: 'incorrectAttr', exists: true } }
          )
        ).toThrow()
        ;() =>
          ent.delete(ck, {
            // @ts-expect-error
            conditions: { attr: 'incorrectAttr', exists: true }
          })
      })
    })

    describe('put method', () => {
      it('nominal case', () => {
        const item1 = { ...ck, ...existAttrs, map1, map3 }
        ent.putParams(item1)
        const putPromise1 = () => ent.put(item1)
        // @ts-expect-error
        type PutItem1 = C.PromiseOf<F.Return<typeof putPromise1>>['Attributes']
        let putItem1: PutItem1
        putItem1

        const item2 = { ...ck, ...existAttrs, ...existAttrsDef, map1, map3 }
        ent.putParams(item2)
        const putPromise2 = () => ent.put(item2)
        // @ts-expect-error
        type PutItem2 = C.PromiseOf<F.Return<typeof putPromise2>>['Attributes']
        let putItem2: PutItem2
        putItem2

        const item3 = { ...pkMaps, sk, ...existAttrs, ...maps }
        ent.putParams(item3)
        const putPromise3 = () => ent.put(item3)
        // @ts-expect-error
        type PutItem3 = C.PromiseOf<F.Return<typeof putPromise3>>['Attributes']
        let putItem3: PutItem3
        putItem3

        const item4 = { pk, ...skMaps, ...existAttrs, ...maps }
        ent.putParams(item4)
        const putPromise4 = () => ent.put(item4)
        // @ts-expect-error
        type PutItem4 = C.PromiseOf<F.Return<typeof putPromise4>>['Attributes']
        let putItem4: PutItem4
        putItem4

        const item5 = { ...ckMaps, ...existAttrs, ...maps }
        ent.putParams(item5)
        const putPromise5 = () => ent.put(item5, { returnValues: 'NONE' })
        // @ts-expect-error
        type PutItem5 = C.PromiseOf<F.Return<typeof putPromise5>>['Attributes']
        let putItem5: PutItem5
        putItem5

        const item6 = { ...ck, ...existAttrs, ...maps, map2: map2b }
        ent.putParams(item6)
        const putPromise6 = () => ent.put(item6, { returnValues: 'ALL_OLD' })
        type PutItem6 = C.PromiseOf<F.Return<typeof putPromise6>>['Attributes']
        type TestPutItem6 = A.Equals<PutItem6, ExpectedItem | undefined>
        const testPutItem6: TestPutItem6 = 1
        testPutItem6
      })

      it('throws when primary key is incomplete', () => {
        expect(() =>
          // @ts-expect-error: Missing sort key
          ent.putParams({ pk, ...existAttrs, map1, map3 })
        ).toThrow()

        expect(() =>
          // @ts-expect-error: Missing partition key
          ent.putParams({ sk, ...existAttrs, map1, map3 })
        ).toThrow()

        expect(() =>
          // @ts-expect-error: Partition key mapping incomplete
          ent.putParams({ pkMap1, sk, ...existAttrs, map1, map3 })
        ).toThrow()

        expect(() =>
          // @ts-expect-error: Sort key mapping incomplete
          ent.putParams({ pk, skMap1, ...existAttrs, map1, map3 })
        ).toThrow()
      })

      it('throws when required attributes miss', () => {
        // @ts-expect-error
        expect(() => ent.putParams({ ck, map1, map3 })).toThrow()

        // @ts-expect-error
        expect(() => ent.putParams({ ck, ...existAttrs, map1 })).toThrow()

        // @ts-expect-error
        expect(() => ent.putParams({ ck, ...existAttrs, map3 })).toThrow()
      })

      it('throws when a value has incorrect type', () => {
        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.putParams({ pk: ['bad', 'type'], sk, ...existAttrs, ...maps })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.putParams({ pk: { bad: 'type' }, sk, ...existAttrs, ...maps })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.putParams({ ...ck, alwAttr, reqAttr: ['bad', 'type'], ...maps })
      })

      it('with conditions', () => {
        ent.putParams(
          { ...ck, ...existAttrs, map1, map3 },
          { conditions: { attr: 'pk', exists: true } }
        )
        ;() =>
          ent.put(
            { ...ck, ...existAttrs, map1, map3 },
            { conditions: { attr: 'pk', exists: true } }
          )

        expect(() =>
          ent.putParams(
            { ...ck, ...existAttrs, map1, map3 },
            // @ts-expect-error
            { conditions: { attr: 'incorrectAttr', exists: true } }
          )
        ).toThrow()
        ;() =>
          ent.put(
            { ...ck, ...existAttrs, map1, map3 },
            // @ts-expect-error
            { conditions: { attr: 'incorrectAttr', exists: true } }
          )
      })
    })

    describe('update method', () => {
      const testedParams = { ...ck, alwAttr, map1, map3 }

      it('nominal case', () => {
        const item1 = { ...testedParams, ...maps }
        ent.updateParams(item1)
        const updatePromise1 = () => ent.update(item1)
        type UpdateItem1 = C.PromiseOf<
          ReturnType<typeof updatePromise1>
          // @ts-expect-error
        >['Attributes']
        let updateItem1: UpdateItem1
        updateItem1

        const item2 = { ...testedParams, ...existAttrs, ...existAttrsDef }
        ent.updateParams(item2)
        const updatePromise2 = () => ent.update(item2, { returnValues: 'NONE' })
        type UpdateItem2 = C.PromiseOf<
          ReturnType<typeof updatePromise2>
          // @ts-expect-error
        >['Attributes']
        let updateItem2: UpdateItem2
        updateItem2

        const item3 = { ...omit(testedParams, 'pk'), ...pkMaps }
        ent.updateParams(item3)
        const updatePromise3 = () => ent.update(item3, { returnValues: 'ALL_OLD' })
        type UpdateItem3 = C.PromiseOf<ReturnType<typeof updatePromise3>>['Attributes']
        type TestUpdateItem3 = A.Equals<UpdateItem3, ExpectedItem | undefined>
        const testUpdateItem3: TestUpdateItem3 = 1
        testUpdateItem3

        const item4 = { ...omit(testedParams, 'sk'), ...skMaps }
        ent.updateParams(item4)
        const updatePromise4 = () => ent.update(item4, { returnValues: 'ALL_NEW' })
        type UpdateItem4 = C.PromiseOf<ReturnType<typeof updatePromise4>>['Attributes']
        type TestUpdateItem4 = A.Equals<UpdateItem4, ExpectedItem | undefined>
        const testUpdateItem4: TestUpdateItem4 = 1
        testUpdateItem4

        const item5 = {
          ...omit(testedParams, 'pk', 'sk'),
          ...pkMaps,
          ...skMaps
        }
        ent.updateParams(item5)
        const updatePromise5 = () => ent.update(item5, { returnValues: 'UPDATED_OLD' })
        type UpdateItem5 = C.PromiseOf<ReturnType<typeof updatePromise5>>['Attributes']
        type TestUpdateItem5 = A.Equals<UpdateItem5, ExpectedItem | undefined>
        const testUpdateItem5: TestUpdateItem5 = 1
        testUpdateItem5

        const item6 = { ...testedParams, map2: map2b, map4 }
        ent.updateParams(item6)
        const updatePromise6 = () => ent.update(item6, { returnValues: 'UPDATED_NEW' })
        type UpdateItem6 = C.PromiseOf<ReturnType<typeof updatePromise6>>['Attributes']
        type TestUpdateItem6 = A.Equals<UpdateItem6, ExpectedItem | undefined>
        const testUpdateItem6: TestUpdateItem6 = 1
        testUpdateItem6
      })

      it('attribute deletion nominal case', () => {
        ent.updateParams({ ...testedParams, ...maps, optAttr: null })
        ent.updateParams({
          ...testedParams,
          ...maps,
          $remove: ['optAttr', 'mapped']
        })
      })

      it('throws when primary key is incomplete', () => {
        // @ts-expect-error: Missing partition key
        expect(() => ent.updateParams({ pk, alwAttr, map3 })).toThrow()

        // @ts-expect-error: Missing partition key
        expect(() => ent.updateParams({ sk, alwAttr, map3 })).toThrow()

        expect(() =>
          // @ts-expect-error: Partition key mapping incomplete
          ent.updateParams({ pkMap1, sk, alwAttr, map3 })
        ).toThrow()

        expect(() =>
          // @ts-expect-error: Sort key mapping incomplete
          ent.updateParams({ pk, skMap1, alwAttr, map3 })
        ).toThrow()
      })

      it('throws when always attributes miss', () => {
        // @ts-expect-error
        expect(() => ent.updateParams({ ...ck, alwAttr })).toThrow()

        // @ts-expect-error
        expect(() => ent.updateParams({ ...ck, map3 })).toThrow()
      })

      it('throws when a value has incorrect type', () => {
        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, pk: ['bad', 'type'] })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, pk: { bad: 'type' } })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, alwAttr: ['bad', 'type'] })
      })

      it('throws when trying to delete pk or sk', () => {
        expect(() =>
          // @ts-expect-error
          ent.updateParams({ ...testedParams, pk: null })
        ).toThrow()

        expect(() =>
          // @ts-expect-error
          ent.updateParams({ ...testedParams, $remove: ['pk'] })
        ).toThrow()

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, pkMap1: null, pkMap2 })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, pkMap2, $remove: ['pkMap1'] })

        expect(() =>
          // @ts-expect-error
          ent.updateParams({ ...testedParams, sk: null })
        ).toThrow()

        expect(() =>
          // @ts-expect-error
          ent.updateParams({ ...testedParams, $remove: ['sk'] })
        ).toThrow()

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, skMap1: null, skMap2 })
      })

      it('throws when trying to delete req/always attr', () => {
        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, reqAttr: null })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, $remove: ['reqAttr'] })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, reqAttrDef: null })

        // 🔨 TOIMPROVE: Not sure this should not throw
        // @ts-expect-error
        ent.updateParams({ ...testedParams, reqAttrDef: null })

        expect(() =>
          // @ts-expect-error
          ent.updateParams({ ...testedParams, alwAttr: null })
        ).toThrow()

        // 🔨 TOIMPROVE: Not sure this is expected behavior (alwAttr is both set AND removed)
        // @ts-expect-error
        ent.updateParams({ ...testedParams, $remove: ['alwAttr'] })

        expect(() =>
          // @ts-expect-error
          ent.updateParams({ ...testedParams, alwAttrDef: null })
        ).toThrow()

        // 🔨 TOIMPROVE: Not sure this is expected behavior (alwAttrDef is both set AND removed)
        // @ts-expect-error
        ent.updateParams({ ...testedParams, $remove: ['alwAttrDef'] })
      })

      it('throws with bad returnValues parameter', () => {
        expect(() =>
          ent.updateParams(
            { ...ck, alwAttr, map3 },
            // @ts-expect-error
            { returnValues: 'bogus_option' }
          )
        ).toThrow()
      })

      it('with conditions', () => {
        ent.updateParams(testedParams, {
          conditions: { attr: 'pk', exists: true }
        })
        ;() =>
          ent.update(testedParams, {
            conditions: { attr: 'pk', exists: true }
          })

        expect(() =>
          ent.updateParams(
            testedParams,
            // @ts-expect-error
            { conditions: { attr: 'incorrectAttr', exists: true } }
          )
        ).toThrow()
        ;() =>
          ent.update(
            testedParams,
            // @ts-expect-error
            { conditions: { attr: 'incorrectAttr', exists: true } }
          )
      })
    })
  })

  describe('PK (default) + SK Entity', () => {
    const entityName = 'TestEntity'
    const pk = 'pk'
    const pk2 = 'pk2'
    const sk = 'sk'
    const ck2 = { pk: pk2, sk }

    const ent = new Entity({
      name: entityName,
      attributes: {
        pk: { type: 'string', partitionKey: true, hidden: true, default: pk },
        sk: { type: 'string', sortKey: true, hidden: true }
      },
      table
    } as const)

    type ExpectedItem = {
      created: string
      modified: string
      entity: string
      pk: string
      sk: string
    }

    it('get method', () => {
      const ck1 = { sk }
      ent.getParams(ck1)
      const getPromise1 = () => ent.get(ck1)
      type GetItem1 = C.PromiseOf<F.Return<typeof getPromise1>>['Item']
      type TestGetItem1 = A.Equals<GetItem1, ExpectedItem | undefined>
      const testGetItem1: TestGetItem1 = 1
      testGetItem1

      ent.getParams(ck2)
      const getPromise2 = () => ent.get(ck2)
      type GetItem2 = C.PromiseOf<F.Return<typeof getPromise2>>['Item']
      type TestGetItem2 = A.Equals<GetItem2, ExpectedItem | undefined>
      const testGetItem2: TestGetItem2 = 1
      testGetItem2
    })

    it('delete method', () => {
      ent.deleteParams({ sk })
      ent.deleteParams(ck2)
    })

    it('put method', () => {
      ent.putParams({ sk })
      ent.putParams(ck2)
    })

    it('update method', () => {
      ent.updateParams({ sk })
      ent.updateParams(ck2)
    })
  })

  describe('PK + SK (default) Entity', () => {
    const entityName = 'TestEntity'
    const pk = 'pk'
    const sk = 'sk'
    const sk2 = 'sk2'
    const ck2 = { pk, sk: sk2 }

    const ent = new Entity({
      name: entityName,
      attributes: {
        pk: { type: 'string', partitionKey: true, hidden: true },
        sk: { type: 'string', sortKey: true, hidden: true, default: sk }
      },
      table
    } as const)

    it('get method', () => {
      ent.getParams({ pk })
      ent.getParams(ck2)
    })

    it('delete method', () => {
      ent.deleteParams({ pk })
      ent.deleteParams(ck2)
    })

    it('put method', () => {
      ent.putParams({ pk })
      ent.putParams(ck2)
    })

    it('update method', () => {
      ent.updateParams({ pk })
      ent.updateParams(ck2)
    })
  })

  describe('Overlayed methods', () => {
    const pk = 'pk'
    const sk = 'sk'
    const ck = { pk, sk }
    const pk0 = 'pk0'
    const sk0 = 'sk0'
    const ck0 = { pk0, sk0 }
    const str0 = 'str0'
    const num0 = 42

    type MethodItemOverlay = {
      pk0: string
      sk0: string
      num0: number
      str0?: string
    }
    type MethodCompositeKeyOverlay = { pk0: string; sk0: string }

    const ent = new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { type: 'string', partitionKey: true, hidden: true },
        sk: { type: 'string', sortKey: true, hidden: true, default: sk }
      },
      table
    } as const)

    describe('get method', () => {
      describe('MethodItemOverlay', () => {
        it('composite key should match infered composite key', () => {
          ;() => ent.get<MethodItemOverlay>(ck)
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay>(ck0)
        })

        it('filtered attribute should match MethodItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay>(ck, { attributes: ['pk'] })
          ;() => ent.get<MethodItemOverlay>(ck, { attributes: ['pk0'] })
        })

        it('returned Item should match MethodItemOverlay, even filtered', () => {
          const getPromise = () => ent.get<MethodItemOverlay>(ck)
          type GetItem = C.PromiseOf<F.Return<typeof getPromise>>['Item']
          type TestGetItem = A.Equals<GetItem, MethodItemOverlay | undefined>
          const testGetItem: TestGetItem = 1
          testGetItem

          const filteredGetPromise = () =>
            ent.get<Pick<MethodItemOverlay, 'pk0' | 'sk0' | 'str0'>>(ck, {
              attributes: ['pk0', 'sk0', 'str0']
            })
          type FilteredGetItem = C.PromiseOf<F.Return<typeof filteredGetPromise>>['Item']
          type TestFilteredGetItem = A.Equals<
            FilteredGetItem,
            Pick<MethodItemOverlay, 'pk0' | 'sk0' | 'str0'> | undefined
          >
          const testFilteredGetItem: TestFilteredGetItem = 1
          testFilteredGetItem
        })
      })

      describe('MethodItemOverlay + MethodCompositeKeyOverlay', () => {
        it('composite key should match MethodCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck)
          ;() => ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0)
        })

        it('filtered attribute should (still) match MethodItemOverlay', () => {
          ;() =>
            ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0, {
              // @ts-expect-error
              attributes: ['pk']
            })
          ;() =>
            ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0, {
              attributes: ['pk0']
            })
        })

        it('returned Item should match MethodItemOverlay, even filtered', () => {
          const getPromise = () => ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0)
          type GetItem = C.PromiseOf<F.Return<typeof getPromise>>['Item']
          type TestGetItem = A.Equals<GetItem, MethodItemOverlay | undefined>
          const testGetItem: TestGetItem = 1
          testGetItem

          const filteredGetPromise = () =>
            ent.get<Pick<MethodItemOverlay, 'pk0' | 'sk0' | 'str0'>, MethodCompositeKeyOverlay>(
              ck0,
              { attributes: ['pk0', 'sk0', 'str0'] }
            )
          type FilteredGetItem = C.PromiseOf<F.Return<typeof filteredGetPromise>>['Item']
          type TestFilteredGetItem = A.Equals<
            FilteredGetItem,
            Pick<MethodItemOverlay, 'pk0' | 'sk0' | 'str0'> | undefined
          >
          const testFilteredGetItem: TestFilteredGetItem = 1
          testFilteredGetItem
        })
      })
    })

    describe('delete method', () => {
      describe('MethodItemOverlay', () => {
        it('composite key should match infered composite key', () => {
          ;() => ent.delete<MethodItemOverlay>(ck)
          // @ts-expect-error
          ;() => ent.delete<MethodItemOverlay>(ck0)
        })

        it('condition attributes should match MethodItemOverlay', () => {
          ;() =>
            ent.delete<MethodItemOverlay>(ck, {
              // @ts-expect-error
              conditions: { attr: 'pk', exists: true }
            })
          ;() =>
            ent.delete<MethodItemOverlay>(ck, {
              conditions: { attr: 'pk0', exists: true }
            })
        })

        it('Attributes match MethodItemOverlay', () => {
          const deletePromise = () => ent.delete<MethodItemOverlay>(ck)
          type DeleteItem = C.PromiseOf<F.Return<typeof deletePromise>>['Attributes']
          type TestDeleteItem = A.Equals<DeleteItem, MethodItemOverlay | undefined>
          const testDeleteItem: TestDeleteItem = 1
          testDeleteItem
        })
      })

      describe('MethodItemOverlay + MethodCompositeKeyOverlay', () => {
        it('composite key should match MethodCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck)
          ;() => ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0)
        })

        it('condition attributes should (still) match MethodItemOverlay', () => {
          ;() =>
            ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0, {
              // @ts-expect-error
              conditions: { attr: 'pk', exists: true }
            })
          ;() =>
            ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0, {
              conditions: { attr: 'pk0', exists: true }
            })
        })

        it('returned Attributes should match MethodItemOverlay', () => {
          const deletePromise = () => ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0)
          type DeleteItem = C.PromiseOf<F.Return<typeof deletePromise>>['Attributes']
          type TestDeleteItem = A.Equals<DeleteItem, MethodItemOverlay | undefined>
          const testDeleteItem: TestDeleteItem = 1
          testDeleteItem
        })
      })
    })

    describe('put method', () => {
      it('Item should match MethodItemOverlay', () => {
        // @ts-expect-error
        ;() => ent.put<MethodItemOverlay>(ck)
        ;() => ent.put<MethodItemOverlay>({ ...ck0, num0, str0 })
      })

      it('condition attributes should match MethodItemOverlay', () => {
        ;() =>
          ent.put<MethodItemOverlay>(
            { ...ck0, num0 },
            // @ts-expect-error
            { conditions: { attr: 'pk', exists: true } }
          )
        ;() =>
          ent.put<MethodItemOverlay>(
            { ...ck0, num0 },
            { conditions: { attr: 'pk0', exists: true } }
          )
      })

      it('Attributes match MethodItemOverlay', () => {
        const putPromise = () => ent.put<MethodItemOverlay>({ ...ck0, num0 })
        type PutItem = C.PromiseOf<F.Return<typeof putPromise>>['Attributes']
        type TestPutItem = A.Equals<PutItem, MethodItemOverlay | undefined>
        const testPutItem: TestPutItem = 1
        testPutItem
      })
    })

    describe('update method', () => {
      it('item should match MethodItemOverlay', () => {
        // @ts-expect-error
        ;() => ent.update<MethodItemOverlay>(ck)
        ;() => ent.update<MethodItemOverlay>({ ...ck0, num0 })
      })

      it('condition attributes should match MethodItemOverlay', () => {
        ;() =>
          ent.update<MethodItemOverlay>(
            { ...ck0, num0 },
            // @ts-expect-error
            { conditions: { attr: 'pk', exists: true } }
          )
        ;() =>
          ent.update<MethodItemOverlay>(
            { ...ck0, num0 },
            { conditions: { attr: 'pk0', exists: true } }
          )
      })

      it('Attributes match MethodItemOverlay, whatever the returnValues option is', () => {
        const updatePromise = () => ent.update<MethodItemOverlay>({ ...ck0, num0 })
        type UpdateItem = C.PromiseOf<F.Return<typeof updatePromise>>['Attributes']
        type TestUpdateItem = A.Equals<UpdateItem, MethodItemOverlay | undefined>
        const testUpdateItem: TestUpdateItem = 1
        testUpdateItem
      })
    })

    describe('query method', () => {
      it('condition attributes should match MethodItemOverlay', () => {
        // @ts-expect-error
        ;() => ent.query<MethodItemOverlay>('pk', { attributes: ['pk'] })
        ;() => ent.query<MethodItemOverlay>('pk', { attributes: ['pk0'] })
      })

      it('returned Items should match MethodItemOverlay', () => {
        const queryPromise = () => ent.query<MethodItemOverlay>('pk')
        type QueryItem = C.PromiseOf<F.Return<typeof queryPromise>>['Items']
        type TestQueryItem = A.Equals<QueryItem, MethodItemOverlay[] | undefined>
        const testQueryItem: TestQueryItem = 1
        testQueryItem
      })
    })
  })

  describe('Overlayed entity', () => {
    const pk = 'pk'
    const sk = 'sk'
    const ck = { pk, sk }
    const pk0 = 'pk0'
    const sk0 = 'sk0'
    const ck0 = { pk0, sk0 }
    const str0 = 'str0'
    const num0 = 42
    const pk1 = 'pk1'
    const sk1 = 'sk1'
    const ck1 = { pk1, sk1 }
    const str1 = 'str1'
    const num1 = 43

    type EntityItemOverlay = {
      pk0: string
      sk0: string
      num0: number
      str0?: string
    }
    type EntityCompositeKeyOverlay = { pk0: string; sk0: string }

    const ent = new Entity<EntityItemOverlay, EntityCompositeKeyOverlay, typeof table>({
      name: 'TestEntity',
      attributes: {
        pk: { type: 'string', partitionKey: true, hidden: true },
        sk: { type: 'string', sortKey: true, hidden: true, default: sk }
      },
      table
    } as const)

    type MethodItemOverlay = {
      pk1: string
      sk1: string
      num1: number
      str1?: string
    }
    type MethodCompositeKeyOverlay = { pk1: string; sk1: string }

    describe('get method', () => {
      describe('EntityOverlay only', () => {
        it('composite key should match EntityCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.get(ck)
          ;() => ent.get(ck0)
        })

        it('filtered attribute should match EntityItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.get(ck0, { attributes: ['pk'] })
          ;() => ent.get(ck0, { attributes: ['pk0'] })
        })

        it('returned Item should match EntityItemOverlay, even filtered', () => {
          const getPromise = () => ent.get(ck0)
          type GetItem = C.PromiseOf<F.Return<typeof getPromise>>['Item']
          type TestGetItem = A.Equals<GetItem, EntityItemOverlay | undefined>
          const testGetItem: TestGetItem = 1
          testGetItem

          const filteredGetPromise = () => ent.get(ck0, { attributes: ['pk0', 'sk0', 'str0'] })
          type FilteredGetItem = C.PromiseOf<F.Return<typeof filteredGetPromise>>['Item']
          type TestFilteredGetItem = A.Equals<
            FilteredGetItem,
            O.Pick<EntityItemOverlay, 'pk0' | 'sk0' | 'str0'> | undefined
          >
          const testFilteredGetItem: TestFilteredGetItem = 1
          testFilteredGetItem
        })
      })

      describe('MethodItemOverlay + EntityCompositeKeyOverlay', () => {
        it('composite key should (still) match EntityCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay>(ck)
          ;() => ent.get<MethodItemOverlay>(ck0)
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay>(ck1)
        })

        it('filtered attribute should match MethodItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay>(ck0, { attributes: ['pk'] })
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay>(ck0, { attributes: ['pk0'] })
          ;() => ent.get<MethodItemOverlay>(ck0, { attributes: ['pk1'] })
        })

        it('returned Item should match MethodItemOverlay', () => {
          const getPromise = () => ent.get<MethodItemOverlay>(ck0)
          type GetItem = C.PromiseOf<F.Return<typeof getPromise>>['Item']
          type TestGetItem = A.Equals<GetItem, MethodItemOverlay | undefined>
          const testGetItem: TestGetItem = 1
          testGetItem
        })
      })

      describe('Method Overlay only', () => {
        it('composite key should match MethodCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck)
          // @ts-expect-error
          ;() => ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0)
          ;() => ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1)
        })

        it('filtered attribute should (still) match MethodItemOverlay', () => {
          ;() =>
            ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1, {
              // @ts-expect-error
              attributes: ['pk']
            })
          ;() =>
            ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1, {
              // @ts-expect-error
              attributes: ['pk0']
            })
          ;() =>
            ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1, {
              attributes: ['pk1']
            })
        })

        it('returned Item should match MethodItemOverlay', () => {
          const getPromise = () => ent.get<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1)
          type GetItem = C.PromiseOf<F.Return<typeof getPromise>>['Item']
          type TestGetItem = A.Equals<GetItem, MethodItemOverlay | undefined>
          const testGetItem: TestGetItem = 1
          testGetItem
        })
      })
    })

    describe('delete method', () => {
      describe('EntityOverlay only', () => {
        it('composite key should match EntityCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.delete(ck)
          ;() => ent.delete(ck0)
          // @ts-expect-error
          ;() => ent.delete<MethodItemOverlay>(ck1)
        })

        it('condition attributes should match EntityItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.delete(ck0, { conditions: { attr: 'pk', exists: true } })
          ;() => ent.delete(ck0, { conditions: { attr: 'pk0', exists: true } })
        })

        it('Attributes misses from return type if no or none returnValue option is provided', () => {
          const deletePromiseNone1 = () => ent.delete(ck0)
          type DeleteItemNone1 = C.PromiseOf<
            F.Return<typeof deletePromiseNone1>
            // @ts-expect-error
          >['Attributes']
          let deleteItemNone1: DeleteItemNone1
          deleteItemNone1

          const deletePromiseNone2 = () => ent.delete(ck0, { returnValues: 'NONE' })
          type DeleteItemNone2 = C.PromiseOf<
            F.Return<typeof deletePromiseNone2>
            // @ts-expect-error
          >['Attributes']
          let deleteItemNone2: DeleteItemNone2
          deleteItemNone2
        })

        it('Attributes match EntityItemOverlay if ALL_OLD option is provided', () => {
          const deletePromise = () => ent.delete(ck0, { returnValues: 'ALL_OLD' })
          type DeleteItem = C.PromiseOf<F.Return<typeof deletePromise>>['Attributes']
          type TestDeleteItem = A.Equals<DeleteItem, EntityItemOverlay | undefined>
          const testDeleteItem: TestDeleteItem = 1
          testDeleteItem
        })
      })

      describe('MethodItemOverlay + EntityCompositeKeyOverlay', () => {
        it('composite key should (still) match EntityCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.delete<MethodItemOverlay>(ck)
          ;() => ent.delete<MethodItemOverlay>(ck0)
          // @ts-expect-error
          ;() => ent.delete<MethodItemOverlay>(ck1)
        })

        it('condition attributes should match MethodItemOverlay', () => {
          ;() =>
            ent.delete<MethodItemOverlay>(ck0, {
              // @ts-expect-error
              conditions: { attr: 'pk', exists: true }
            })
          ;() =>
            ent.delete<MethodItemOverlay>(ck0, {
              // @ts-expect-error
              conditions: { attr: 'pk0', exists: true }
            })
          ;() =>
            ent.delete<MethodItemOverlay>(ck0, {
              conditions: { attr: 'pk1', exists: true }
            })
        })

        it('Returned Attributes should match MethodItemOverlay', () => {
          const deletePromise = () => ent.delete<MethodItemOverlay>(ck0)
          type DeleteItem = C.PromiseOf<F.Return<typeof deletePromise>>['Attributes']
          type TestDeleteItem = A.Equals<DeleteItem, MethodItemOverlay | undefined>
          const testDeleteItem: TestDeleteItem = 1
          testDeleteItem
        })
      })

      describe('Method Overlay only', () => {
        it('composite key should match MethodCompositeKeyOverlay', () => {
          // @ts-expect-error
          ;() => ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck)
          // @ts-expect-error
          ;() => ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck0)
          ;() => ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1)
        })

        it('condition attributes should (still) match MethodItemOverlay', () => {
          ;() =>
            ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1, {
              // @ts-expect-error
              conditions: { attr: 'pk', exists: true }
            })
          ;() =>
            ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1, {
              // @ts-expect-error
              conditions: { attr: 'pk0', exists: true }
            })
          ;() =>
            ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1, {
              conditions: { attr: 'pk1', exists: true }
            })
        })

        it('Returned Attributes should match MethodItemOverlay', () => {
          const deletePromise = () => ent.delete<MethodItemOverlay, MethodCompositeKeyOverlay>(ck1)
          type DeleteItem = C.PromiseOf<F.Return<typeof deletePromise>>['Attributes']
          type TestDeleteItem = A.Equals<DeleteItem, MethodItemOverlay | undefined>
          const testDeleteItem: TestDeleteItem = 1
          testDeleteItem
        })
      })
    })

    describe('put method', () => {
      describe('EntityItemOverlay', () => {
        it('Item should match EntityItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.put(ck)
          // @ts-expect-error
          ;() => ent.put(ck0)
          ;() => ent.put({ ...ck0, num0 })
          ;() => ent.put({ ...ck0, num0, str0 })
        })

        it('condition attributes should match EntityItemOverlay', () => {
          ;() =>
            ent.put(
              { ...ck0, num0 },
              // @ts-expect-error
              { conditions: { attr: 'pk', exists: true } }
            )
          ;() => ent.put({ ...ck0, num0 }, { conditions: { attr: 'pk0', exists: true } })
        })

        it('Attributes misses from return type if no or none returnValue option is provided', () => {
          const putPromiseNone1 = () => ent.put({ ...ck0, num0 })
          type PutItemNone1 = C.PromiseOf<
            F.Return<typeof putPromiseNone1>
            // @ts-expect-error
          >['Attributes']
          let putItemNone1: PutItemNone1
          putItemNone1

          const putPromiseNone2 = () => ent.put({ ...ck0, num0 }, { returnValues: 'NONE' })
          type PutItemNone2 = C.PromiseOf<
            F.Return<typeof putPromiseNone2>
            // @ts-expect-error
          >['Attributes']
          let putItemNone2: PutItemNone2
          putItemNone2
        })

        it('Attributes match EntityItemOverlay if ALL_OLD option is provided', () => {
          const putPromise = () => ent.put({ ...ck0, num0 }, { returnValues: 'ALL_OLD' })
          type PutItem = C.PromiseOf<F.Return<typeof putPromise>>['Attributes']
          type TestPutItem = A.Equals<PutItem, EntityItemOverlay | undefined>
          const testPutItem: TestPutItem = 1
          testPutItem
        })
      })

      describe('MethodItemOverlay', () => {
        it('Item should match MethodItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.put<MethodItemOverlay>(ck)
          // @ts-expect-error
          ;() => ent.put<MethodItemOverlay>({ ...ck0, num0 })
          ;() => ent.put<MethodItemOverlay>({ ...ck1, num1 })
          ;() => ent.put<MethodItemOverlay>({ ...ck1, num1, str1 })
        })

        it('condition attributes should match MethodItemOverlay', () => {
          ;() =>
            ent.put<MethodItemOverlay>(
              { ...ck1, num1 },
              // @ts-expect-error
              { conditions: { attr: 'pk', exists: true } }
            )
          ;() =>
            ent.put<MethodItemOverlay>(
              { ...ck1, num1 },
              // @ts-expect-error
              { conditions: { attr: 'pk0', exists: true } }
            )
          ;() =>
            ent.put<MethodItemOverlay>(
              { ...ck1, num1 },
              { conditions: { attr: 'pk1', exists: true } }
            )
        })

        it('Attributes match MethodItemOverlay', () => {
          const putOPromise = () => ent.put<MethodItemOverlay>({ ...ck1, num1 })
          type PutOItem = C.PromiseOf<F.Return<typeof putOPromise>>['Attributes']
          type TestPutOItem = A.Equals<PutOItem, MethodItemOverlay | undefined>
          const testPutOItem: TestPutOItem = 1
          testPutOItem
        })
      })
    })

    describe('update method', () => {
      describe('EntityOverlay only', () => {
        it('item should match EntityItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.update(ck)
          ;() => ent.update({ ...ck0, num0 })
        })

        it('condition attributes should match EntityItemOverlay', () => {
          ;() =>
            ent.update(
              { ...ck0, num0 },
              // @ts-expect-error
              { conditions: { attr: 'pk', exists: true } }
            )
          ;() => ent.update({ ...ck0, num0 }, { conditions: { attr: 'pk0', exists: true } })
        })

        it('Attributes misses from return type if no or none returnValue option is provided', () => {
          const none1UpdatePromise = () => ent.update({ ...ck0, num0 })
          type None1UpdateAttributes = C.PromiseOf<
            F.Return<typeof none1UpdatePromise>
            // @ts-expect-error
          >['Attributes']
          let none1UpdateAttributes: None1UpdateAttributes
          none1UpdateAttributes

          const none2UpdatePromise = () => ent.update({ ...ck0, num0 }, { returnValues: 'NONE' })
          type None2UpdateAttributes = C.PromiseOf<
            F.Return<typeof none2UpdatePromise>
            // @ts-expect-error
          >['Attributes']
          let none2UpdateAttributes: None2UpdateAttributes
          none2UpdateAttributes
        })

        it('Attributes match EntityItemOverlay if UPDATED_OLD, UPDATED_NEW, ALL_OLD & ALL_NEW option is provided', () => {
          const updatedOldUpdatePromise = () =>
            ent.update({ ...ck0, num0 }, { returnValues: 'UPDATED_OLD' })
          type UpdatedOldUpdateAttributes = C.PromiseOf<
            F.Return<typeof updatedOldUpdatePromise>
          >['Attributes']
          type AssertUpdatedOldUpdateAttributes = A.Equals<
            UpdatedOldUpdateAttributes,
            EntityItemOverlay | undefined
          >
          const assertUpdatedOldUpdateAttributes: AssertUpdatedOldUpdateAttributes = 1
          assertUpdatedOldUpdateAttributes

          const updatedNewUpdatePromise = () =>
            ent.update({ ...ck0, num0 }, { returnValues: 'UPDATED_NEW' })
          type UpdatedNewUpdateAttributes = C.PromiseOf<
            F.Return<typeof updatedNewUpdatePromise>
          >['Attributes']
          type AssertUpdatedNewUpdateAttributes = A.Equals<
            UpdatedNewUpdateAttributes,
            EntityItemOverlay | undefined
          >
          const assertUpdatedNewUpdateAttributes: AssertUpdatedNewUpdateAttributes = 1
          assertUpdatedNewUpdateAttributes

          const allOldUpdatePromise = () =>
            ent.update({ ...ck0, num0 }, { returnValues: 'ALL_OLD' })
          type AllOldUpdateAttributes = C.PromiseOf<
            F.Return<typeof allOldUpdatePromise>
          >['Attributes']
          type AssertAllOldUpdateAttributes = A.Equals<
            AllOldUpdateAttributes,
            EntityItemOverlay | undefined
          >
          const assertAllOldUpdateAttributes: AssertAllOldUpdateAttributes = 1
          assertAllOldUpdateAttributes

          const allNewUpdatePromise = () =>
            ent.update({ ...ck0, num0 }, { returnValues: 'ALL_NEW' })
          type AllNewUpdateAttributes = C.PromiseOf<
            F.Return<typeof allNewUpdatePromise>
          >['Attributes']
          type AssertAllNewUpdateAttributes = A.Equals<
            AllNewUpdateAttributes,
            EntityItemOverlay | undefined
          >
          const assertAllNewUpdateAttributes: AssertAllNewUpdateAttributes = 1
          assertAllNewUpdateAttributes
        })
      })

      describe('MethodOverlay', () => {
        it('item should match MethodItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.update<MethodItemOverlay>(ck)
          // @ts-expect-error
          ;() => ent.update<MethodItemOverlay>({ ...ck0, num0 })
          // @ts-expect-error
          ;() => ent.update<MethodItemOverlay>(ck1)
          ;() => ent.update<MethodItemOverlay>({ ...ck1, num1 })
        })

        it('condition attributes should match MethodItemOverlay', () => {
          ;() =>
            ent.update<MethodItemOverlay>(
              { ...ck1, num1 },
              // @ts-expect-error
              { conditions: { attr: 'pk', exists: true } }
            )
          ;() =>
            ent.update<MethodItemOverlay>(
              { ...ck1, num1 },
              // @ts-expect-error
              { conditions: { attr: 'pk0', exists: true } }
            )
          ;() =>
            ent.update<MethodItemOverlay>(
              { ...ck1, num1 },
              { conditions: { attr: 'pk1', exists: true } }
            )
        })

        it('Attributes match MethodItemOverlay, whatever the returnValues option is', () => {
          const updateO1Promise = () => ent.update<MethodItemOverlay>({ ...ck1, num1 })
          type UpdateO1Item = C.PromiseOf<F.Return<typeof updateO1Promise>>['Attributes']
          type TestUpdateO1Item = A.Equals<UpdateO1Item, MethodItemOverlay | undefined>
          const testUpdateO1Item: TestUpdateO1Item = 1
          testUpdateO1Item
        })
      })
    })

    describe('query method', () => {
      describe('EntityOverlay only', () => {
        it('condition attributes should match EntityItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.query('pk', { attributes: ['pk'] })
          ;() => ent.query('pk', { attributes: ['pk0'] })
        })

        it('returned Items should match EntityItemOverlay, even filtered', () => {
          const queryPromise = () => ent.query('pk')
          type QueryItem = C.PromiseOf<F.Return<typeof queryPromise>>['Items']
          type TestQueryItem = A.Equals<QueryItem, EntityItemOverlay[] | undefined>
          const testQueryItem: TestQueryItem = 1
          testQueryItem

          const filteredQueryPromise = () => ent.query('pk', { attributes: ['pk0', 'sk0', 'str0'] })
          type FilteredQueryItem = C.PromiseOf<F.Return<typeof filteredQueryPromise>>['Items']
          type TestFilteredQueryItem = A.Equals<
            FilteredQueryItem,
            Pick<EntityItemOverlay, 'pk0' | 'sk0' | 'str0'>[] | undefined
          >
          const testFilteredQueryItem: TestFilteredQueryItem = 1
          testFilteredQueryItem
        })
      })

      describe('MethodOverlay', () => {
        it('condition attributes should match MethodItemOverlay', () => {
          // @ts-expect-error
          ;() => ent.query<MethodItemOverlay>('pk', { attributes: ['pk'] })
          // @ts-expect-error
          ;() => ent.query<MethodItemOverlay>('pk', { attributes: ['pk0'] })
          ;() => ent.query<MethodItemOverlay>('pk', { attributes: ['pk1'] })
        })

        it('returned Items should match MethodItemOverlay', () => {
          const queryPromise = () => ent.query<MethodItemOverlay>('pk')
          type QueryItem = C.PromiseOf<F.Return<typeof queryPromise>>['Items']
          type TestQueryItem = A.Equals<QueryItem, MethodItemOverlay[] | undefined>
          const testQueryItem: TestQueryItem = 1
          testQueryItem
        })
      })
    })
  })
})
