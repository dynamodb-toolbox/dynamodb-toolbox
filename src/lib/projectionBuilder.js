/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { error } from './utils.js';
import checkAttribute from './checkAttribute.js';
const projectionBuilder = (attributes, table, entity, type = false) => {
    // Create an attribute names counter
    let index = 0;
    // If attributes isn't an array, make it one
    const attrs = Array.isArray(attributes)
        ? attributes
        : // support simple string list
            typeof attributes === 'string'
                ? attributes.split(',').map(x => x.trim())
                : [attributes];
    // Check that table is valid and contains attributes
    if (!table || !table.Table || Object.keys(table.Table.attributes).length == 0) {
        throw new Error('Tables must be valid and contain attributes');
    }
    // Add entityField if exists
    if (type && table.Table.entityField)
        attrs.push(table.Table.entityField);
    // Default collectors
    const names = {};
    const tableAttrs = [];
    const entities = {};
    // Loop through the attributes and add to the map
    for (const attribute of attrs) {
        // If a string
        if (typeof attribute === 'string') {
            // Check single attribute and merge results
            const attr = checkAttribute(attribute, entity ? table[entity].schema.attributes : table.Table.attributes);
            if (!Object.values(names).includes(attr)) {
                names[`#proj${++index}`] = attr;
                tableAttrs.push(attribute);
            }
        }
        else if (typeof attribute === 'object') {
            // If an object, loop through keys
            for (const entity in attribute) {
                // Check that the entity name exists
                if (table[entity]) {
                    // Track entity attributes
                    if (!entities[entity])
                        entities[entity] = [];
                    // If attributes isn't an array, make it one
                    const ent_attrs = Array.isArray(attribute[entity])
                        ? attribute[entity]
                        : // support simple string list
                            typeof attribute[entity] === 'string'
                                ? String(attribute[entity])
                                    .split(',')
                                    .map(x => x.trim())
                                : error(`Only arrays or strings are supported`);
                    // Loop entity projections
                    for (const ent_attribute of ent_attrs) {
                        // Check for string type
                        if (typeof ent_attribute != 'string')
                            error(`Entity projections must be string values`);
                        // Check the attribute and merge results
                        const attr = checkAttribute(ent_attribute, table[entity].schema.attributes);
                        if (!Object.values(names).includes(attr)) {
                            names[`#proj${++index}`] = attr;
                        }
                        entities[entity].push(attr);
                    }
                }
                else {
                    error(`'${entity}' is not a valid entity on this table`);
                }
            }
            // Throw error if invalid type
        }
        else {
            error(`'${typeof attribute}' is an invalid type. Projections require strings or arrays`);
        }
    }
    return {
        names,
        projections: Object.keys(names).join(','),
        entities: Object.keys(entities).reduce((acc, ent) => {
            return Object.assign(acc, { [ent]: [...new Set([...entities[ent], ...tableAttrs])] });
        }, {}),
        tableAttrs
    };
};
export default projectionBuilder;
