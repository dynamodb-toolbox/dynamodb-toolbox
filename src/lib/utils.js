import { unmarshall } from '@aws-sdk/util-dynamodb';
export const validTypes = [
    'string',
    'boolean',
    'number',
    'bigint',
    'list',
    'map',
    'binary',
    'set'
];
export const validKeyTypes = ['string', 'number', 'bigint', 'binary'];
export const isDynamoDbType = (value) => validTypes.includes(value);
export const isDynamoDbKeyType = (value) => validKeyTypes.includes(value);
// Boolean conversion
export const toBool = (val) => typeof val === 'boolean'
    ? val
    : ['false', '0', 'no'].includes(String(val).toLowerCase())
        ? false
        : Boolean(val);
export const toDynamoBigInt = (value) => unmarshall({ valueToUnmarshall: { N: value.toString() } }, { wrapNumbers: true }).valueToUnmarshall.value;
// has value shortcut
export const hasValue = (val) => val !== undefined && val !== null;
// isEmpty object shortcut
export const isEmpty = (val) => val === undefined || (typeof val === 'object' && Object.keys(val).length === 0);
// Inline error handler
export const error = (err) => {
    throw new Error(err);
};
// Standard type error
export const typeError = (field) => {
    error(`Invalid or missing type for '${field}'. ` +
        `Valid types are '${validTypes.slice(0, -1).join(`', '`)}',` +
        ` and '${validTypes.slice(-1)}'.`);
};
// Key type error
export const keyTypeError = (field) => {
    error(`Invalid or missing type for '${field}'. ` +
        `Valid types for partitionKey and sortKey are 'string','number' and 'binary'`);
};
// Condition error
export const conditionError = (op) => error(`You can only supply one sortKey condition per query. Already using '${op}'`);
// Transform attribute values
export const transformAttr = (mapping, value, data) => {
    value = mapping.transform ? mapping.transform(value, data) : value;
    return mapping.prefix || mapping.suffix
        ? `${mapping.prefix || ''}${value}${mapping.suffix || ''}`
        : value;
};
export function typeOf(data) {
    if (data === null && typeof data === 'object') {
        return 'null';
    }
    else if (data !== undefined && isBinary(data)) {
        return 'Binary';
    }
    else if (data !== undefined && data.constructor) {
        return data.constructor.name.toLowerCase();
    }
    else if (data !== undefined && typeof data === 'object') {
        // this object is the result of Object.create(null), hence the absence of a
        // defined constructor
        return 'Object';
    }
    else {
        return 'undefined';
    }
}
export function isArrayOfSameType(array) {
    const length = array.length;
    if (length <= 1) {
        return true;
    }
    const firstType = typeOf(array[0]);
    return array.slice(1).every((el) => typeOf(el) === firstType);
}
export function isBinary(data) {
    const binaryTypes = [
        'ArrayBuffer',
        'Blob',
        'Buffer',
        'DataView',
        'File',
        'Int8Array',
        'Uint8Array',
        'Uint8ClampedArray',
        'Int16Array',
        'Uint16Array',
        'Int32Array',
        'Uint32Array',
        'Float32Array',
        'Float64Array',
        'BigInt64Array',
        'BigUint64Array',
    ];
    if (data === null || data === void 0 ? void 0 : data.constructor) {
        return binaryTypes.includes(data.constructor.name);
    }
    return false;
}
