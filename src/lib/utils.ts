/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const validTypes = ['string','boolean','number','list','map','binary','set']

const validKeyTypes = ['string','number','binary']

// Boolean conversion
export const toBool = val =>
  typeof val === 'boolean' ? val
  : ['false','0','no'].includes(String(val).toLowerCase()) ? false
  : Boolean(val);

// has value shortcut
export const hasValue = val => val !== undefined && val !== null;

// Inline error handler
const error = err => { throw new Error(err) }
export { validTypes, validKeyTypes, error };

// Standard type error
export const typeError = field => {
  error(`Invalid or missing type for '${field}'. `
    + `Valid types are '${validTypes.slice(0,-1).join(`', '`)}',`
    + ` and '${validTypes.slice(-1)}'.`)
};

// Key type error
export const keyTypeError = field => {
  error(`Invalid or missing type for '${field}'. `
    + `Valid types for partitionKey and sortKey are 'string','number' and 'binary'`)
};

// Tranform atribute values
export const transformAttr = (mapping,value,data) => {  
  value = mapping.transform ? mapping.transform(value,data) : value
  return mapping.prefix || mapping.suffix ?
    `${mapping.prefix || ''}${value}${mapping.suffix || ''}`
    : value
};