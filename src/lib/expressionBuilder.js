/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import checkAttribute from './checkAttribute.js';
import { error, toDynamoBigInt } from './utils.js';
export const SUPPORTED_FILTER_EXP_ATTR_REF_OPERATORS = ['eq', 'ne', 'lt', 'lte', 'gt', 'gte'];
const toDynamoValue = (value) => {
    if (typeof value === 'bigint') {
        return toDynamoBigInt(value);
    }
    return value;
};
const buildExpression = (exp, table, entity, group = 0, level = 0) => {
    // Coerce to array if not already
    const clauses = Array.isArray(exp) ? exp : [exp];
    let expression = '';
    let names = {};
    let values = {};
    let logic; // init undefined at each level
    // group logic tracker - need to mark the first clause
    // Loop through the clauses
    clauses.forEach((_, id) => {
        // If clause is nested in an array
        if (Array.isArray(clauses[id])) {
            // Build the sub clause
            const sub = buildExpression(clauses[id], table, entity, group, level);
            // If no logic at this level, capture from sub clause
            logic = logic ? logic : sub.logic;
            // Concat to expression and merge names and values
            expression += `${id > 0 ? ` ${sub.logic} ` : ''}(${sub.expression})`;
            names = Object.assign(names, sub.names);
            values = Object.assign(values, sub.values);
            group = sub.group;
            // Else process the clause
        }
        else {
            // Make sure TS knows this is a FilterExpression; copy to avoid mutation
            const exp = { ...clauses[id] };
            // Increment group counter for each clause
            group++; // guarantees uniqueness
            // Default entity reference
            if (entity && !exp.entity)
                exp.entity = entity;
            // Parse the clause
            const clause = parseClause(exp, group, table);
            // Concat to expression and merge names and values
            expression += `${id > 0 ? ` ${clause.logic} ` : ''}${clause.clause}`;
            names = Object.assign(names, clause.names);
            values = Object.assign(values, clause.values);
            // Capture the first logic indicator at this level
            logic = logic ? logic : clause.logic;
        }
    });
    return {
        logic,
        expression,
        names,
        values,
        group
    };
};
// Export buildExpression
export default buildExpression;
// Define condition expression error
const conditionError = (op) => error(`You can only supply one filter condition per query. Already using '${op}'`);
// Parses expression clause and returns structured clause object
const parseClause = (_clause, grp, table) => {
    if (!table) {
        throw new Error(`'table' should be defined`);
    }
    // Init clause, names, and values
    let clause = '';
    const names = {};
    const values = {};
    // Deconstruct valid expression options
    const { attr, // attribute
    size, // wraps attr in size()
    negate, // negates expression
    or, // change logical evaluator to OR
    eq, // =
    ne, // <>
    in: _in, // IN
    lt, // <
    lte, // <=
    gt, // >
    gte, // >=
    between, // BETWEEN
    exists, // NULL and NOT_NULL
    contains, // CONTAINS
    beginsWith, // BEGINS_WITH
    type, // checks attribute_type
    entity, // optional entity reference for aliasing
    ...args } = _clause;
    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
        error(`Invalid expression options: ${Object.keys(args).join(', ')}`);
    // Verify entity
    if (entity !== undefined &&
        (typeof entity !== 'string' ||
            !table[entity] ||
            !table[entity].schema ||
            !table[entity].schema.attributes))
        error(`'entity' value of '${entity}' must be a string and a valid table Entity name`);
    const path = typeof attr === 'string'
        ? checkAttribute(attr, entity ? table[entity].schema.attributes : table.Table.attributes)
        : typeof size === 'string'
            ? checkAttribute(size, entity ? table[entity].schema.attributes : table.Table.attributes)
            : error(`A string for 'attr' or 'size' is required for condition expressions`);
    const pathParts = path.split('.');
    if (pathParts.length === 1) {
        names[`#attr${grp}`] = pathParts[0];
    }
    else {
        pathParts.forEach((part, i) => (names[`#attr${grp}_${i}`] = part));
    }
    const operand = Object.keys(names).join('.');
    // Parse clause operator and value
    let operator, value, filterType;
    if (eq !== undefined) {
        value = eq;
        filterType = 'eq';
        operator = '=';
    }
    if (ne !== undefined) {
        value = value ? conditionError(filterType) : ne;
        filterType = 'ne';
        operator = '<>';
    }
    if (_in) {
        value = value ? conditionError(filterType) : _in;
        filterType = 'in';
        operator = 'IN';
    }
    if (lt !== undefined) {
        value = value ? conditionError(filterType) : lt;
        filterType = 'lt';
        operator = '<';
    }
    if (lte !== undefined) {
        value = value ? conditionError(filterType) : lte;
        filterType = 'lte';
        operator = '<=';
    }
    if (gt !== undefined) {
        value = value ? conditionError(filterType) : gt;
        filterType = 'gt';
        operator = '>';
    }
    if (gte !== undefined) {
        value = value ? conditionError(filterType) : gte;
        filterType = 'gte';
        operator = '>=';
    }
    if (between) {
        value = value ? conditionError(filterType) : between;
        filterType = 'between';
        operator = 'BETWEEN';
    }
    if (exists !== undefined) {
        value = value ? conditionError(filterType) : exists;
        filterType = 'exists';
        operator = 'EXISTS';
    }
    if (contains) {
        value = value ? conditionError(filterType) : contains;
        filterType = 'contains';
        operator = 'CONTAINS';
    }
    if (beginsWith) {
        value = value ? conditionError(filterType) : beginsWith;
        filterType = 'beginsWith';
        operator = 'BEGINS_WITH';
    }
    if (type) {
        value = value ? conditionError(filterType) : type;
        filterType = 'type';
        operator = 'ATTRIBUTE_TYPE';
    }
    // If a operator was set
    if (operator && filterType) {
        // If begins_with
        if (operator === 'BETWEEN') {
            // Verify array input
            if (Array.isArray(value) && value.length === 2) {
                // Add values and special key condition
                values[`:attr${grp}_0`] = toDynamoValue(value[0]);
                values[`:attr${grp}_1`] = toDynamoValue(value[1]);
                clause = `${size ? `size(${operand})` : operand} between :attr${grp}_0 and :attr${grp}_1`;
            }
            else {
                error(`'between' conditions require an array with two values.`);
            }
        }
        else if (operator === 'IN') {
            if (!attr)
                error(`'in' conditions require an 'attr'.`);
            // Verify array input
            if (Array.isArray(value)) {
                // Add values and special key condition
                clause = `${operand} IN (${value
                    .map((x, i) => {
                    values[`:attr${grp}_${i}`] = toDynamoValue(x);
                    return `:attr${grp}_${i}`;
                })
                    .join(',')})`;
            }
            else {
                error(`'in' conditions require an array.`);
            }
        }
        else if (operator === 'EXISTS') {
            if (!attr)
                error(`'exists' conditions require an 'attr'.`);
            clause = value ? `attribute_exists(${operand})` : `attribute_not_exists(${operand})`;
        }
        else if (value && typeof value === 'object') {
            const ref = value;
            if (!SUPPORTED_FILTER_EXP_ATTR_REF_OPERATORS.includes(filterType))
                error(`AttrRef is only supported for the following operators: ${SUPPORTED_FILTER_EXP_ATTR_REF_OPERATORS.join(', ')}.`);
            if (typeof (ref === null || ref === void 0 ? void 0 : ref.attr) !== 'string' || !(ref === null || ref === void 0 ? void 0 : ref.attr))
                error(`AttrRef must have an attr field which references another attribute in the same entity.`);
            names[`#attr${grp}_ref`] = checkAttribute(ref.attr, entity ? table[entity].schema.attributes : table.Table.attributes);
            clause = `${operand} ${operator} #attr${grp}_ref`;
        }
        else {
            // Add value
            values[`:attr${grp}`] = toDynamoValue(value);
            // If begins_with, add special key condition
            if (operator === 'BEGINS_WITH') {
                if (!attr)
                    error(`'beginsWith' conditions require an 'attr'.`);
                clause = `begins_with(${operand},:attr${grp})`;
            }
            else if (operator === 'CONTAINS') {
                if (!attr)
                    error(`'contains' conditions require an 'attr'.`);
                clause = `contains(${operand},:attr${grp})`;
            }
            else if (operator === 'ATTRIBUTE_TYPE') {
                if (!attr)
                    error(`'type' conditions require an 'attr'.`);
                // TODO: validate/convert types
                clause = `attribute_type(${operand},:attr${grp})`;
            }
            else {
                clause = `${size ? `size(${operand})` : operand} ${operator} :attr${grp}`;
            }
        }
        // Negate the clause
        if (negate) {
            clause = `(NOT ${clause})`;
        }
    }
    else {
        error('A condition is required');
    }
    return {
        logic: or ? 'OR' : 'AND',
        clause,
        names,
        values
    };
};
