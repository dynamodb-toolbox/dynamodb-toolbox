/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { toBool, hasValue, error, toDynamoBigInt, typeOf, isArrayOfSameType } from './utils.js';
// Performs type validation/coercion
export default () => (mapping, field, value) => {
    // Evaluate function expressions
    // TODO: should this happen here?
    // let value = typeof input === 'function' ? input(data) : input
    var _a, _b, _c, _d;
    // return if undefined or null
    if (!hasValue(value))
        return value;
    switch (mapping.type) {
        case 'string':
            return typeof value === 'string' || mapping.coerce
                ? String(value)
                : error(`'${field}' must be of type string`);
        case 'boolean':
            return typeof value === 'boolean' || mapping.coerce
                ? toBool(value)
                : error(`'${field}' must be of type boolean`);
        case 'number': {
            if (typeof value === 'number') {
                return Number.isFinite(value) ? value : error(`'${field}' must be a finite number`);
            }
            if (!mapping.coerce) {
                return error(`'${field}' must be of type number`);
            }
            const coercedValue = Number(value);
            return typeof value === 'string' && Number.isFinite(coercedValue) && value.length > 0
                ? coercedValue
                : error(`Could not convert '${Array.isArray(value) ? `[${value}]` : value}' to a number for '${field}'`);
        }
        case 'bigint':
            return toDynamoBigInt(typeof value === 'bigint' || mapping.coerce
                ? BigInt(value)
                : error(`'${field}' must be of type bigint`));
        case 'list':
            return Array.isArray(value)
                ? value
                : mapping.coerce
                    ? String(value)
                        .split(',')
                        .map(x => x.trim())
                    : error(`'${field}' must be a list (array)`);
        case 'map':
            return (value === null || value === void 0 ? void 0 : value.constructor) === Object ? value : error(`'${field}' must be a map (object)`);
        case 'set':
            if (value instanceof Set) {
                if (mapping.setType === 'bigint') {
                    value = Array.from(value).map((n) => toDynamoBigInt(n));
                }
                return (!mapping.setType ||
                    value.size === 0
                    || isArrayOfSameType([...value])
                    ? value
                    : error(`'${field}' must be a valid set containing only ${mapping.setType} types`));
            }
            else if (Array.isArray(value)) {
                const expectedSetType = (_b = (_a = mapping.setType) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a);
                const actualSetType = (_d = (_c = typeOf(value[0])) === null || _c === void 0 ? void 0 : _c.toLowerCase) === null || _d === void 0 ? void 0 : _d.call(_c);
                if (mapping.setType === 'bigint') {
                    value = value.map((n) => toDynamoBigInt(n));
                }
                return (!mapping.setType ||
                    value.length === 0 ||
                    (expectedSetType === actualSetType && isArrayOfSameType(value))
                    ? new Set(value)
                    : error(`'${field}' must be a valid set (array) containing only ${expectedSetType !== null && expectedSetType !== void 0 ? expectedSetType : actualSetType} types`));
            }
            else if (mapping.coerce) {
                if (value instanceof Set)
                    return value;
                const arrayVal = String(value)
                    .split(',')
                    .map((x) => x.trim());
                const expectedSetType = mapping.setType;
                const actualSetType = typeOf(arrayVal[0]);
                return (!mapping.setType ||
                    arrayVal.length === 0 ||
                    (expectedSetType === actualSetType && isArrayOfSameType(arrayVal))
                    ? new Set(arrayVal)
                    : error(`'${field}' must be a valid set (array) of type ${mapping.setType}`));
            }
            else {
                return error(`'${field}' must be a valid set (array)`);
            }
        default:
            // TODO: Binary validation
            return value;
    }
};
