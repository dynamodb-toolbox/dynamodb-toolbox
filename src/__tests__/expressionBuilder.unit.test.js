import Table from '../classes/Table/Table.js';
import Entity from '../classes/Entity/Entity.js';
import { default as expressionBuilder, SUPPORTED_FILTER_EXP_ATTR_REF_OPERATORS } from '../lib/expressionBuilder.js';
const TestTable = new Table({
    name: 'test-table',
    partitionKey: 'pk'
});
new Entity({
    name: 'TestEntity',
    attributes: {
        pk: { partitionKey: true },
        a: 'string',
        b: 'string',
        c: 'string',
        d: 'string',
        x: 'string',
        y: 'string'
    },
    table: TestTable
});
describe('expressionBuilder', () => {
    it('builds complex expression', () => {
        const nested_exp = [
            { attr: 'a', eq: 'b' },
            [{ attr: 'a', ne: 'b' }, { attr: 'a', exists: true }, [{ attr: 'a', between: ['b', 'c'] }]],
            [
                { attr: 'a', ne: 'b' },
                { attr: 'a', exists: true }
            ],
            [
                { attr: 'a', ne: 'b' },
                { attr: 'a', exists: true }
            ],
            { attr: 'd', eq: 'e' },
            [
                [
                    { or: false, attr: 'd', eq: 'e' },
                    { or: true, attr: 'y', eq: 'x' }
                ],
                [
                    { or: true, attr: 'a', eq: 'b' },
                    [
                        { or: false, attr: 'a', eq: 'b' },
                        { or: true, attr: 'a', eq: 'b', negate: true }
                    ]
                ],
                { or: true, attr: 'a', eq: 'b' },
                { or: true, attr: 'a', eq: 'b' }
            ]
        ];
        const result = expressionBuilder(nested_exp, TestTable, 'TestEntity');
        expect(result.names).toEqual({
            '#attr1': 'a',
            '#attr2': 'a',
            '#attr3': 'a',
            '#attr4': 'a',
            '#attr5': 'a',
            '#attr6': 'a',
            '#attr7': 'a',
            '#attr8': 'a',
            '#attr9': 'd',
            '#attr10': 'd',
            '#attr11': 'y',
            '#attr12': 'a',
            '#attr13': 'a',
            '#attr14': 'a',
            '#attr15': 'a',
            '#attr16': 'a'
        });
        expect(result.values).toEqual({
            ':attr1': 'b',
            ':attr2': 'b',
            ':attr4_0': 'b',
            ':attr4_1': 'c',
            ':attr5': 'b',
            ':attr7': 'b',
            ':attr9': 'e',
            ':attr10': 'e',
            ':attr11': 'x',
            ':attr12': 'b',
            ':attr13': 'b',
            ':attr14': 'b',
            ':attr15': 'b',
            ':attr16': 'b'
        });
        expect(result.expression).toBe('#attr1 = :attr1 AND (#attr2 <> :attr2 AND attribute_exists(#attr3) AND (#attr4 between :attr4_0 and :attr4_1)) AND (#attr5 <> :attr5 AND attribute_exists(#attr6)) AND (#attr7 <> :attr7 AND attribute_exists(#attr8)) AND #attr9 = :attr9 AND ((#attr10 = :attr10 OR #attr11 = :attr11) OR (#attr12 = :attr12 AND (#attr13 = :attr13 OR (NOT #attr14 = :attr14))) OR #attr15 = :attr15 OR #attr16 = :attr16)');
    });
    it('coerces expression input to array', () => {
        const result = expressionBuilder({ attr: 'a', eq: 'b' }, TestTable, 'TestEntity');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it('fail with conditional operator errors', () => {
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', ne: 'b' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', in: ['b'] }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', lt: 'b' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', lte: 'b' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', gt: 'b' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', gte: 'b' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', between: ['b', 'c'] }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', exists: false }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', contains: 'b' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', beginsWith: 'b' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
        expect(() => expressionBuilder({ attr: 'a', eq: 'b', type: 'string' }, TestTable, 'TestEntity')).toThrow(`You can only supply one filter condition per query. Already using 'eq'`);
    });
    it('fails with unknown arguments', () => {
        expect(() => 
        // @ts-expect-error
        expressionBuilder({ attr: 'a', eq: 'b', invalidArg: true }, TestTable, 'TestEntity')).toThrow(`Invalid expression options: invalidArg`);
    });
    it('fails with invalid entity', () => {
        expect(() => expressionBuilder({ attr: 'a', eq: 'b' }, TestTable, 'UnknownEntity')).toThrow(`'entity' value of 'UnknownEntity' must be a string and a valid table Entity name`);
    });
    it('fails when no attr or size argument', () => {
        expect(() => expressionBuilder({ eq: 'b' }, TestTable, 'TestEntity')).toThrow(`A string for 'attr' or 'size' is required for condition expressions`);
    });
    it('falls back to table attributes if no entity specified', () => {
        const result = expressionBuilder({ attr: 'a', eq: 'b' }, TestTable);
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it('uses size value and checks entity attribute', () => {
        const result = expressionBuilder({ size: 'a', eq: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('size(#attr1) = :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it('uses size value and checks nested entity attribute', () => {
        const result = expressionBuilder({ size: 'a.b.c', eq: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('size(#attr1_0.#attr1_1.#attr1_2) = :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it('uses size value and checks table attribute', () => {
        const result = expressionBuilder({ size: 'a', eq: 'b' }, TestTable);
        expect(result.expression).toBe('size(#attr1) = :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it('uses size value and checks nested table attribute', () => {
        const result = expressionBuilder({ size: 'a.b.c', eq: 'd' }, TestTable);
        expect(result.expression).toBe('size(#attr1_0.#attr1_1.#attr1_2) = :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates an 'eq' clause`, () => {
        const result = expressionBuilder({ attr: 'a', eq: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 = :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates an 'eq' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', eq: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 = :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates an 'eq' clause with null/false values`, () => {
        let result = expressionBuilder({ attr: 'a', eq: false }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 = :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': false });
        result = expressionBuilder({ attr: 'a', eq: null }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 = :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': null });
        result = expressionBuilder({ attr: 'a', eq: '' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 = :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': '' });
    });
    it(`generates a 'ne' clause`, () => {
        const result = expressionBuilder({ attr: 'a', ne: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 <> :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates a 'ne' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', ne: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 <> :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates an 'ne' clause with null/false values`, () => {
        let result = expressionBuilder({ attr: 'a', ne: false }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 <> :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': false });
        result = expressionBuilder({ attr: 'a', ne: null }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 <> :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': null });
        result = expressionBuilder({ attr: 'a', ne: '' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 <> :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': '' });
    });
    it(`generates an 'in' clause`, () => {
        const result = expressionBuilder({ attr: 'a', in: ['b', 'c'] }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 IN (:attr1_0,:attr1_1)');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1_0': 'b', ':attr1_1': 'c' });
    });
    it(`generates an 'in' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', in: ['d', 'e'] }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 IN (:attr1_0,:attr1_1)');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1_0': 'd', ':attr1_1': 'e' });
    });
    it(`generates a 'lt' clause`, () => {
        const result = expressionBuilder({ attr: 'a', lt: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 < :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates a 'lt' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', lt: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 < :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates a 'lte' clause`, () => {
        const result = expressionBuilder({ attr: 'a', lte: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 <= :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates a 'lte' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', lte: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 <= :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates a 'gt' clause`, () => {
        const result = expressionBuilder({ attr: 'a', gt: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 > :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates a 'gt' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', gt: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 > :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates a 'gte' clause`, () => {
        const result = expressionBuilder({ attr: 'a', gte: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 >= :attr1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates a 'gte' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', gte: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 >= :attr1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates a 'between' clause`, () => {
        const result = expressionBuilder({ attr: 'a', between: ['b', 'c'] }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 between :attr1_0 and :attr1_1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1_0': 'b', ':attr1_1': 'c' });
    });
    it(`generates a 'between' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', between: ['d', 'e'] }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1_0.#attr1_1.#attr1_2 between :attr1_0 and :attr1_1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1_0': 'd', ':attr1_1': 'e' });
    });
    it(`generates a 'between' clause with 'size'`, () => {
        const result = expressionBuilder({ size: 'a', between: ['b', 'c'] }, TestTable, 'TestEntity');
        expect(result.expression).toBe('size(#attr1) between :attr1_0 and :attr1_1');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1_0': 'b', ':attr1_1': 'c' });
    });
    it(`generates a 'between' clause with 'size' for a nested attribute`, () => {
        const result = expressionBuilder({ size: 'a.b.c', between: ['d', 'e'] }, TestTable, 'TestEntity');
        expect(result.expression).toBe('size(#attr1_0.#attr1_1.#attr1_2) between :attr1_0 and :attr1_1');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1_0': 'd', ':attr1_1': 'e' });
    });
    it(`generates an 'exists' clause`, () => {
        const result = expressionBuilder({ attr: 'a', exists: true }, TestTable, 'TestEntity');
        expect(result.expression).toBe('attribute_exists(#attr1)');
        expect(result.names).toEqual({ '#attr1': 'a' });
    });
    it(`generates an 'exists' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', exists: true }, TestTable, 'TestEntity');
        expect(result.expression).toBe('attribute_exists(#attr1_0.#attr1_1.#attr1_2)');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
    });
    it(`generates a 'not exists' clause`, () => {
        const result = expressionBuilder({ attr: 'a', exists: false }, TestTable, 'TestEntity');
        expect(result.expression).toBe('attribute_not_exists(#attr1)');
        expect(result.names).toEqual({ '#attr1': 'a' });
    });
    it(`generates an 'not exists' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', exists: false }, TestTable, 'TestEntity');
        expect(result.expression).toBe('attribute_not_exists(#attr1_0.#attr1_1.#attr1_2)');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
    });
    it(`generates a 'contains' clause`, () => {
        const result = expressionBuilder({ attr: 'a', contains: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('contains(#attr1,:attr1)');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates a 'beginsWith' clause`, () => {
        const result = expressionBuilder({ attr: 'a', beginsWith: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('begins_with(#attr1,:attr1)');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`generates a 'beginsWith' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', beginsWith: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('begins_with(#attr1_0.#attr1_1.#attr1_2,:attr1)');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`generates a 'type' clause`, () => {
        const result = expressionBuilder({ attr: 'a', type: 'b' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('attribute_type(#attr1,:attr1)');
        expect(result.names).toEqual({ '#attr1': 'a' });
        expect(result.values).toEqual({ ':attr1': 'b' });
    });
    it(`references a secondary attribute in an 'eq' clause`, () => {
        const result = expressionBuilder({ attr: 'a', eq: { attr: 'b' } }, TestTable, 'TestEntity');
        expect(result.expression).toBe('#attr1 = #attr1_ref');
        expect(result.names).toEqual({ '#attr1': 'a', '#attr1_ref': 'b' });
    });
    it(`generates a 'type' clause for a nested attribute`, () => {
        const result = expressionBuilder({ attr: 'a.b.c', type: 'd' }, TestTable, 'TestEntity');
        expect(result.expression).toBe('attribute_type(#attr1_0.#attr1_1.#attr1_2,:attr1)');
        expect(result.names).toEqual({ '#attr1_0': 'a', '#attr1_1': 'b', '#attr1_2': 'c' });
        expect(result.values).toEqual({ ':attr1': 'd' });
    });
    it(`fails when 'between' value is not an array`, () => {
        // @ts-expect-error
        expect(() => expressionBuilder({ attr: 'a', between: 'b' }, TestTable, 'TestEntity')).toThrow(`'between' conditions require an array with two values.`);
    });
    it(`fails when 'in' value is not an array`, () => {
        // @ts-expect-error
        expect(() => expressionBuilder({ attr: 'a', in: 'b' }, TestTable, 'TestEntity')).toThrow(`'in' conditions require an array.`);
    });
    it(`fails when 'in' clause doesn't have an attr`, () => {
        expect(() => expressionBuilder({ size: 'a', in: ['b'] }, TestTable, 'TestEntity')).toThrow(`'in' conditions require an 'attr'.`);
    });
    it(`fails when 'exists' clause doesn't have an attr`, () => {
        expect(() => expressionBuilder({ size: 'a', exists: true }, TestTable, 'TestEntity')).toThrow(`'exists' conditions require an 'attr'.`);
    });
    it(`fails when 'beginsWith' clause doesn't have an attr`, () => {
        expect(() => expressionBuilder({ size: 'a', beginsWith: 'b' }, TestTable, 'TestEntity')).toThrow(`'beginsWith' conditions require an 'attr'.`);
    });
    it(`fails when 'contains' clause doesn't have an attr`, () => {
        expect(() => expressionBuilder({ size: 'a', contains: 'b' }, TestTable, 'TestEntity')).toThrow(`'contains' conditions require an 'attr'.`);
    });
    it(`fails when 'type' clause doesn't have an attr`, () => {
        expect(() => expressionBuilder({ size: 'a', type: 'b' }, TestTable, 'TestEntity')).toThrow(`'type' conditions require an 'attr'.`);
    });
    it(`fails when 'value' type AttrRef is used without a property name`, () => {
        expect(() => expressionBuilder({ attr: 'a', eq: { attr: '' } }, TestTable, 'TestEntity')).toThrow(`AttrRef must have an attr field which references another attribute in the same entity.`);
    });
    it(`fails when 'value' type AttrRef is used with a non-existing property name`, () => {
        expect(() => expressionBuilder({ attr: 'a', eq: { attr: 'nonexistent' } }, TestTable, 'TestEntity')).toThrow('\'nonexistent\' is not a valid attribute within the given entity/table.');
    });
    it(`fails when 'value' type AttrRef is used with an unsupported operator`, () => {
        expect(() => 
        // @ts-expect-error
        expressionBuilder({ attr: 'a', beginsWith: { attr: 'some-attr' } }, TestTable, 'TestEntity')).toThrow(`AttrRef is only supported for the following operators: ${SUPPORTED_FILTER_EXP_ATTR_REF_OPERATORS.join(', ')}.`);
    });
    it(`fails when no condition is provided`, () => {
        expect(() => expressionBuilder({ attr: 'a' }, TestTable, 'TestEntity')).toThrow(`A condition is required`);
    });
    it('allows 0 in comparaison expression', () => {
        expect(() => expressionBuilder({ attr: 'a', lte: 0 }, TestTable, 'TestEntity')).not.toThrow(`A condition is required`);
        expect(() => expressionBuilder({ attr: 'a', lt: 0 }, TestTable, 'TestEntity')).not.toThrow(`A condition is required`);
        expect(() => expressionBuilder({ attr: 'a', gte: 0 }, TestTable, 'TestEntity')).not.toThrow(`A condition is required`);
        expect(() => expressionBuilder({ attr: 'a', gt: 0 }, TestTable, 'TestEntity')).not.toThrow(`A condition is required`);
    });
    it('doesn\'t mutate input expression', () => {
        const expObj = { attr: 'a', eq: 'b' };
        const expArr = [{ attr: 'a', eq: 'b' }];
        expressionBuilder(expObj, TestTable, 'TestEntity');
        expressionBuilder(expArr, TestTable, 'TestEntity');
        expect(expObj).toEqual({ attr: 'a', eq: 'b' });
        expect(expArr).toEqual([{ attr: 'a', eq: 'b' }]);
    });
});
