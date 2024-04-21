import { Entity, Table } from '../index.js';
import { DocumentClient as docClient } from './bootstrap.test.js';
import assert from 'assert';
const TestTable = new Table({
    name: 'test-table',
    alias: 'testTable',
    partitionKey: 'pk',
    sortKey: 'sk',
    indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
    DocumentClient: docClient
});
const TestEntity = new Entity({
    name: 'TestEntity',
    autoExecute: false,
    attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string'
    },
    table: TestTable
});
describe('batchWrite', () => {
    it('fails when batchWrite is empty', () => {
        expect(() => {
            // @ts-expect-error
            TestTable.batchWriteParams();
        }).toThrow(`No items supplied`);
    });
    it('fails when batchWrite items is an empty array', () => {
        expect(() => {
            TestTable.batchWriteParams([]);
        }).toThrow(`No items supplied`);
    });
    it('batchWrites data to a single table', () => {
        var _a, _b, _c, _d;
        const result = TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }));
        assert.ok(((_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.RequestItems) === null || _a === void 0 ? void 0 : _a['test-table']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.PutRequest) === null || _d === void 0 ? void 0 : _d.Item) !== undefined, 'PutRequest.Item is undefined');
        expect(result.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test');
        expect(result.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk');
        expect(result.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test');
    });
    it('fails when extra options', () => {
        expect(() => {
            TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk' }), 
            // @ts-expect-error
            { invalid: true });
        }).toThrow(`Invalid batchWrite options: invalid`);
    });
    it('fails when providing an invalid capacity setting', () => {
        expect(() => {
            TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk' }), {
                // @ts-expect-error
                capacity: 'test'
            });
        }).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
    });
    it('fails when providing an invalid metrics setting', () => {
        expect(() => {
            TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk' }), {
                // @ts-expect-error
                metrics: 'test'
            });
        }).toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`);
    });
    it('batchWrites data to a single table with options', () => {
        var _a, _b, _c, _d;
        const result = TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }), { capacity: 'total', metrics: 'size' });
        expect(result.ReturnConsumedCapacity).toBe('TOTAL');
        expect(result.ReturnItemCollectionMetrics).toBe('SIZE');
        expect((_d = (_c = (_b = (_a = result.RequestItems) === null || _a === void 0 ? void 0 : _a['test-table']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.PutRequest) === null || _d === void 0 ? void 0 : _d.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk',
            test: 'test'
        }));
    });
    it('batchWrites data to a single table with invalid params', () => {
        var _a, _b, _c, _d;
        const result = TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }), {}, 
        // @ts-expect-error
        'test');
        expect((_d = (_c = (_b = (_a = result.RequestItems) === null || _a === void 0 ? void 0 : _a['test-table']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.PutRequest) === null || _d === void 0 ? void 0 : _d.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk',
            test: 'test'
        }));
    });
    it('returns meta data', () => {
        var _a, _b, _c, _d;
        const result = TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }), {}, {}, true);
        expect(result).toHaveProperty('Tables');
        expect((_d = (_c = (_b = (_a = result.payload.RequestItems) === null || _a === void 0 ? void 0 : _a['test-table']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.PutRequest) === null || _d === void 0 ? void 0 : _d.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk',
            test: 'test'
        }));
    });
    it('batchWrites data to a single table with multiple items', () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const result = TestTable.batchWriteParams([
            TestEntity.putBatch({ email: 'test', sort: 'testsk1', test: 'test1' }),
            TestEntity.putBatch({ email: 'test', sort: 'testsk2', test: 'test2' }),
            TestEntity.deleteBatch({ email: 'test', sort: 'testsk3' })
        ]);
        expect((_d = (_c = (_b = (_a = result.RequestItems) === null || _a === void 0 ? void 0 : _a['test-table']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.PutRequest) === null || _d === void 0 ? void 0 : _d.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk1',
            test: 'test1'
        }));
        expect((_h = (_g = (_f = (_e = result.RequestItems) === null || _e === void 0 ? void 0 : _e['test-table']) === null || _f === void 0 ? void 0 : _f[1]) === null || _g === void 0 ? void 0 : _g.PutRequest) === null || _h === void 0 ? void 0 : _h.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk2',
            test: 'test2'
        }));
        expect((_m = (_l = (_k = (_j = result.RequestItems) === null || _j === void 0 ? void 0 : _j['test-table']) === null || _k === void 0 ? void 0 : _k[2]) === null || _l === void 0 ? void 0 : _l.DeleteRequest) === null || _m === void 0 ? void 0 : _m.Key).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk3'
        }));
    });
    it('batchWrites data to multiple tables', () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const TestTable2 = new Table({
            name: 'test-table2',
            alias: 'testTable2',
            partitionKey: 'pk',
            sortKey: 'sk',
            indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
            DocumentClient: docClient
        });
        const TestEntity2 = new Entity({
            name: 'TestEntity2',
            autoExecute: false,
            attributes: {
                email: { type: 'string', partitionKey: true },
                sort: { type: 'string', sortKey: true },
                test: 'string'
            },
            table: TestTable2
        });
        const result = TestTable.batchWriteParams([
            TestEntity.putBatch({ email: 'test', sort: 'testsk1', test: 'test1' }),
            TestEntity.putBatch({ email: 'test', sort: 'testsk2', test: 'test2' }),
            TestEntity2.putBatch({ email: 'test', sort: 'testsk3', test: 'test3' })
        ]);
        expect((_d = (_c = (_b = (_a = result.RequestItems) === null || _a === void 0 ? void 0 : _a['test-table']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.PutRequest) === null || _d === void 0 ? void 0 : _d.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk1',
            test: 'test1'
        }));
        expect((_h = (_g = (_f = (_e = result.RequestItems) === null || _e === void 0 ? void 0 : _e['test-table']) === null || _f === void 0 ? void 0 : _f[1]) === null || _g === void 0 ? void 0 : _g.PutRequest) === null || _h === void 0 ? void 0 : _h.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk2',
            test: 'test2'
        }));
        expect((_m = (_l = (_k = (_j = result.RequestItems) === null || _j === void 0 ? void 0 : _j['test-table2']) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.PutRequest) === null || _m === void 0 ? void 0 : _m.Item).toEqual(expect.objectContaining({
            pk: 'test',
            sk: 'testsk3',
            test: 'test3'
        }));
    });
});
