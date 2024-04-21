import parseAttributes from './parseTableAttributes.js';
import { error, hasValue } from './utils.js';
// Parse table
export const parseTable = (table) => {
    let { name, // Table name
    alias, // For batch references
    partitionKey, sortKey, entityField, attributes, indexes, 
    // eslint-disable-next-line prefer-const
    autoExecute, 
    // eslint-disable-next-line prefer-const
    autoParse, 
    // eslint-disable-next-line prefer-const
    removeNullAttributes, 
    // eslint-disable-next-line prefer-const
    entities, 
    // eslint-disable-next-line prefer-const
    DocumentClient, 
    // eslint-disable-next-line prefer-const
    ...args // extraneous config
     } = table;
    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
        error(`Invalid Table configuration options: ${Object.keys(args).join(', ')}`);
    // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
    // Table name
    name = (typeof name === 'string' && name.trim().length > 0
        ? name.trim()
        : error(`'name' must be defined`));
    // Verify alias
    alias =
        typeof alias === 'string' && alias.trim().length > 0
            ? alias.trim()
            : alias
                ? error(`'alias' must be a string value`)
                : null;
    // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
    // Specify partitionKey attribute
    partitionKey = (typeof partitionKey === 'string' && partitionKey.trim().length > 0
        ? partitionKey.trim()
        : error(`'partitionKey' must be defined`));
    // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
    // Specify sortKey attribute (optional)
    sortKey = (typeof sortKey === 'string' && sortKey.trim().length > 0
        ? sortKey.trim()
        : sortKey
            ? error(`'sortKey' must be a string value`)
            : null);
    // Disable, or rename field for entity tracking
    entityField =
        entityField === false
            ? false
            : typeof entityField === 'string' && entityField.trim().length > 0
                ? entityField.trim()
                : '_et';
    // Parse table attributes
    attributes =
        hasValue(attributes) && (attributes === null || attributes === void 0 ? void 0 : attributes.constructor) === Object
            ? attributes
            : attributes
                ? error(`Please provide a valid 'attributes' object`)
                : {};
    // Add entityField to attributes
    if (entityField)
        attributes[entityField] = 'string';
    // Parse indexes (optional)
    indexes =
        hasValue(indexes) && (indexes === null || indexes === void 0 ? void 0 : indexes.constructor) === Object
            ? // 🔨 TOIMPROVE: Allow numbers & symbols in parseIndexes ?
                parseIndexes(indexes, partitionKey)
            : indexes
                ? error(`Please provide a valid 'indexes' object`)
                : {};
    // Return the table
    return Object.assign({
        name,
        alias,
        Table: {
            partitionKey,
            sortKey,
            entityField,
            // 🔨 TOIMPROVE: Allow numbers & symbols in parseAttributes ?
            attributes: parseAttributes(attributes, partitionKey, sortKey),
            indexes
        },
        autoExecute,
        autoParse,
        removeNullAttributes,
        _entities: []
    }, DocumentClient ? { DocumentClient } : {}, entities ? { entities } : {});
};
// Parse Indexes
const parseIndexes = (indexes, pk) => Object.keys(indexes).reduce((acc, index) => {
    // TODO: indexes can not be named TABLE
    // Destructure the index
    const { partitionKey, sortKey, ...args } = indexes[index];
    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
        error(`Invalid index options: ${Object.keys(args).join(', ')}`);
    // Verify partitionKey
    if (partitionKey && typeof partitionKey !== 'string')
        error(`'partitionKey' for ${index} must be a string`);
    // Verify sortKey
    if (sortKey && typeof sortKey !== 'string')
        error(`'sortKey' for ${index} must be a string`);
    // Verify the presences of either pk or sk
    if (!sortKey && !partitionKey)
        error(`A 'partitionKey', 'sortKey' or both, must be provided for ${index}`);
    // Guess index type
    const type = !partitionKey || partitionKey === pk ? 'LSI' : 'GSI';
    // Return the structured index object
    return Object.assign(acc, {
        [index]: Object.assign({}, partitionKey && type === 'GSI' ? { partitionKey } : {}, sortKey ? { sortKey } : {}, { type })
    });
}, {});
export default parseTable;
