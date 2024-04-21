import parseMapping from './parseMapping.js';
import parseCompositeKey from './parseCompositeKey.js';
import { error, typeError, validTypes, isDynamoDbType } from './utils.js';
const parseEntityAttributes = (attributes, track) => {
    // Parse attributes into standard format
    const parsedAttributes = Object.keys(attributes).reduce((acc, field) => {
        const attributeDefinition = attributes[field];
        // If a string value
        if (typeof attributeDefinition === 'string') {
            if (isDynamoDbType(attributeDefinition)) {
                // Merge and return mapping
                return Object.assign(acc, parseMapping(field, { type: attributeDefinition }, track));
            }
            else {
                // If invalid type, throw error
                typeError(field);
            }
        }
        // If an array
        if (Array.isArray(attributeDefinition)) {
            return Object.assign(acc, parseCompositeKey(field, 
            // 🔨 TOIMPROVE: Use typeguard
            attributes[field], track, attributes));
        }
        // If complex mapping
        // 🔨 TOIMPROVE: Use typeguard
        const fieldVal = attributes[field];
        // Default field to 'string'
        fieldVal.type = fieldVal.type || 'string';
        // If invalid type, throw error
        if (!validTypes.includes(fieldVal.type)) {
            typeError(field);
        }
        return Object.assign(acc, parseMapping(field, fieldVal, track));
    }, {});
    // Check that a partitionKey was defined (additional checks done when adding table)
    if (!track.keys.partitionKey)
        error('Entity requires a partitionKey attribute');
    // Return keys and attributes
    return {
        keys: track.keys,
        attributes: parsedAttributes
    };
};
export default parseEntityAttributes;
