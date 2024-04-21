import { Table, Entity } from '../index.js';
import { DocumentClient } from './bootstrap.test.js';
const omit = (obj, ...keys) => {
    const resp = { ...obj };
    keys.forEach(key => {
        delete resp[key];
    });
    return resp;
};
describe('Entity', () => {
    const TableName = 'tableName';
    const table = new Table({
        name: TableName,
        partitionKey: 'pk',
        sortKey: 'sk',
        DocumentClient
    });
    describe('Entity definition', () => {
        const entityName = 'TestEntity';
        it('should throw if pk is missing', () => {
            expect(() => {
                // Hard to raise error at the moment
                // It would be better to define PK/SK at predictable path
                new Entity({
                    name: entityName,
                    attributes: { sk: { sortKey: true } },
                    table
                });
            }).toThrow();
        });
        it('should throw if entity pk has map property', () => {
            expect(() => {
                // It would be better to define PK at predictable definition path
                // => To raise error on map property instead of all entity def
                // @ts-expect-error
                new Entity({
                    name: entityName,
                    attributes: { pk: { partitionKey: true, map: 'pk_mapped' } },
                    table
                });
            }).toThrow();
        });
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
                });
            }).toThrow();
        });
        it('should throw if attribute name is same as alias', () => {
            const ck = {
                pk: { partitionKey: true },
                sk: { sortKey: true }
            };
            expect(() => {
                // 🔨 TOIMPROVE: we could raise error here by preventing Aliases from attributes keys but it wreaks havoc with Readonly / Writable
                // @ts-NOT-expect-error
                new Entity({
                    name: entityName,
                    attributes: { ...ck, created: 'string' },
                    table
                });
            }).toThrow();
            expect(() => {
                // 🔨 TOIMPROVE: we could raise error here by preventing Aliases from attributes keys but it wreaks havoc with Readonly / Writable
                // @ts-NOT-expect-error
                new Entity({
                    name: entityName,
                    createdAlias: 'cr',
                    attributes: { ...ck, cr: 'string' },
                    table
                });
            }).toThrow();
            expect(() => {
                // 🔨 TOIMPROVE: we could raise error here by preventing Aliases from attributes keys but it wreaks havoc with Readonly / Writable
                // @ts-NOT-expect-error
                new Entity({
                    name: entityName,
                    attributes: { ...ck, modified: 'string' },
                    table
                });
            }).toThrow();
            expect(() => {
                // 🔨 TOIMPROVE: we could raise error here by preventing Aliases from attributes keys but it wreaks havoc with Readonly / Writable
                // @ts-NOT-expect-error
                new Entity({
                    name: entityName,
                    modifiedAlias: 'mod',
                    attributes: { ...ck, mod: 'string' },
                    table
                });
            }).toThrow();
            // @ts-NOT-expect-error
            expect(() => new Entity({
                name: entityName,
                typeAlias: 'en',
                attributes: { ...ck, en: 'string' },
                table
            })).toThrow();
            // 🔨 TOIMPROVE: Not sure this is expected behavior: overriding typeAlias doesn't throw
            // 🔨 TOIMPROVE: we could raise error here by preventing Aliases from attributes keys but it wreaks havoc with Readonly / Writable
            // @ts-NOT-expect-error
            expect(() => new Entity({
                name: entityName,
                typeAlias: 'en',
                attributes: { ...ck, en: 'string' },
                table
            })).toThrow();
        });
    });
    describe('PK only Entity', () => {
        const tableWithoutSK = new Table({
            name: TableName,
            partitionKey: 'pk',
            DocumentClient
        });
        const pk = 'pk';
        const pkMap1 = 'p1';
        const pkMap2 = 'p2';
        const pkMaps = { pkMap1, pkMap2 };
        const ent = new Entity({
            name: 'TestEntity_PKOnly',
            attributes: {
                pk: { type: 'string', partitionKey: true },
                pkMap1: ['pk', 0],
                pkMap2: ['pk', 1],
                hidden: { type: 'string', hidden: true }
            },
            table: tableWithoutSK
        });
        const testExtends = 1;
        testExtends;
        const entNoExecute = new Entity({
            name: 'TestEntity_PKOnly_NoExecute',
            autoExecute: false,
            attributes: {
                pk: { type: 'string', partitionKey: true },
                pkMap1: ['pk', 0],
                pkMap2: ['pk', 1]
            },
            table: tableWithoutSK
        });
        const entNoParse = new Entity({
            name: 'TestEntity_PKOnly_NoParse',
            autoParse: false,
            attributes: {
                pk: { type: 'string', partitionKey: true },
                pkMap1: ['pk', 0],
                pkMap2: ['pk', 1]
            },
            table: tableWithoutSK
        });
        const entNoTimestamps = new Entity({
            name: 'TestEntity_PKOnly_NoTimestamps',
            timestamps: false,
            attributes: {
                pk: { type: 'string', partitionKey: true },
                pkMap1: ['pk', 0],
                pkMap2: ['pk', 1]
            },
            table: tableWithoutSK
        });
        describe('get method', () => {
            it('nominal case', () => {
                ent.getParams({ pk });
                const getPromise = () => ent.get({ pk });
                const testGetItem = 1;
                testGetItem;
                const testGetItemOptions = 1;
                testGetItemOptions;
                const testItem = 1;
                testItem;
            });
            it('no auto-execution', () => {
                const item = { pk };
                const getPromise = () => entNoExecute.get(item);
                const testGetParams = 1;
                testGetParams;
            });
            it('force execution', () => {
                const item = { pk };
                const getPromise = () => entNoExecute.get(item, { execute: true });
                const testGetItem = 1;
                testGetItem;
            });
            it('force no execution', () => {
                const item = { pk };
                const getPromise = () => ent.get(item, { execute: false });
                const testGetParams = 1;
                testGetParams;
            });
            it('no auto-parsing', () => {
                const item = { pk };
                const getPromise = () => entNoParse.get(item);
                const testGetRawResponse = 1;
                testGetRawResponse;
            });
            it('force parsing', () => {
                const item = { pk };
                const getPromise = () => entNoParse.get(item, { parse: true });
                const testGetItem = 1;
                testGetItem;
            });
            it('force no parsing', () => {
                const item = { pk };
                const getPromise = () => ent.get(item, { parse: false });
                const testGetRawResponse = 1;
                testGetRawResponse;
            });
            it('contains no timestamp', () => {
                const item = { pk };
                const getPromise = () => entNoTimestamps.get(item);
                const testGetResponse = 1;
                testGetResponse;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error
                expect(() => ent.getParams({})).toThrow();
                // @ts-expect-error
                expect(() => ent.getParams({ pkMap1 })).toThrow();
                // @ts-expect-error
                expect(() => ent.getParams({ pkMap2 })).toThrow();
            });
            it('with filters', () => {
                ent.getParams({ pk }, { attributes: ['pk'] });
                const filteredGetPromise = () => ent.get({ pk }, { attributes: ['pk'] });
                const testFilteredGetItem = 1;
                testFilteredGetItem;
                // @ts-expect-error
                expect(() => ent.getParams({ pk }, { attributes: ['sk'] })).toThrow();
            });
        });
        describe('delete method', () => {
            it('nominal case', () => {
                const deletePromise1 = () => ent.delete({ pk }, { returnValues: 'ALL_OLD' });
                const testDeleteItem1 = 1;
                testDeleteItem1;
                const deletePromise2 = () => ent.delete(pkMaps, { returnValues: 'ALL_OLD' });
                const testDeleteItem2 = 1;
                testDeleteItem2;
                const testDeleteItemOptions = 1;
                testDeleteItemOptions;
            });
            it('no auto-execution', () => {
                const item = { pk };
                const deletePromise = () => entNoExecute.delete(item);
                const testDeleteParams = 1;
                testDeleteParams;
            });
            it('force execution', () => {
                const item = { pk };
                const deletePromise = () => entNoExecute.delete(item, { execute: true, returnValues: 'ALL_OLD' });
                const testDeleteItem = 1;
                testDeleteItem;
            });
            it('force no execution', () => {
                const item = { pk };
                const deletePromise = () => ent.delete(item, { execute: false });
                const testDeleteParams = 1;
                testDeleteParams;
            });
            it('no auto-parsing', () => {
                const item = { pk };
                const deletePromise = () => entNoParse.delete(item);
                const testDeleteRawResponse = 1;
                testDeleteRawResponse;
            });
            it('force parsing', () => {
                const item = { pk };
                const deletePromise = () => entNoParse.delete(item, { parse: true, returnValues: 'ALL_OLD' });
                const testDeleteItem = 1;
                testDeleteItem;
            });
            it('force no parsing', () => {
                const item = { pk };
                const deletePromise = () => ent.delete(item, { parse: false });
                const testDeleteRawResponse = 1;
                testDeleteRawResponse;
            });
            it('contains no timestamp', () => {
                const item = { pk };
                const deletePromise = () => entNoTimestamps.delete(item, { returnValues: 'ALL_OLD' });
                const testDeleteResponse = 1;
                testDeleteResponse;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error
                expect(() => ent.deleteParams({})).toThrow();
                // @ts-expect-error
                expect(() => ent.deleteParams({ pkMap1 })).toThrow();
                // @ts-expect-error
                expect(() => ent.deleteParams({ pkMap2 })).toThrow();
            });
            it('with conditions', () => {
                ent.deleteParams({ pk }, { conditions: { attr: 'pk', exists: true } });
                () => ent.delete({ pk }, { conditions: { attr: 'pk', exists: true } });
                expect(() => ent.deleteParams({ pk }, 
                // @ts-expect-error
                { conditions: { attr: 'sk', exists: true } })).toThrow();
                () => ent.delete({ pk }, { conditions: { attr: 'sk', exists: true } });
            });
        });
        describe('put method', () => {
            it('nominal case', () => {
                const item1 = { pk, hidden: 'test' };
                ent.putParams(item1, { returnValues: 'ALL_OLD' });
                const putPromise1 = () => ent.put({ pk }, { returnValues: 'ALL_OLD' });
                const testPutItem1 = 1;
                testPutItem1;
                const item2 = pkMaps;
                ent.putParams(item2, { returnValues: 'ALL_OLD' });
                const putPromise2 = () => ent.put(item2, { returnValues: 'ALL_OLD' });
                const testPutItem2 = 1;
                testPutItem2;
                const testPutItemOptions = 1;
                testPutItemOptions;
            });
            it('no auto-execution', () => {
                const item = { pk };
                const putPromise = () => entNoExecute.put(item);
                const testPutParams = 1;
                testPutParams;
            });
            it('force execution', () => {
                const item = { pk };
                const putPromise = () => entNoExecute.put(item, { execute: true, returnValues: 'ALL_OLD' });
                const testPutItem = 1;
                testPutItem;
            });
            it('force no execution', () => {
                const item = { pk };
                const putPromise = () => ent.put(item, { execute: false, returnValues: 'ALL_OLD' });
                const testPutParams = 1;
                testPutParams;
            });
            it('no auto-parsing', () => {
                const item = { pk };
                const putPromise = () => entNoParse.put(item);
                const testPutRawResponse = 1;
                testPutRawResponse;
            });
            it('force parsing', () => {
                const item = { pk };
                const putPromise = () => entNoParse.put(item, { parse: true, returnValues: 'ALL_OLD' });
                const testPutItem = 1;
                testPutItem;
            });
            it('force no parsing', () => {
                const item = { pk };
                const putPromise = () => ent.put(item, { parse: false });
                const testPutRawResponse = 1;
                testPutRawResponse;
            });
            it('contains no timestamp', () => {
                const item = { pk };
                const putPromise = () => entNoTimestamps.put(item, { returnValues: 'ALL_OLD' });
                const testPutResponse = 1;
                testPutResponse;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error
                expect(() => ent.putParams({})).toThrow();
                // @ts-expect-error
                expect(() => ent.putParams({ pkMap1 })).toThrow();
                // @ts-expect-error
                expect(() => ent.putParams({ pkMap2 })).toThrow();
            });
            it('with conditions', () => {
                ent.putParams({ pk }, { conditions: { attr: 'pk', exists: true } });
                () => ent.put({ pk }, { conditions: { attr: 'pk', exists: true } });
                expect(() => 
                // @ts-expect-error
                ent.putParams({ pk }, { conditions: { attr: 'sk', exists: true } })).toThrow();
                () => ent.put({ pk }, { conditions: { attr: 'sk', exists: true } });
            });
        });
        describe('update method', () => {
            it('nominal case', () => {
                const item1 = { pk, hidden: 'test' };
                ent.updateParams(item1);
                const updatePromise1 = () => ent.update(item1, { returnValues: 'ALL_OLD' });
                const testUpdateItem1 = 1;
                testUpdateItem1;
                const item2 = pkMaps;
                ent.updateParams(item2);
                const updatePromise2 = () => ent.update(item2, { returnValues: 'ALL_NEW' });
                const testUpdateItem2 = 1;
                testUpdateItem2;
                const testUpdateItemOptions = 1;
                testUpdateItemOptions;
            });
            it('no auto-execution', () => {
                const item = { pk };
                const updatePromise = () => entNoExecute.update(item);
                const testUpdateParams = 1;
                testUpdateParams;
            });
            it('force execution', () => {
                const item = { pk };
                const updatePromise = () => entNoExecute.update(item, { execute: true, returnValues: 'ALL_NEW' });
                const testUpdateItem = 1;
                testUpdateItem;
            });
            it('force no execution', () => {
                const item = { pk };
                const updatePromise = () => ent.update(item, { execute: false });
                const testUpdateParams = 1;
                testUpdateParams;
            });
            it('no auto-parsing', () => {
                const item = { pk };
                const updatePromise = () => entNoParse.update(item);
                const testUpdateRawResponse = 1;
                testUpdateRawResponse;
            });
            it('force parsing', () => {
                const item = { pk };
                const updatePromise = () => entNoParse.update(item, { parse: true, returnValues: 'ALL_NEW' });
                const testUpdateItem = 1;
                testUpdateItem;
            });
            it('force no parsing', () => {
                const item = { pk };
                const updatePromise = () => ent.update(item, { parse: false });
                const testUpdateRawResponse = 1;
                testUpdateRawResponse;
            });
            it('contains no timestamp', () => {
                const item = { pk };
                const updatePromise = () => entNoTimestamps.update(item, { returnValues: 'ALL_NEW' });
                const testUpdateItem = 1;
                testUpdateItem;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error
                expect(() => ent.updateParams({})).toThrow();
                // @ts-expect-error
                expect(() => ent.updateParams({ pkMap1 })).toThrow();
                // @ts-expect-error
                expect(() => ent.updateParams({ pkMap2 })).toThrow();
            });
            it('with conditions', () => {
                ent.updateParams({ pk }, { conditions: { attr: 'pk', exists: true } });
                () => ent.update({ pk }, { conditions: { attr: 'pk', exists: true } });
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ pk }, { conditions: { attr: 'sk', exists: true } })).toThrow();
                () => ent.update({ pk }, { conditions: { attr: 'sk', exists: true } });
            });
        });
        describe('query method', () => {
            it('nominal case', () => {
                const queryPromise = () => ent.query('pk');
                const testQueryItems = 1;
                testQueryItems;
                const testQueryNextItems = 1;
                testQueryNextItems;
                const testQueryItemsOptions = 1;
                testQueryItemsOptions;
            });
            it('force execution', () => {
                const queryPromise = () => ent.query('pk', { execute: true });
                const testQueryItems = 1;
                testQueryItems;
                const testQueryNextItems = 1;
                testQueryNextItems;
            });
            it('force no execution', () => {
                const queryPromise = () => ent.query('pk', { execute: false, parse: true });
                const testQueryInput = 1;
                testQueryInput;
            });
            it('force parsing', () => {
                const queryPromise = () => ent.query('pk', { parse: true });
                const testQueryItems = 1;
                testQueryItems;
                const testQueryNextItems = 1;
                testQueryNextItems;
            });
            it('force no parsing', () => {
                const queryPromise = () => ent.query('pk', { parse: false });
                const testQueryItems = 1;
                testQueryItems;
                const testQueryNextItems = 1;
                testQueryNextItems;
            });
            it('contains no timestamp', () => {
                const queryPromise = () => entNoTimestamps.query('pk');
                const testQueryItems = 1;
                testQueryItems;
            });
        });
        describe('scan method', () => {
            it('nominal case', () => {
                const scanPromise = () => ent.scan();
                const testScanItems = 1;
                testScanItems;
                const testScanNextItems = 1;
                testScanNextItems;
            });
            it('force execution', () => {
                const scanPromise = () => ent.scan({ execute: true });
                const testScanItems = 1;
                testScanItems;
                const testScanNextItems = 1;
                testScanNextItems;
            });
            it('force no execution', () => {
                const scanPromise = () => ent.scan({ execute: false, parse: true });
                const testScanInput = 1;
                testScanInput;
            });
            it('force parsing', () => {
                const scanPromise = () => ent.scan({ parse: true });
                const testScanItems = 1;
                testScanItems;
                const testScanNextItems = 1;
                testScanNextItems;
            });
            it('force no parsing', () => {
                const scanPromise = () => ent.scan({ parse: false });
                const testScanItems = 1;
                testScanItems;
                const testScanNextItems = 1;
                testScanNextItems;
            });
        });
    });
    describe('PK (mapped) + SK (mapped) Entity', () => {
        const entityName = 'TestEntity_PK_SK_Mapped';
        const cr = 'cr';
        const mod = 'mod';
        const en = 'en';
        const pk = 'pk';
        const pkMap1 = 'p1';
        const pkMap2 = 'p2';
        const pkMaps = { pkMap1, pkMap2 };
        const sk = 'sk';
        const skMap1 = 's1';
        const skMap2 = 's2';
        const skMaps = { skMap1, skMap2 };
        const ck = { pk, sk };
        const ckMaps = { ...pkMaps, ...skMaps };
        const alwAttr = 'alw';
        const reqAttr = 'req';
        const alwAttrDef = 'alwAttrDef';
        const reqAttrDef = 'reqAttrDef';
        const existAttrs = { alwAttr, reqAttr };
        const existAttrsDef = { alwAttrDef, reqAttrDef };
        const map1 = '1';
        const map2 = '2';
        const map2b = '2b';
        const map3 = '3';
        const map4 = '4';
        const maps = { map1, map2, map3, map4 };
        const ent = new Entity({
            name: entityName,
            createdAlias: cr,
            modifiedAlias: mod,
            typeAlias: en,
            attributes: {
                pk: { type: 'string', partitionKey: true },
                pkMap1: ['pk', 0],
                pkMap2: ['pk', 1],
                sk: { type: 'string', sortKey: true },
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
                mapped: { type: 'string' },
                hidden: { type: 'string', hidden: true }
            },
            table
        });
        const testExtends = 1;
        testExtends;
        describe('get method', () => {
            it('nominal case', () => {
                const ck1 = ck;
                ent.getParams(ck1);
                const getPromise1 = () => ent.get(ck1);
                const testGetItem1 = 1;
                testGetItem1;
                const ck2 = { ...pkMaps, sk };
                ent.getParams(ck2);
                const getPromise2 = () => ent.get(ck2);
                const testGetItem2 = 1;
                testGetItem2;
                const ck3 = { pk, ...skMaps };
                ent.getParams(ck3);
                const getPromise3 = () => ent.get(ck3);
                const testGetItem3 = 1;
                testGetItem3;
                const ck4 = ckMaps;
                ent.getParams(ck4);
                const getPromise4 = () => ent.get(ck4);
                const testGetItem4 = 1;
                testGetItem4;
                const testGetItemOptions = 1;
                testGetItemOptions;
                const testItem = 1;
                testItem;
            });
            it('filtered attributes', () => {
                ent.getParams(ck, {
                    attributes: ['pkMap1', 'skMap1', 'reqAttr', 'optAttr']
                });
                const getPromiseFiltFn = () => ent.get(ck, {
                    attributes: ['pkMap1', 'skMap1', 'reqAttr', 'optAttr']
                });
                const testGetItemFilt = 1;
                testGetItemFilt;
                expect(() => 
                // @ts-expect-error
                ent.getParams(ck, { attributes: ['incorrectAttr'] })).toThrow();
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error: Missing sort key
                expect(() => ent.getParams({ pk })).toThrow();
                // @ts-expect-error: Missing partition key
                expect(() => ent.getParams({ sk })).toThrow();
                // @ts-expect-error: Partition key mapping incomplete
                expect(() => ent.getParams({ pkMap1, sk })).toThrow();
                // @ts-expect-error: Sort key mapping incomplete
                expect(() => ent.getParams({ pk, skMap1 })).toThrow();
            });
            it('throws when a value has incorrect type', () => {
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.getParams({ pk: ['bad', 'type'], sk });
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.getParams({ pk: { bad: 'type' }, sk });
            });
        });
        describe('delete method', () => {
            it('nominal case', () => {
                const ck1 = ck;
                ent.deleteParams(ck1);
                const deletePromise1 = () => ent.delete(ck1);
                let deleteItem1;
                deleteItem1;
                const ck2 = { pkMap1, pkMap2, sk };
                ent.deleteParams(ck2);
                const deletePromise2 = () => ent.delete(ck2);
                let deleteItem2;
                deleteItem2;
                const ck3 = { pk, skMap1, skMap2 };
                ent.deleteParams(ck3);
                const deletePromise3 = () => ent.delete(ck3, { returnValues: 'NONE' });
                let deleteItem3;
                deleteItem3;
                const ck4 = ckMaps;
                ent.deleteParams(ck4);
                const deletePromise4 = () => ent.delete(ck4, { returnValues: 'ALL_OLD' });
                const testDeleteItem4 = 1;
                testDeleteItem4;
                const testDeleteItemOptions = 1;
                testDeleteItemOptions;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error: Missing sort key
                expect(() => ent.deleteParams({ pk })).toThrow();
                // @ts-expect-error: Missing partition key
                expect(() => ent.deleteParams({ sk })).toThrow();
                expect(() => 
                // @ts-expect-error: Partition key mapping incomplete
                ent.deleteParams({ pkMap1, sk })).toThrow();
                expect(() => 
                // @ts-expect-error: Sort key mapping incomplete
                ent.deleteParams({ pk, skMap1 })).toThrow();
            });
            it('throws when a value has incorrect type', () => {
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.deleteParams({ pk: ['bad', 'type'], sk });
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.deleteParams({ pk: { bad: 'type' }, sk });
            });
            it('with conditions', () => {
                ent.deleteParams(ck, { conditions: { attr: 'pk', exists: true } });
                () => ent.delete(ck, { conditions: { attr: 'pk', exists: true } });
                expect(() => ent.deleteParams(ck, 
                // @ts-expect-error
                { conditions: { attr: 'incorrectAttr', exists: true } })).toThrow();
                () => ent.delete(ck, {
                    // @ts-expect-error
                    conditions: { attr: 'incorrectAttr', exists: true }
                });
            });
        });
        describe('put method', () => {
            it('nominal case', () => {
                const item1 = { ...ck, ...existAttrs, map1, map3 };
                ent.putParams(item1);
                const putPromise1 = () => ent.put(item1);
                let putItem1;
                putItem1;
                const item2 = { ...ck, ...existAttrs, ...existAttrsDef, map1, map3 };
                ent.putParams(item2);
                const putPromise2 = () => ent.put(item2);
                let putItem2;
                putItem2;
                const item3 = { ...pkMaps, sk, ...existAttrs, ...maps };
                ent.putParams(item3);
                const putPromise3 = () => ent.put(item3);
                let putItem3;
                putItem3;
                const item4 = { pk, ...skMaps, ...existAttrs, ...maps };
                ent.putParams(item4);
                const putPromise4 = () => ent.put(item4);
                let putItem4;
                putItem4;
                const item5 = { ...ckMaps, ...existAttrs, ...maps };
                ent.putParams(item5);
                const putPromise5 = () => ent.put(item5, { returnValues: 'NONE' });
                let putItem5;
                putItem5;
                const item6 = { ...ck, ...existAttrs, ...maps, map2: map2b };
                ent.putParams(item6);
                const putPromise6 = () => ent.put(item6, { returnValues: 'ALL_OLD' });
                const testPutItem6 = 1;
                testPutItem6;
                const testPutItemOptions = 1;
                testPutItemOptions;
            });
            it('throws when primary key is incomplete', () => {
                expect(() => 
                // @ts-expect-error: Missing sort key
                ent.putParams({ pk, ...existAttrs, map1, map3 })).toThrow();
                expect(() => 
                // @ts-expect-error: Missing partition key
                ent.putParams({ sk, ...existAttrs, map1, map3 })).toThrow();
                expect(() => 
                // @ts-expect-error: Partition key mapping incomplete
                ent.putParams({ pkMap1, sk, ...existAttrs, map1, map3 })).toThrow();
                expect(() => 
                // @ts-expect-error: Sort key mapping incomplete
                ent.putParams({ pk, skMap1, ...existAttrs, map1, map3 })).toThrow();
            });
            it('throws when required attributes miss', () => {
                // @ts-expect-error
                expect(() => ent.putParams({ ck, map1, map3 })).toThrow();
                // @ts-expect-error
                expect(() => ent.putParams({ ck, ...existAttrs, map1 })).toThrow();
                // @ts-expect-error
                expect(() => ent.putParams({ ck, ...existAttrs, map3 })).toThrow();
            });
            it('throws when a value has incorrect type', () => {
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.putParams({ pk: ['bad', 'type'], sk, ...existAttrs, ...maps });
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.putParams({ pk: { bad: 'type' }, sk, ...existAttrs, ...maps });
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.putParams({ ...ck, alwAttr, reqAttr: ['bad', 'type'], ...maps });
            });
            it('with conditions', () => {
                ent.putParams({ ...ck, ...existAttrs, map1, map3 }, { conditions: { attr: 'pk', exists: true } });
                () => ent.put({ ...ck, ...existAttrs, map1, map3 }, { conditions: { attr: 'pk', exists: true } });
                expect(() => ent.putParams({ ...ck, ...existAttrs, map1, map3 }, 
                // @ts-expect-error
                { conditions: { attr: 'incorrectAttr', exists: true } })).toThrow();
                () => ent.put({ ...ck, ...existAttrs, map1, map3 }, 
                // @ts-expect-error
                { conditions: { attr: 'incorrectAttr', exists: true } });
            });
        });
        describe('update method', () => {
            const testedParams = { ...ck, alwAttr, map1, map3 };
            it('nominal case', () => {
                const item1 = { ...testedParams, ...maps };
                ent.updateParams(item1);
                const updatePromise1 = () => ent.update(item1);
                let updateItem1;
                updateItem1;
                const item2 = { ...testedParams, ...existAttrs, ...existAttrsDef };
                ent.updateParams(item2);
                const updatePromise2 = () => ent.update(item2, { returnValues: 'NONE' });
                let updateItem2;
                updateItem2;
                const item3 = { ...omit(testedParams, 'pk'), ...pkMaps };
                ent.updateParams(item3);
                const updatePromise3 = () => ent.update(item3, { returnValues: 'ALL_OLD' });
                const testUpdateItem3 = 1;
                testUpdateItem3;
                const item4 = { ...omit(testedParams, 'sk'), ...skMaps };
                ent.updateParams(item4);
                const updatePromise4 = () => ent.update(item4, { returnValues: 'ALL_NEW' });
                const testUpdateItem4 = 1;
                testUpdateItem4;
                const item5 = {
                    ...omit(testedParams, 'pk', 'sk'),
                    ...pkMaps,
                    ...skMaps
                };
                ent.updateParams(item5);
                const updatePromise5 = () => ent.update(item5, { returnValues: 'UPDATED_OLD' });
                const testUpdateItem5 = 1;
                testUpdateItem5;
                const item6 = { ...testedParams, map2: map2b, map4 };
                ent.updateParams(item6);
                const updatePromise6 = () => ent.update(item6, { returnValues: 'UPDATED_NEW' });
                const testUpdateItem6 = 1;
                testUpdateItem6;
                const testUpdateItemOptions = 1;
                testUpdateItemOptions;
            });
            it('attribute deletion nominal case', () => {
                ent.updateParams({ ...testedParams, ...maps, optAttr: null });
                ent.updateParams({
                    ...testedParams,
                    ...maps,
                    $remove: ['optAttr', 'mapped']
                });
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error: Missing partition key
                expect(() => ent.updateParams({ pk, alwAttr, map3 })).toThrow();
                // @ts-expect-error: Missing partition key
                expect(() => ent.updateParams({ sk, alwAttr, map3 })).toThrow();
                expect(() => 
                // @ts-expect-error: Partition key mapping incomplete
                ent.updateParams({ pkMap1, sk, alwAttr, map3 })).toThrow();
                expect(() => 
                // @ts-expect-error: Sort key mapping incomplete
                ent.updateParams({ pk, skMap1, alwAttr, map3 })).toThrow();
            });
            it('throws when always attributes miss', () => {
                // @ts-expect-error
                expect(() => ent.updateParams({ ...ck, alwAttr })).toThrow();
                // @ts-expect-error
                expect(() => ent.updateParams({ ...ck, map3 })).toThrow();
            });
            it('throws when a value has incorrect type', () => {
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.updateParams({ ...testedParams, pk: ['bad', 'type'] });
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.updateParams({ ...testedParams, pk: { bad: 'type' } });
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.updateParams({ ...testedParams, alwAttr: ['bad', 'type'] });
            });
            it('throws when trying to delete pk or sk', () => {
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, pk: null })).toThrow();
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, $remove: ['pk'] })).toThrow();
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.updateParams({ ...testedParams, pkMap1: null, pkMap2 });
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.updateParams({ ...testedParams, pkMap2, $remove: ['pkMap1'] });
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, sk: null })).toThrow();
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, $remove: ['sk'] })).toThrow();
                // 🔨 TOIMPROVE: Not sure this should not throw
                // @ts-expect-error
                ent.updateParams({ ...testedParams, skMap1: null, skMap2 });
            });
            it('throws when trying to delete req/always attr', () => {
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, reqAttr: null })).toThrow();
                expect(() => ent.updateParams({ ...testedParams, reqAttr: '' })).toThrow();
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, $remove: ['reqAttr'] })).toThrow();
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, reqAttrDef: null })).toThrow;
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, alwAttr: null })).toThrow();
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, $remove: ['alwAttr'] })).toThrow();
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, alwAttrDef: null })).toThrow();
                expect(() => 
                // @ts-expect-error
                ent.updateParams({ ...testedParams, $remove: ['alwAttrDef'] })).toThrow();
            });
            it('throws with bad returnValues parameter', () => {
                expect(() => ent.updateParams({ ...ck, alwAttr, map3 }, 
                // @ts-expect-error
                { returnValues: 'bogus_option' })).toThrow();
            });
            it('with conditions', () => {
                ent.updateParams(testedParams, {
                    conditions: { attr: 'pk', exists: true }
                });
                () => ent.update(testedParams, {
                    conditions: { attr: 'pk', exists: true }
                });
                expect(() => ent.updateParams(testedParams, 
                // @ts-expect-error
                { conditions: { attr: 'incorrectAttr', exists: true } })).toThrow();
                () => ent.update(testedParams, 
                // @ts-expect-error
                { conditions: { attr: 'incorrectAttr', exists: true } });
            });
        });
        describe('query method', () => {
            it('nominal case', () => {
                const queryPromise = () => ent.query('pk');
                const testQueryItems = 1;
                testQueryItems;
                const testQueryItemsOptions = 1;
                testQueryItemsOptions;
            });
        });
        describe('scan method', () => {
            it('nominal case', () => {
                const scanPromise = () => ent.scan();
                const testScanItems = 1;
                testScanItems;
            });
        });
    });
    describe('PK (dependsOn) + SK (dependsOn) Entity', () => {
        const entityName = 'TestEntity_PK_SK_dependsOn';
        const pk = 'pk';
        const pkMap1 = 'p1';
        const pkMap2 = 'p2';
        const sk = 'sk';
        const skMap1 = 's1';
        const skMap2 = 's2';
        const ck = { pk, sk };
        const ent = new Entity({
            name: entityName,
            attributes: {
                pk: {
                    type: 'string',
                    partitionKey: true,
                    default: ({ pkMap1, pkMap2 }) => [pkMap1, pkMap2].join('#'),
                    dependsOn: ['pkMap1', 'pkMap2']
                },
                pkMap1: { type: 'string', required: true },
                pkMap2: { type: 'string', required: true, default: pkMap2 },
                sk: {
                    type: 'string',
                    sortKey: true,
                    default: ({ skMap1, skMap2 }) => [skMap1, skMap2].join('#'),
                    dependsOn: ['skMap1', 'skMap2']
                },
                skMap1: { type: 'string', required: false },
                skMap2: { type: 'string', required: true, default: skMap2 }
            },
            table
        });
        const testExtends = 1;
        testExtends;
        describe('get method', () => {
            it('nominal case', () => {
                const ck1 = ck;
                // Regular PK
                ent.getParams(ck1);
                const getPromise1 = () => ent.get(ck1);
                const testGetItem1 = 1;
                testGetItem1;
                // Using PK "dependsOn": pkMap2 is not required as it has default
                const ck2 = { pkMap1, sk };
                ent.getParams(ck2);
                const getPromise2 = () => ent.get(ck2);
                const testGetItem2 = 1;
                testGetItem2;
                // Using SK "dependsOn": skMap2 is not required as it has default
                const ck3 = { pk, skMap1 };
                ent.getParams(ck3);
                const getPromise3 = () => ent.get(ck3);
                const testGetItem3 = 1;
                testGetItem3;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error Missing partition
                expect(() => ent.getParams({ sk })).toThrow();
                // @ts-expect-error Partition key dependsOn incomplete
                expect(() => ent.getParams({ pkMap2, sk })).toThrow();
            });
        });
        describe('delete method', () => {
            it('nominal case', () => {
                const ck1 = ck;
                ent.deleteParams(ck1);
                const deletePromise1 = () => ent.delete(ck1);
                deletePromise1;
                const ck2 = { pkMap1, sk };
                ent.deleteParams(ck2);
                const deletePromise2 = () => ent.delete(ck2);
                deletePromise2;
                const ck3 = { pk, skMap1 };
                ent.deleteParams(ck3);
                const deletePromise3 = () => ent.delete(ck3);
                deletePromise3;
                const ck4 = { pkMap1, skMap1 };
                ent.deleteParams(ck4);
                const deletePromise4 = () => ent.delete(ck4);
                deletePromise4;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error Missing sort key
                expect(() => ent.deleteParams({ sk })).toThrow();
                // @ts-expect-error: Partition key dependsOn incomplete
                expect(() => ent.deleteParams({ pkMap2, sk })).toThrow();
            });
        });
        describe('put method', () => {
            it('nominal case', () => {
                const item1 = { pkMap1, skMap1, pkMap2, skMap2 };
                ent.putParams(item1);
                const putPromise1 = () => ent.put(item1);
                putPromise1;
                const item2 = { pkMap1, skMap1 };
                ent.putParams(item2);
                const putPromise2 = () => ent.put(item2);
                putPromise2;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error: Missing sort key
                expect(() => ent.putParams({ sk })).toThrow();
                // @ts-expect-error: Partition key dependsOn incomplete
                expect(() => ent.putParams({ pkMap2, sk })).toThrow();
            });
        });
        describe('update method', () => {
            it('nominal case', () => {
                const item1 = { pkMap1, pkMap2, skMap1, skMap2 };
                ent.updateParams(item1);
                const updatePromise1 = () => ent.update(item1);
                updatePromise1;
                const item2 = { pkMap1, skMap1 };
                ent.updateParams(item2);
                const updatePromise2 = () => ent.update(item2);
                updatePromise2;
            });
            it('throws when primary key is incomplete', () => {
                // @ts-expect-error Missing partition key
                expect(() => ent.updateParams({ sk })).toThrow();
                // @ts-expect-error Partition key dependsOn incomplete
                expect(() => ent.updateParams({ pkMap2, sk })).toThrow();
            });
        });
    });
    describe('PK (default) + SK Entity', () => {
        const entityName = 'TestEntity_PK_default_SK';
        const pk = 'pk';
        const pk2 = 'pk2';
        const sk = 'sk';
        const ck2 = { pk: pk2, sk };
        const ent = new Entity({
            name: entityName,
            attributes: {
                pk: { type: 'string', partitionKey: true, default: pk },
                sk: { type: 'string', sortKey: true }
            },
            table
        });
        const testExtends = 1;
        testExtends;
        it('get method', () => {
            const ck1 = { sk };
            ent.getParams(ck1);
            const getPromise1 = () => ent.get(ck1);
            const testGetItem1 = 1;
            testGetItem1;
            ent.getParams(ck2);
            const getPromise2 = () => ent.get(ck2);
            const testGetItem2 = 1;
            testGetItem2;
            const testItem = 1;
            testItem;
        });
        it('delete method', () => {
            ent.deleteParams({ sk });
            ent.deleteParams(ck2);
        });
        it('put method', () => {
            ent.putParams({ sk });
            ent.putParams(ck2);
        });
        it('update method', () => {
            ent.updateParams({ sk });
            ent.updateParams(ck2);
        });
    });
    describe('PK + SK (default) Entity', () => {
        const entityName = 'TestEntity_PK_SK_default';
        const pk = 'pk';
        const sk = 'sk';
        const sk2 = 'sk2';
        const ck2 = { pk, sk: sk2 };
        const ent = new Entity({
            name: entityName,
            attributes: {
                pk: { type: 'string', partitionKey: true },
                sk: { type: 'string', sortKey: true, default: sk }
            },
            table
        });
        const testExtends = 1;
        testExtends;
        it('get method', () => {
            ent.getParams({ pk });
            ent.getParams(ck2);
        });
        it('delete method', () => {
            ent.deleteParams({ pk });
            ent.deleteParams(ck2);
        });
        it('put method', () => {
            ent.putParams({ pk });
            ent.putParams(ck2);
        });
        it('update method', () => {
            ent.updateParams({ pk });
            ent.updateParams(ck2);
        });
    });
    describe('Overlayed methods', () => {
        const pk = 'pk';
        const sk = 'sk';
        const ck = { pk, sk };
        const pk0 = 'pk0';
        const sk0 = 'sk0';
        const ck0 = { pk0, sk0 };
        const str0 = 'str0';
        const num0 = 42;
        const ent = new Entity({
            name: 'TestEntity_OverlayedMethods',
            attributes: {
                pk: { type: 'string', partitionKey: true, hidden: true },
                sk: { type: 'string', sortKey: true, hidden: true, default: sk },
                string: { type: 'string' }
            },
            table
        });
        const testExtends = 1;
        testExtends;
        describe('get method', () => {
            describe('MethodItemOverlay', () => {
                it('composite key should match infered composite key', () => {
                    () => ent.get(ck);
                    () => ent.get(ck0);
                });
                it('filtered attribute should match MethodItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.get(ck, { attributes: ['pk'] });
                    () => ent.get(ck, { attributes: ['pk0'] });
                });
                it('returned Item should match MethodItemOverlay, even filtered', () => {
                    const getPromise = () => ent.get(ck);
                    const testGetItem = 1;
                    testGetItem;
                    const filteredGetPromise = () => ent.get(ck, {
                        attributes: ['pk0', 'sk0', 'str0']
                    });
                    const testFilteredGetItem = 1;
                    testFilteredGetItem;
                });
            });
            describe('MethodItemOverlay + MethodCompositeKeyOverlay', () => {
                it('composite key should match MethodCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.get(ck);
                    () => ent.get(ck0);
                });
                it('filtered attribute should (still) match MethodItemOverlay', () => {
                    () => ent.get(ck0, {
                        // @ts-expect-error
                        attributes: ['pk']
                    });
                    () => ent.get(ck0, {
                        attributes: ['pk0']
                    });
                });
                it('returned Item should match MethodItemOverlay, even filtered', () => {
                    const getPromise = () => ent.get(ck0);
                    const testGetItem = 1;
                    testGetItem;
                    const filteredGetPromise = () => ent.get(ck0, { attributes: ['pk0', 'sk0', 'str0'] });
                    const testFilteredGetItem = 1;
                    testFilteredGetItem;
                });
            });
        });
        describe('delete method', () => {
            describe('MethodItemOverlay', () => {
                it('composite key should match infered composite key', () => {
                    () => ent.delete(ck);
                    () => ent.delete(ck0);
                });
                it('condition attributes should match MethodItemOverlay', () => {
                    () => ent.delete(ck, {
                        // @ts-expect-error
                        conditions: { attr: 'pk', exists: true }
                    });
                    () => ent.delete(ck, {
                        conditions: { attr: 'pk0', exists: true }
                    });
                });
                it('Attributes match MethodItemOverlay', () => {
                    const deletePromise = () => ent.delete(ck);
                    const testDeleteItem = 1;
                    testDeleteItem;
                });
            });
            describe('MethodItemOverlay + MethodCompositeKeyOverlay', () => {
                it('composite key should match MethodCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.delete(ck);
                    () => ent.delete(ck0);
                });
                it('condition attributes should (still) match MethodItemOverlay', () => {
                    () => ent.delete(ck0, {
                        // @ts-expect-error
                        conditions: { attr: 'pk', exists: true }
                    });
                    () => ent.delete(ck0, {
                        conditions: { attr: 'pk0', exists: true }
                    });
                });
                it('returned Attributes should match MethodItemOverlay', () => {
                    const deletePromise = () => ent.delete(ck0);
                    const testDeleteItem = 1;
                    testDeleteItem;
                });
            });
        });
        describe('put method', () => {
            it('Item should match MethodItemOverlay', () => {
                // @ts-expect-error
                () => ent.put(ck);
                () => ent.put({ ...ck0, num0, str0 });
            });
            it('condition attributes should match MethodItemOverlay', () => {
                () => ent.put({ ...ck0, num0 }, 
                // @ts-expect-error
                { conditions: { attr: 'pk', exists: true } });
                () => ent.put({ ...ck0, num0 }, { conditions: { attr: 'pk0', exists: true } });
            });
            it('Attributes match MethodItemOverlay', () => {
                const putPromise = () => ent.put({ ...ck0, num0 });
                const testPutItem = 1;
                testPutItem;
            });
        });
        describe('update method', () => {
            it('item should match MethodItemOverlay', () => {
                // @ts-expect-error
                () => ent.update(ck);
                () => ent.update({ ...ck0, num0 });
            });
            it('condition attributes should match MethodItemOverlay', () => {
                () => ent.update({ ...ck0, num0 }, 
                // @ts-expect-error
                { conditions: { attr: 'pk', exists: true } });
                () => ent.update({ ...ck0, num0 }, { conditions: { attr: 'pk0', exists: true } });
            });
            it('Attributes match MethodItemOverlay, when returnValues is not NONE', () => {
                const updatePromise = () => ent.update({ ...ck0, num0 }, { returnValues: 'UPDATED_NEW' });
                const testUpdateItem = 1;
                testUpdateItem;
            });
            it('with conditions and returnValues', () => {
                const updatePromise = () => ent.update({
                    pk,
                    string: 'some-string'
                }, {
                    execute: false,
                    conditions: [
                        {
                            attr: 'string',
                            exists: true
                        }
                    ],
                    returnValues: 'ALL_NEW',
                });
                const testUpdateParams = 1;
                testUpdateParams;
            });
            it('with invalid conditions attributes', () => {
                // @ts-expect-error
                ent.updateParams({ pk }, { conditions: { attr: 'nonExistentAttr', exists: true } });
            });
        });
        describe('query method', () => {
            it('condition attributes should match MethodItemOverlay', () => {
                // @ts-expect-error
                () => ent.query('pk', { attributes: ['pk'] });
                () => ent.query('pk', { attributes: ['pk0'] });
            });
            it('returned Items should match MethodItemOverlay', () => {
                const queryPromise = () => ent.query('pk');
                const testQueryItem = 1;
                testQueryItem;
            });
        });
        describe('scan method', () => {
            it('returned Items should match MethodItemOverlay', () => {
                const scanPromise = () => ent.scan();
                const testScanItems = 1;
                testScanItems;
            });
        });
    });
    describe('Overlayed entity', () => {
        const pk = 'pk';
        const sk = 'sk';
        const ck = { pk, sk };
        const pk0 = 'pk0';
        const sk0 = 'sk0';
        const ck0 = { pk0, sk0 };
        const str0 = 'str0';
        const num0 = 42;
        const pk1 = 'pk1';
        const sk1 = 'sk1';
        const ck1 = { pk1, sk1 };
        const str1 = 'str1';
        const num1 = 43;
        const ent = new Entity({
            name: 'TestEntity_Overlayed',
            attributes: {
                pk: { type: 'string', partitionKey: true },
                sk: { type: 'string', sortKey: true, default: sk }
            },
            table
        });
        const testExtends = 1;
        testExtends;
        describe('get method', () => {
            describe('EntityOverlay only', () => {
                it('composite key should match EntityCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.get(ck);
                    () => ent.get(ck0);
                });
                it('filtered attribute should match EntityItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.get(ck0, { attributes: ['pk'] });
                    () => ent.get(ck0, { attributes: ['pk0'] });
                    const testGetItemOptions = 1;
                    testGetItemOptions;
                });
                it('returned Item should match EntityItemOverlay, even filtered', () => {
                    const getPromise = () => ent.get(ck0);
                    const testGetItem = 1;
                    testGetItem;
                    const filteredGetPromise = () => ent.get(ck0, { attributes: ['pk0', 'sk0', 'str0'] });
                    const testFilteredGetItem = 1;
                    testFilteredGetItem;
                    const testItem = 1;
                    testItem;
                });
            });
            describe('MethodItemOverlay + EntityCompositeKeyOverlay', () => {
                it('composite key should (still) match EntityCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.get(ck);
                    () => ent.get(ck0);
                    () => ent.get(ck1);
                });
                it('filtered attribute should match MethodItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.get(ck0, { attributes: ['pk'] });
                    () => ent.get(ck0, { attributes: ['pk0'] });
                    () => ent.get(ck0, { attributes: ['pk1'] });
                });
                it('returned Item should match MethodItemOverlay', () => {
                    const getPromise = () => ent.get(ck0);
                    const testGetItem = 1;
                    testGetItem;
                });
            });
            describe('Method Overlay only', () => {
                it('composite key should match MethodCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.get(ck);
                    () => ent.get(ck0);
                    () => ent.get(ck1);
                });
                it('filtered attribute should (still) match MethodItemOverlay', () => {
                    () => ent.get(ck1, {
                        // @ts-expect-error
                        attributes: ['pk']
                    });
                    () => ent.get(ck1, {
                        // @ts-expect-error
                        attributes: ['pk0']
                    });
                    () => ent.get(ck1, {
                        attributes: ['pk1']
                    });
                });
                it('returned Item should match MethodItemOverlay', () => {
                    const getPromise = () => ent.get(ck1);
                    const testGetItem = 1;
                    testGetItem;
                });
            });
        });
        describe('delete method', () => {
            describe('EntityOverlay only', () => {
                it('composite key should match EntityCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.delete(ck);
                    () => ent.delete(ck0);
                    () => ent.delete(ck1);
                });
                it('condition attributes should match EntityItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.delete(ck0, { conditions: { attr: 'pk', exists: true } });
                    () => ent.delete(ck0, { conditions: { attr: 'pk0', exists: true } });
                    const testDeleteItemOptions = 1;
                    testDeleteItemOptions;
                });
                it('Attributes misses from return type if no or none returnValue option is provided', () => {
                    const deletePromiseNone1 = () => ent.delete(ck0);
                    let deleteItemNone1;
                    deleteItemNone1;
                    const deletePromiseNone2 = () => ent.delete(ck0, { returnValues: 'NONE' });
                    let deleteItemNone2;
                    deleteItemNone2;
                });
                it('Attributes match EntityItemOverlay if ALL_OLD option is provided', () => {
                    const deletePromise = () => ent.delete(ck0, { returnValues: 'ALL_OLD' });
                    const testDeleteItem = 1;
                    testDeleteItem;
                });
            });
            describe('MethodItemOverlay + EntityCompositeKeyOverlay', () => {
                it('composite key should (still) match EntityCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.delete(ck);
                    () => ent.delete(ck0);
                    () => ent.delete(ck1);
                });
                it('condition attributes should match MethodItemOverlay', () => {
                    () => ent.delete(ck0, {
                        // @ts-expect-error
                        conditions: { attr: 'pk', exists: true }
                    });
                    () => ent.delete(ck0, {
                        // @ts-expect-error
                        conditions: { attr: 'pk0', exists: true }
                    });
                    () => ent.delete(ck0, {
                        conditions: { attr: 'pk1', exists: true }
                    });
                });
                it('Returned Attributes should match MethodItemOverlay', () => {
                    const deletePromise = () => ent.delete(ck0);
                    const testDeleteItem = 1;
                    testDeleteItem;
                });
            });
            describe('Method Overlay only', () => {
                it('composite key should match MethodCompositeKeyOverlay', () => {
                    // @ts-expect-error
                    () => ent.delete(ck);
                    () => ent.delete(ck0);
                    () => ent.delete(ck1);
                });
                it('condition attributes should (still) match MethodItemOverlay', () => {
                    () => ent.delete(ck1, {
                        // @ts-expect-error
                        conditions: { attr: 'pk', exists: true }
                    });
                    () => ent.delete(ck1, {
                        // @ts-expect-error
                        conditions: { attr: 'pk0', exists: true }
                    });
                    () => ent.delete(ck1, {
                        conditions: { attr: 'pk1', exists: true }
                    });
                });
                it('Returned Attributes should match MethodItemOverlay', () => {
                    const deletePromise = () => ent.delete(ck1);
                    const testDeleteItem = 1;
                    testDeleteItem;
                });
            });
        });
        describe('put method', () => {
            describe('EntityItemOverlay', () => {
                it('Item should match EntityItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.put(ck);
                    () => ent.put(ck0);
                    () => ent.put({ ...ck0, num0 });
                    () => ent.put({ ...ck0, num0, str0 });
                });
                it('condition attributes should match EntityItemOverlay', () => {
                    () => ent.put({ ...ck0, num0 }, 
                    // @ts-expect-error
                    { conditions: { attr: 'pk', exists: true } });
                    () => ent.put({ ...ck0, num0 }, { conditions: { attr: 'pk0', exists: true } });
                    const testPutItemOptions = 1;
                    testPutItemOptions;
                });
                it('Attributes misses from return type if no or none returnValue option is provided', () => {
                    const putPromiseNone1 = () => ent.put({ ...ck0, num0 });
                    let putItemNone1;
                    putItemNone1;
                    const putPromiseNone2 = () => ent.put({ ...ck0, num0 }, { returnValues: 'NONE' });
                    let putItemNone2;
                    putItemNone2;
                });
                it('Attributes match EntityItemOverlay if ALL_OLD option is provided', () => {
                    const putPromise = () => ent.put({ ...ck0, num0 }, { returnValues: 'ALL_OLD' });
                    const testPutItem = 1;
                    testPutItem;
                });
            });
            describe('MethodItemOverlay', () => {
                it('Item should match MethodItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.put(ck);
                    () => ent.put({ ...ck0, num0 });
                    () => ent.put({ ...ck1, num1 });
                    () => ent.put({ ...ck1, num1, str1 });
                });
                it('condition attributes should match MethodItemOverlay', () => {
                    () => ent.put({ ...ck1, num1 }, 
                    // @ts-expect-error
                    { conditions: { attr: 'pk', exists: true } });
                    () => ent.put({ ...ck1, num1 }, 
                    // @ts-expect-error
                    { conditions: { attr: 'pk0', exists: true } });
                    () => ent.put({ ...ck1, num1 }, { conditions: { attr: 'pk1', exists: true } });
                });
                it('Attributes match MethodItemOverlay', () => {
                    const putOPromise = () => ent.put({ ...ck1, num1 });
                    const testPutOItem = 1;
                    testPutOItem;
                });
            });
        });
        describe('update method', () => {
            describe('EntityOverlay only', () => {
                it('item should match EntityItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.update(ck);
                    () => ent.update({ ...ck0, num0 });
                });
                it('condition attributes should match EntityItemOverlay', () => {
                    () => ent.update({ ...ck0, num0 }, 
                    // @ts-expect-error
                    { conditions: { attr: 'pk', exists: true } });
                    () => ent.update({ ...ck0, num0 }, { conditions: { attr: 'pk0', exists: true } });
                    const testUpdateItemOptions = 1;
                    testUpdateItemOptions;
                });
                it('Attributes misses from return type if no or none returnValue option is provided', () => {
                    const none1UpdatePromise = () => ent.update({ ...ck0, num0 });
                    let none1UpdateAttributes;
                    none1UpdateAttributes;
                    const none2UpdatePromise = () => ent.update({ ...ck0, num0 }, { returnValues: 'NONE' });
                    let none2UpdateAttributes;
                    none2UpdateAttributes;
                });
                it('Attributes match EntityItemOverlay if UPDATED_OLD, UPDATED_NEW, ALL_OLD & ALL_NEW option is provided', () => {
                    const updatedOldUpdatePromise = () => ent.update({ ...ck0, num0 }, { returnValues: 'UPDATED_OLD' });
                    const assertUpdatedOldUpdateAttributes = 1;
                    assertUpdatedOldUpdateAttributes;
                    const updatedNewUpdatePromise = () => ent.update({ ...ck0, num0 }, { returnValues: 'UPDATED_NEW' });
                    const assertUpdatedNewUpdateAttributes = 1;
                    assertUpdatedNewUpdateAttributes;
                    const allOldUpdatePromise = () => ent.update({ ...ck0, num0 }, { returnValues: 'ALL_OLD' });
                    const assertAllOldUpdateAttributes = 1;
                    assertAllOldUpdateAttributes;
                    const allNewUpdatePromise = () => ent.update({ ...ck0, num0 }, { returnValues: 'ALL_NEW' });
                    const assertAllNewUpdateAttributes = 1;
                    assertAllNewUpdateAttributes;
                });
            });
            describe('MethodOverlay', () => {
                it('item should match MethodItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.update(ck);
                    () => ent.update({ ...ck0, num0 });
                    () => ent.update(ck1);
                    () => ent.update({ ...ck1, num1 });
                });
                it('condition attributes should match MethodItemOverlay', () => {
                    () => ent.update({ ...ck1, num1 }, 
                    // @ts-expect-error
                    { conditions: { attr: 'pk', exists: true } });
                    () => ent.update({ ...ck1, num1 }, 
                    // @ts-expect-error
                    { conditions: { attr: 'pk0', exists: true } });
                    () => ent.update({ ...ck1, num1 }, { conditions: { attr: 'pk1', exists: true } });
                });
                it('Attributes match MethodItemOverlay, whatever the returnValues option is', () => {
                    const updateO1Promise = () => ent.update({ ...ck1, num1 }, { returnValues: 'UPDATED_NEW' });
                    const testUpdateO1Item = 1;
                    testUpdateO1Item;
                });
            });
        });
        describe('query method', () => {
            describe('EntityOverlay only', () => {
                it('condition attributes should match EntityItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.query('pk', { attributes: ['pk'] });
                    () => ent.query('pk', { attributes: ['pk0'] });
                });
                it('returned Items should match EntityItemOverlay, even filtered', () => {
                    const queryPromise = () => ent.query('pk');
                    const testQueryItem = 1;
                    testQueryItem;
                    const testQueryItemsOptions = 1;
                    testQueryItemsOptions;
                    const filteredQueryPromise = () => ent.query('pk', { attributes: ['pk0', 'sk0', 'str0'] });
                    const testFilteredQueryItem = 1;
                    testFilteredQueryItem;
                });
            });
            describe('MethodOverlay', () => {
                it('condition attributes should match MethodItemOverlay', () => {
                    // @ts-expect-error
                    () => ent.query('pk', { attributes: ['pk'] });
                    () => ent.query('pk', { attributes: ['pk0'] });
                    () => ent.query('pk', { attributes: ['pk1'] });
                });
                it('returned Items should match MethodItemOverlay', () => {
                    const queryPromise = () => ent.query('pk');
                    const testQueryItem = 1;
                    testQueryItem;
                });
            });
        });
        describe('scan method', () => {
            describe('EntityOverlay only', () => {
                it('condition attributes should not necessarily match EntityItemOverlay', () => {
                    () => ent.scan({ attributes: ['pk'] });
                });
                it('returned Items should not necessarily match EntityItemOverlay', () => {
                    const scanPromise = () => ent.scan();
                    const testScanItems = 1;
                    testScanItems;
                });
            });
            describe('MethodOverlay', () => {
                it('condition attributes should not necessarily match MethodItemOverlay', () => {
                    () => ent.scan({ attributes: ['pk'] });
                });
                it('returned Items should match MethodItemOverlay', () => {
                    const scanPromise = () => ent.scan();
                    const testScanItems = 1;
                    testScanItems;
                });
            });
        });
        describe('table', () => {
            it('should have the right type', () => {
                const entity = new Entity({
                    name: 'TestEnity_WithTable',
                    attributes: {
                        pk: { partitionKey: true },
                        sk: { sortKey: true },
                    },
                    table
                });
                const result = 1;
                result;
            });
        });
        describe('setTable', () => {
            it('should update the type of the table property', () => {
                const newTable = new Table({
                    name: 'newTable',
                    partitionKey: 'pk',
                    sortKey: 'sk',
                    DocumentClient
                });
                const entity = new Entity({
                    name: 'Entity_WithNewTable',
                    attributes: {
                        pk: { partitionKey: true },
                        sk: { sortKey: true },
                    },
                    table,
                });
                const entityWithNewTable = entity.setTable(newTable);
                const result = 1;
                result;
            });
        });
    });
});
