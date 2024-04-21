import { Table, Entity } from '../index.js';
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
describe('transactWrite', () => {
    it('fails when transactWrite is empty', () => {
        expect(() => {
            // @ts-expect-error
            TestTable.transactWriteParams();
        }).toThrow(`No items supplied`);
    });
    it('fails when transactWrite items is an empty array', () => {
        expect(() => {
            TestTable.transactWriteParams([]);
        }).toThrow(`No items supplied`);
    });
    it('transactWrite put, update, delete data', () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const result = TestTable.transactWriteParams([
            TestEntity.putTransaction({ email: 'test', sort: 'testsk1', test: 'test' }),
            TestEntity.updateTransaction({ email: 'test', sort: 'testsk2', test: 'test' }),
            TestEntity.deleteTransaction({ email: 'test', sort: 'testsk3' })
        ]);
        assert.ok(result.TransactItems !== undefined, 'result is undefined');
        expect((_c = (_b = (_a = result.TransactItems[0]) === null || _a === void 0 ? void 0 : _a.Put) === null || _b === void 0 ? void 0 : _b.Item) === null || _c === void 0 ? void 0 : _c.sk).toBe('testsk1');
        expect((_e = (_d = result.TransactItems[1]) === null || _d === void 0 ? void 0 : _d.Update) === null || _e === void 0 ? void 0 : _e.UpdateExpression).toBe('SET #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test = :test');
        expect((_h = (_g = (_f = result.TransactItems[2]) === null || _f === void 0 ? void 0 : _f.Delete) === null || _g === void 0 ? void 0 : _g.Key) === null || _h === void 0 ? void 0 : _h.sk).toBe('testsk3');
    });
    it('fails when extra options', () => {
        expect(() => {
            TestTable.transactWriteParams([TestEntity.putTransaction({ email: 'test', sort: 'testsk' })], 
            // @ts-expect-error
            { invalid: true });
        }).toThrow(`Invalid transactWrite options: invalid`);
    });
    it('fails when providing an invalid capacity setting', () => {
        expect(() => {
            TestTable.transactWriteParams([TestEntity.putTransaction({ email: 'test', sort: 'testsk' })], 
            // @ts-expect-error
            { capacity: 'test' });
        }).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
    });
    it('fails when providing an invalid metrics setting', () => {
        expect(() => {
            TestTable.transactWriteParams([TestEntity.putTransaction({ email: 'test', sort: 'testsk' })], 
            // @ts-expect-error
            { metrics: 'test' });
        }).toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`);
    });
    it('allows to provide custom params', () => {
        const result = TestTable.transactWriteParams([TestEntity.putTransaction({ email: 'test', sort: 'testsk' })], {
            token: 'some-token'
        }, {
            ClientRequestToken: 'some-custom-token'
        });
        expect(result.ClientRequestToken).toBe('some-custom-token');
    });
});
