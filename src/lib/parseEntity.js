import parseEntityAttributes from './parseEntityAttributes.js';
import { error } from './utils.js';
// Parse entity
export function parseEntity(entity) {
    let { name, timestamps, created, createdAlias, modified, modifiedAlias, typeAlias, typeHidden, attributes, 
    // eslint-disable-next-line prefer-const
    autoExecute, 
    // eslint-disable-next-line prefer-const
    autoParse, 
    // eslint-disable-next-line prefer-const
    table, 
    // eslint-disable-next-line prefer-const
    ...args // extraneous config
     } = entity;
    // TODO: verify string types (e.g. created)
    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
        error(`Invalid Entity configuration options: ${Object.keys(args).join(', ')}`);
    // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
    // Entity name
    name = (typeof name === 'string' && name.trim().length > 0
        ? name.trim()
        : error(`'name' must be defined`));
    // 🔨 TOIMPROVE: Use default option & simply throw if type is incorrect
    // Enable created/modified timestamps on items
    timestamps = (typeof timestamps === 'boolean' ? timestamps : true);
    // Define 'created' attribute name
    created = typeof created === 'string' && created.trim().length > 0 ? created.trim() : '_ct';
    // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
    // Define 'createdAlias'
    createdAlias = (typeof createdAlias === 'string' && createdAlias.trim().length > 0
        ? createdAlias.trim()
        : 'created');
    // Define 'modified' attribute anme
    modified = typeof modified === 'string' && modified.trim().length > 0 ? modified.trim() : '_md';
    // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
    // Define 'modifiedAlias'
    modifiedAlias = (typeof modifiedAlias === 'string' && modifiedAlias.trim().length > 0
        ? modifiedAlias.trim()
        : 'modified');
    // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
    // Define 'entityAlias'
    typeAlias = (typeof typeAlias === 'string' && typeAlias.trim().length > 0
        ? typeAlias.trim()
        : 'entity');
    typeHidden = (typeof typeHidden === 'boolean' ? typeHidden : false);
    // Sanity check the attributes
    attributes =
        (attributes === null || attributes === void 0 ? void 0 : attributes.constructor) === Object
            ? attributes
            : error(`Please provide a valid 'attributes' object`);
    // Add timestamps
    if (timestamps) {
        attributes[created] = {
            type: 'string',
            alias: createdAlias,
            default: () => new Date().toISOString()
        };
        attributes[modified] = {
            type: 'string',
            alias: modifiedAlias,
            default: () => new Date().toISOString(),
            onUpdate: true
        };
    }
    // Tracking info
    const track = {
        fields: Object.keys(attributes),
        defaults: {},
        required: {},
        linked: {},
        keys: {} // tracks partition/sort/index keys
    };
    const schema = parseEntityAttributes(attributes, track); // removed nested attribute?
    // Safety check for bigint users, to avoid losing precision
    if (table && table.DocumentClient) {
        Object.keys(schema.attributes).forEach((field) => {
            var _a, _b, _c, _d;
            const config = schema.attributes[field];
            if (config.type && config.type === 'bigint' || config.setType && config.setType === 'bigint') {
                // Verify DocumentClient has wrapNumbers set to true
                if (((_d = (_c = (_b = (_a = table === null || table === void 0 ? void 0 : table.DocumentClient) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.translateConfig) === null || _c === void 0 ? void 0 : _c.unmarshallOptions) === null || _d === void 0 ? void 0 : _d.wrapNumbers) !== true) {
                    error('Please set `wrapNumbers: true` in your DocumentClient to avoid losing precision with bigint fields');
                }
            }
        });
    }
    return {
        name,
        schema,
        defaults: track.defaults,
        required: track.required,
        linked: track.linked,
        autoExecute,
        autoParse,
        typeHidden,
        _etAlias: typeAlias,
        ...(table ? { table } : {})
    };
}
export default parseEntity;
