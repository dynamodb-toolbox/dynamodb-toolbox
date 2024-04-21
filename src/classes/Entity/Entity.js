import { DeleteCommand, GetCommand, PutCommand, UpdateCommand, } from '@aws-sdk/lib-dynamodb';
import * as cloneDeep from 'deep-copy';
import parseEntity from '../../lib/parseEntity.js';
import validateTypes from '../../lib/validateTypes.js';
import normalizeData from '../../lib/normalizeData.js';
import formatItem from '../../lib/formatItem.js';
import getKey from '../../lib/getKey.js';
import parseConditions from '../../lib/expressionBuilder.js';
import parseProjections from '../../lib/projectionBuilder.js';
import { error, transformAttr, isEmpty } from '../../lib/utils.js';
import { ATTRIBUTE_VALUES_LIST_DEFAULT_KEY, ATTRIBUTE_VALUES_LIST_DEFAULT_VALUE, } from '../../constants.js';
class Entity {
    // Declare constructor (entity config)
    constructor(entity) {
        // Sanity check the entity object
        if ((entity === null || entity === void 0 ? void 0 : entity.constructor) !== Object) {
            error('Please provide a valid entity definition');
        }
        const { table, ...entitySchemaWithoutTable } = entity;
        // we want to prevent mutation of the original entity configuration input but still be able
        // to mutate the original table instance
        entity = {
            ...cloneDeep.default(entitySchemaWithoutTable),
            ...(table ? { table } : {}),
        };
        const { attributes, timestamps = true, createdAlias = 'created', modifiedAlias = 'modified', typeAlias = 'entity', typeHidden = false, } = entity;
        this.attributes = attributes;
        this.timestamps = timestamps;
        this.createdAlias = createdAlias;
        this.modifiedAlias = modifiedAlias;
        this.typeAlias = typeAlias;
        this.typeHidden = typeHidden;
        Object.assign(this, parseEntity(entity));
    }
    get table() {
        return this._table;
    }
    /*
     * @internal
     */
    set table(table) {
        this.setTable(table);
    }
    get DocumentClient() {
        var _a;
        if ((_a = this.table) === null || _a === void 0 ? void 0 : _a.DocumentClient) {
            return this.table.DocumentClient;
        }
        else {
            return error('DocumentClient required for this operation');
        }
    }
    // Sets the auto execute mode (default to true)
    set autoExecute(val) {
        this._execute = typeof val === 'boolean' ? val : undefined;
    }
    // Gets the current auto execute mode
    get autoExecute() {
        var _a;
        return typeof this._execute === 'boolean'
            ? this._execute
            : typeof ((_a = this.table) === null || _a === void 0 ? void 0 : _a.autoExecute) === 'boolean'
                ? this.table.autoExecute
                : true;
    }
    // Sets the auto parse mode (default to true)
    set autoParse(val) {
        this._parse = typeof val === 'boolean' ? val : undefined;
    }
    // Gets the current auto execute mode
    get autoParse() {
        var _a;
        return typeof this._parse === 'boolean'
            ? this._parse
            : typeof ((_a = this.table) === null || _a === void 0 ? void 0 : _a.autoParse) === 'boolean'
                ? this.table.autoParse
                : true;
    }
    // Primary key getters
    get partitionKey() {
        return this.schema.keys.partitionKey
            ? this.attribute(this.schema.keys.partitionKey)
            : error(`No partitionKey defined`);
    }
    // 🔨 TOIMPROVE: We could hardly type sortKey here
    get sortKey() {
        return this.schema.keys.sortKey ? this.attribute(this.schema.keys.sortKey) : null;
    }
    // Get mapped attribute name
    attribute(attr) {
        return this.schema.attributes[attr] && this.schema.attributes[attr].map
            ? this.schema.attributes[attr].map
            : this.schema.attributes[attr]
                ? attr
                : error(`'${attr}' does not exist or is an invalid alias`);
    }
    parse(input, include = []) {
        // TODO: 'include' needs to handle nested maps?
        // Convert include to roots and de-alias
        include = include.map(attr => {
            const _attr = attr.split('.')[0].split('[')[0];
            return (this.schema.attributes[_attr] && this.schema.attributes[_attr].map) || _attr;
        });
        // Load the schema
        const { schema, linked } = this;
        // Assume standard response from DynamoDB
        const data = input.Item || input.Items || input;
        if (Array.isArray(data)) {
            return data.map(item => formatItem()(schema.attributes, linked, item, include));
        }
        else {
            return formatItem()(schema.attributes, linked, data, include);
        }
    }
    /**
     * Generate GET parameters and execute operation
     * @param {object} item - The keys from item you wish to get.
     * @param {object} [options] - Additional get options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the get request.
     */
    async get(item, options = {}, params = {}) {
        const getParams = this.getParams(item, options, params);
        if (!shouldExecute(options.execute, this.autoExecute)) {
            return getParams;
        }
        const output = await this.DocumentClient.send(new GetCommand(getParams));
        if (!shouldParse(options.parse, this.autoParse)) {
            return output;
        }
        const { Item, ...restOutput } = output;
        if (!Item) {
            return restOutput;
        }
        const parsedItem = this.parse(Item, options.include);
        return { Item: parsedItem, ...restOutput };
    }
    /**
     * Generate parameters for GET batch operation
     * @param {object} item - The keys from item you wish to get.
     */
    getBatch(item) {
        return {
            Table: this.table,
            Key: this.getParams(item).Key,
        };
    }
    /**
     * Generate parameters for GET transaction operation
     * @param {object} item - The keys from item you wish to get.
     * @param {object} [options] - Additional get options
     */
    getTransaction(item, options = {}) {
        // Destructure options to check for extraneous arguments
        const { attributes, // ProjectionExpression
        ...args } = options;
        // Error on extraneous arguments
        if (Object.keys(args).length > 0) {
            error(`Invalid get transaction options: ${Object.keys(args).join(', ')}`);
        }
        // Generate the get parameters
        const payload = this.getParams(item, options);
        // Return in transaction format
        return {
            Entity: this,
            Get: payload,
        };
    }
    /**
     * Generate GET parameters
     * @param {object} item - The keys from item you wish to get.
     * @param {object} [options] - Additional get options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the get request.
     */
    getParams(item, options = {}, params = {}) {
        // Extract schema and merge defaults
        const { schema, defaults, linked, _table } = this;
        const data = normalizeData()(schema.attributes, linked, Object.assign({}, defaults, item), true);
        const { consistent, // ConsistentRead (boolean)
        capacity, // ReturnConsumedCapacity (none, total, or indexes)
        attributes, // Projections
        ..._args } = options;
        // Remove other valid options from options
        const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x));
        // Error on extraneous arguments
        if (args.length > 0)
            error(`Invalid get options: ${args.join(', ')}`);
        // Verify consistent read
        if (consistent !== undefined && typeof consistent !== 'boolean') {
            error(`'consistent' requires a boolean`);
        }
        // Verify capacity
        if (capacity !== undefined &&
            (typeof capacity !== 'string' ||
                !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))) {
            error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        let ExpressionAttributeNames; // init ExpressionAttributeNames
        let ProjectionExpression; // init ProjectionExpression
        // If projections
        if (attributes) {
            const { names, projections } = parseProjections(attributes, this.table, this.name);
            if (Object.keys(names).length > 0) {
                // Merge names and add projection expression
                ExpressionAttributeNames = names;
                ProjectionExpression = projections;
            }
        }
        // Generate the payload
        const payload = Object.assign({
            TableName: _table.name,
            Key: getKey()(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey),
        }, ExpressionAttributeNames ? { ExpressionAttributeNames } : null, ProjectionExpression ? { ProjectionExpression } : null, consistent ? { ConsistentRead: consistent } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, typeof params === 'object' ? params : {});
        return payload;
    }
    /**
     * Generate DELETE parameters and execute operation
     * @param {object} item - The keys from item you wish to delete.
     * @param {object} [options] - Additional delete options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
     */
    async delete(item, options = {}, params = {}) {
        const deleteParams = this.deleteParams(item, options, params);
        if (!shouldExecute(options.execute, this.autoExecute)) {
            return deleteParams;
        }
        const output = await this.DocumentClient.send(new DeleteCommand(deleteParams));
        if (!shouldParse(options.parse, this.autoParse)) {
            return output;
        }
        const { Attributes, ...restOutput } = output;
        if (!Attributes) {
            return restOutput;
        }
        const parsedAttributes = this.parse(Attributes, options.include);
        return { Attributes: parsedAttributes, ...restOutput };
    }
    /**
     * Generate parameters for DELETE batch operation
     * @param {object} item - The keys from item you wish to delete.
     *
     * Only Key is supported (e.g. no conditions)
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
     */
    deleteBatch(item) {
        const payload = this.deleteParams(item);
        return { [payload.TableName]: { DeleteRequest: { Key: payload.Key } } };
    }
    /**
     * Generate parameters for DELETE transaction operation
     * @param {object} item - The keys from item you wish to delete.
     * @param {object} [options] - Additional delete options
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
     *
     * Creates a Delete object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Delete.html
     */
    deleteTransaction(item, options = {}, params) {
        // Destructure options to check for extraneous arguments
        const { conditions, // ConditionExpression
        returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
        ...args } = options;
        // Error on extraneous arguments
        if (Object.keys(args).length > 0) {
            error(`Invalid delete transaction options: ${Object.keys(args).join(', ')}`);
        }
        // Generate the delete parameters
        let payload = this.deleteParams(item, options, params);
        // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
        if ('ReturnValues' in payload) {
            const { ReturnValues, ..._payload } = payload;
            payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        // Return in transaction format
        return { Delete: payload };
    }
    /**
     * Generate DELETE parameters
     * @param {object} item - The keys from item you wish to delete.
     * @param {object} [options] - Additional delete options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
     */
    deleteParams(item, options = {}, params = {}) {
        // Extract schema and merge defaults
        const { schema, defaults, linked, _table } = this;
        const data = normalizeData()(schema.attributes, linked, Object.assign({}, defaults, item), true);
        const { conditions, // ConditionExpression
        capacity, // ReturnConsumedCapacity (none, total, or indexes)
        metrics, // ReturnItemCollectionMetrics: (size or none)
        returnValues, // Return Values (none, all_old)
        ..._args } = options;
        // Remove other valid options from options
        const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x));
        // Error on extraneous arguments
        if (args.length > 0)
            error(`Invalid delete options: ${args.join(', ')}`);
        // Verify metrics
        if (metrics !== undefined &&
            (typeof metrics !== 'string' || !['NONE', 'SIZE'].includes(metrics.toUpperCase()))) {
            error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        }
        // Verify capacity
        if (capacity !== undefined &&
            (typeof capacity !== 'string' ||
                !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))) {
            error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        // Verify returnValues
        if (returnValues !== undefined &&
            (typeof returnValues !== 'string' ||
                !['NONE', 'ALL_OLD'].includes(returnValues.toUpperCase()))) {
            error(`'returnValues' must be one of 'NONE' OR 'ALL_OLD'`);
        }
        let ExpressionAttributeNames; // init ExpressionAttributeNames
        let ExpressionAttributeValues; // init ExpressionAttributeValues
        let ConditionExpression; // init ConditionExpression
        // If conditions
        if (conditions) {
            // Parse the conditions
            const { expression, names, values } = parseConditions(conditions, this.table, this.name);
            if (Object.keys(names).length > 0) {
                // TODO: alias attribute field names
                // Merge names and values and add condition expression
                ExpressionAttributeNames = names;
                ExpressionAttributeValues = values;
                ConditionExpression = expression;
            }
        }
        // Generate the payload
        const payload = Object.assign({
            TableName: _table.name,
            Key: getKey()(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey),
        }, ExpressionAttributeNames ? { ExpressionAttributeNames } : null, !isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : null, ConditionExpression ? { ConditionExpression } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, returnValues ? { ReturnValues: returnValues.toUpperCase() } : null, typeof params === 'object' ? params : {});
        return payload;
    }
    /**
     * Generate UPDATE parameters and execute operations
     * @param {object} item - The keys from item you wish to update.
     * @param {object} [options] - Additional update options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the update request.
     */
    async update(item, options = {}, params = {}) {
        // Generate the payload
        const updateParams = this.updateParams(item, options, params);
        if (!shouldExecute(options.execute, this.autoExecute)) {
            return updateParams;
        }
        const output = await this.DocumentClient.send(new UpdateCommand(updateParams));
        if (!shouldParse(options.parse, this.autoParse)) {
            return output;
        }
        const { Attributes, ...restOutput } = output;
        if (!Attributes) {
            return restOutput;
        }
        const parsedAttributes = this.parse(Attributes, options.include);
        return { Attributes: parsedAttributes, ...restOutput };
    }
    /**
     * Generate parameters for UPDATE transaction operation
     * @param {object} item - The item you wish to update.
     * @param {object} [options] - Additional update options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the update request.
     *
     * Creates an Update object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Update.html
     */
    updateTransaction(item, options = {}, params) {
        // Destructure options to check for extraneous arguments
        const { conditions, // ConditionExpression
        returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
        strictSchemaCheck, // StrictSchemaCheck
        ...args } = options;
        // Error on extraneous arguments
        if (Object.keys(args).length > 0) {
            error(`Invalid update transaction options: ${Object.keys(args).join(', ')}`);
        }
        // Generate the update parameters
        let payload = this.updateParams(item, options, params);
        // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
        if ('ReturnValues' in payload) {
            const { ReturnValues, ..._payload } = payload;
            payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        // Return in transaction format (cast as Update since UpdateExpression can't be undefined)
        return { Update: payload };
    }
    // Generate UPDATE Parameters
    updateParams(item, options = {}, { SET = [], REMOVE = [], ADD = [], DELETE = [], ExpressionAttributeNames = {}, ExpressionAttributeValues = {}, ...params } = {}) {
        // Validate operation types
        if (!Array.isArray(SET))
            error('SET must be an array');
        if (!Array.isArray(REMOVE))
            error('REMOVE must be an array');
        if (!Array.isArray(ADD))
            error('ADD must be an array');
        if (!Array.isArray(DELETE))
            error('DELETE must be an array');
        // Validate attribute names and values
        if ((ExpressionAttributeNames === null || ExpressionAttributeNames === void 0 ? void 0 : ExpressionAttributeNames.constructor) !== Object) {
            error('ExpressionAttributeNames must be an object');
        }
        if ((ExpressionAttributeValues === null || ExpressionAttributeValues === void 0 ? void 0 : ExpressionAttributeValues.constructor) !== Object) {
            error('ExpressionAttributeValues must be an object');
        }
        // if (ConditionExpression && typeof ConditionExpression !== 'string')
        //     error(`ConditionExpression must be a string`)
        // Extract schema and defaults
        const { schema, defaults, required, linked, _table } = this;
        // Initialize validateType
        const validateType = validateTypes();
        const shouldFilterUnmappedFields = options.strictSchemaCheck === false;
        // Merge defaults
        const data = normalizeData()(schema.attributes, linked, Object.assign({}, defaults, item), shouldFilterUnmappedFields);
        // Extract valid options
        const { conditions, // ConditionExpression
        capacity, // ReturnConsumedCapacity (none, total, or indexes)
        metrics, // ReturnItemCollectionMetrics: (size or none)
        returnValues, // Return Values (none, all_old, updated_old, all_new, updated_new)
        strictSchemaCheck, // Strict Schema Check (true or false)
        ..._args } = options;
        // Remove other valid options from options
        const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x));
        // Error on extraneous arguments
        if (args.length > 0)
            error(`Invalid update options: ${args.join(', ')}`);
        // Verify metrics
        if (metrics !== undefined &&
            (typeof metrics !== 'string' || !['NONE', 'SIZE'].includes(metrics.toUpperCase()))) {
            error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        }
        // Verify capacity
        if (capacity !== undefined &&
            (typeof capacity !== 'string' ||
                !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))) {
            error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        // Verify returnValues
        if (returnValues !== undefined &&
            (typeof returnValues !== 'string' ||
                !['NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', 'UPDATED_NEW'].includes(returnValues.toUpperCase()))) {
            error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', OR 'UPDATED_NEW'`);
        }
        let ConditionExpression; // init ConditionExpression
        // If conditions
        if (conditions) {
            // Parse the conditions
            const { expression, names, values } = parseConditions(conditions, this.table, this.name);
            if (Object.keys(names).length > 0) {
                // TODO: alias attribute field names
                // Add names, values and condition expression
                ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
                ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values);
                ConditionExpression = expression;
            }
        }
        // Check for required fields
        Object.keys(required).forEach(field => required[field] &&
            (data[field] === undefined || data[field] === null) &&
            error(`'${field}${this.schema.attributes[field].alias ? `/${this.schema.attributes[field].alias}` : ''}' is a required field`));
        // Get partition and sort keys
        const Key = getKey()(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey);
        // Init names and values
        const names = {};
        const values = {};
        // Loop through valid fields and add appropriate action
        Object.keys(data).forEach(field => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const mapping = schema.attributes[field];
            // Remove attributes
            if (field === '$remove') {
                const attrs = Array.isArray(data[field]) ? data[field] : [data[field]];
                for (const i in attrs) {
                    // Verify attribute
                    if (!schema.attributes[attrs[i]]) {
                        error(`'${attrs[i]}' is not a valid attribute and cannot be removed`);
                    }
                    // Verify attribute is not a pk/sk
                    if (schema.attributes[attrs[i]].partitionKey === true ||
                        schema.attributes[attrs[i]].sortKey === true) {
                        error(`'${attrs[i]}' is the ${schema.attributes[attrs[i]].partitionKey === true ? 'partitionKey' : 'sortKey'} and cannot be removed`);
                    }
                    // Verify attribute is not required
                    if (schema.attributes[attrs[i]].required) {
                        error(`'${attrs[i]}' is required and cannot be removed`);
                    }
                    const attributeHasDefaultValue = schema.attributes[attrs[i]].default !== undefined;
                    if (attributeHasDefaultValue) {
                        error(`'${attrs[i]}' has a default value and cannot be removed`);
                    }
                    // Grab the attribute name and add to REMOVE and names
                    const attr = schema.attributes[attrs[i]].map || attrs[i];
                    REMOVE.push(`#${attr}`);
                    names[`#${attr}`] = attr;
                }
            }
            else if (this._table._removeNulls === true &&
                (data[field] === null || String(data[field]).trim() === '') &&
                !Array.isArray(data[field]) &&
                (!mapping.link || mapping.save)) {
                // Verify attribute is not required
                if (schema.attributes[field].required)
                    error(`'${field}' is required and cannot be removed`);
                REMOVE.push(`#${field}`);
                names[`#${field}`] = field;
            }
            else if (
            // !mapping.partitionKey
            // && !mapping.sortKey
            mapping.partitionKey !== true &&
                mapping.sortKey !== true &&
                (mapping.save === undefined || mapping.save === true) &&
                (!mapping.link || (mapping.link && mapping.save === true))) {
                // If a number or a set and adding
                if (['bigint', 'number', 'set'].includes(mapping.type) &&
                    ((_a = data[field]) === null || _a === void 0 ? void 0 : _a.$add) !== undefined &&
                    ((_b = data[field]) === null || _b === void 0 ? void 0 : _b.$add) !== null) {
                    ADD.push(`#${field} :${field}`);
                    values[`:${field}`] = validateType(mapping, field, data[field].$add);
                    // Add field to names
                    names[`#${field}`] = field;
                    // if a set and deleting items
                }
                else if (mapping.type === 'set' && ((_c = data[field]) === null || _c === void 0 ? void 0 : _c.$delete)) {
                    DELETE.push(`#${field} :${field}`);
                    values[`:${field}`] = validateType(mapping, field, data[field].$delete);
                    // Add field to names
                    names[`#${field}`] = field;
                    // if a list and removing items by index
                }
                else if (mapping.type === 'list' && Array.isArray((_d = data[field]) === null || _d === void 0 ? void 0 : _d.$remove)) {
                    data[field].$remove.forEach((i) => {
                        if (typeof i !== 'number') {
                            error(`Remove array for '${field}' must only contain numeric indexes`);
                        }
                        REMOVE.push(`#${field}[${i}]`);
                    });
                    // Add field to names
                    names[`#${field}`] = field;
                    // if list and appending or prepending
                }
                else if (mapping.type === 'list' && (((_e = data[field]) === null || _e === void 0 ? void 0 : _e.$append) || ((_f = data[field]) === null || _f === void 0 ? void 0 : _f.$prepend))) {
                    if (data[field].$append) {
                        SET.push(`#${field} = list_append(if_not_exists(#${field}, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}) ,:${field})`);
                        values[`:${field}`] = validateType(mapping, field, data[field].$append);
                    }
                    else {
                        SET.push(`#${field} = list_append(:${field}, if_not_exists(#${field}, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}))`);
                        values[`:${field}`] = validateType(mapping, field, data[field].$prepend);
                    }
                    // Add field to names
                    names[`#${field}`] = field;
                    values[`:${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}`] = ATTRIBUTE_VALUES_LIST_DEFAULT_VALUE;
                    // if a list and updating by index
                }
                else if (mapping.type === 'list' && ((_g = data[field]) === null || _g === void 0 ? void 0 : _g.constructor) === Object) {
                    Object.keys(data[field]).forEach(i => {
                        if (String(parseInt(i)) !== i) {
                            error(`Properties must be numeric to update specific list items in '${field}'`);
                        }
                        SET.push(`#${field}[${i}] = :${field}_${i}`);
                        values[`:${field}_${i}`] = data[field][i];
                    });
                    // Add field to names
                    names[`#${field}`] = field;
                    // if a map and updating by nested attribute/index
                }
                else if (mapping.type === 'map' && ((_h = data[field]) === null || _h === void 0 ? void 0 : _h.$set)) {
                    Object.keys(data[field].$set).forEach(f => {
                        const props = f.split('.');
                        const acc = [`#${field}`];
                        props.forEach((prop, i) => {
                            const id = `${field}_${props.slice(0, i + 1).join('_')}`;
                            // Add names and values
                            names[`#${id.replace(/\[(\d+)\]/, '')}`] = prop.replace(/\[(\d+)\]/, '');
                            // if the final prop, add the SET and values
                            if (i === props.length - 1) {
                                const input = data[field].$set[f];
                                const path = `${acc.join('.')}.#${id}`;
                                const value = `${id.replace(/\[(\d+)\]/, '_$1')}`;
                                if (input === undefined || input === null) {
                                    REMOVE.push(`${path}`);
                                }
                                else if (input.$add) {
                                    ADD.push(`${path} :${value}`);
                                    values[`:${value}`] = input.$add;
                                }
                                else if (input.$append) {
                                    SET.push(`${path} = list_append(if_not_exists(${path}, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}), :${value})`);
                                    values[`:${value}`] = input.$append;
                                    // add default list value
                                    values[`:${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}`] = ATTRIBUTE_VALUES_LIST_DEFAULT_VALUE;
                                }
                                else if (input.$prepend) {
                                    SET.push(`${path} = list_append(:${value}, if_not_exists(${path}, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}))`);
                                    values[`:${value}`] = input.$prepend;
                                    // add default list value
                                    values[`:${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}`] = ATTRIBUTE_VALUES_LIST_DEFAULT_VALUE;
                                }
                                else if (input.$remove) {
                                    // console.log('REMOVE:',input.$remove);
                                    input.$remove.forEach((i) => {
                                        if (typeof i !== 'number') {
                                            error(`Remove array for '${field}' must only contain numeric indexes`);
                                        }
                                        REMOVE.push(`${path}[${i}]`);
                                    });
                                }
                                else {
                                    SET.push(`${path} = :${value}`);
                                    values[`:${value}`] = input;
                                }
                                if (input === null || input === void 0 ? void 0 : input.$set) {
                                    Object.keys(input.$set).forEach(i => {
                                        if (String(parseInt(i)) !== i) {
                                            error(`Properties must be numeric to update specific list items in '${field}'`);
                                        }
                                        SET.push(`${path}[${i}] = :${value}_${i}`);
                                        values[`:${value}_${i}`] = input.$set[i];
                                    });
                                }
                            }
                            else {
                                acc.push(`#${id.replace(/\[(\d+)\]/, '')}`);
                            }
                        });
                    });
                    const shouldAppendFieldToExpressionNames = Object.keys(data[field].$set).length > 0;
                    if (shouldAppendFieldToExpressionNames) {
                        names[`#${field}`] = field;
                    }
                    // else add to SET
                }
                else {
                    const value = transformAttr(mapping, validateType(mapping, field, data[field]), data);
                    // It's possible that defaults can purposely return undefined values
                    // if (hasValue(value)) {
                    if (value !== undefined) {
                        // Push the update to SET
                        SET.push(
                        // @ts-ignore
                        mapping.default !== undefined && item[mapping.alias || field] === undefined && !mapping.onUpdate
                            ? `#${field} = if_not_exists(#${field},:${field})`
                            : `#${field} = :${field}`);
                        // Add names and values
                        names[`#${field}`] = field;
                        values[`:${field}`] = value;
                    }
                }
            }
        });
        // Create the update expression
        const expression = ((SET.length > 0 ? 'SET ' + SET.join(', ') : '') +
            (REMOVE.length > 0 ? ' REMOVE ' + REMOVE.join(', ') : '') +
            (ADD.length > 0 ? ' ADD ' + ADD.join(', ') : '') +
            (DELETE.length > 0 ? ' DELETE ' + DELETE.join(', ') : '')).trim();
        // Merge attribute values
        ExpressionAttributeValues = Object.assign(values, ExpressionAttributeValues);
        // Generate the payload
        const payload = Object.assign({
            TableName: _table.name,
            Key,
            UpdateExpression: expression,
            ExpressionAttributeNames: Object.assign(names, ExpressionAttributeNames),
        }, typeof params === 'object' ? params : {}, !isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {}, ConditionExpression ? { ConditionExpression } : {}, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, returnValues ? { ReturnValues: returnValues.toUpperCase() } : null);
        return payload;
        // TODO: Check why primary/secondary GSIs are using if_not_exists
    }
    // PUT - put item
    async put(item, options = {}, params = {}) {
        const putParams = this.putParams(item, options, params);
        if (!shouldExecute(options.execute, this.autoExecute)) {
            return putParams;
        }
        const output = await this.DocumentClient.send(new PutCommand(putParams));
        if (!shouldParse(options.parse, this.autoParse)) {
            return output;
        }
        const { Attributes, ...restOutput } = output;
        if (!Attributes) {
            return output;
        }
        const parsedAttributes = this.parse(Attributes, options.include);
        return { Attributes: parsedAttributes, ...restOutput };
    }
    /**
     * Generate parameters for PUT batch operation
     * @param {object} item - The item you wish to put.
     * @param {object} options - Options for the operation.
     *
     * Only Item is supported (e.g. no conditions)
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
     */
    putBatch(item, options = {}) {
        const payload = this.putParams(item, options);
        return { [payload.TableName]: { PutRequest: { Item: payload.Item } } };
    }
    /**
     * Generate parameters for PUT transaction operation
     * @param {object} item - The item you wish to put.
     * @param {object} [options] - Additional put options
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the put request.
     *
     * Creates a Put object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Put.html
     */
    putTransaction(item, options = {}, params) {
        // Destructure options to check for extraneous arguments
        const { conditions, // ConditionExpression
        returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
        strictSchemaCheck, // StrictSchemaCheck
        ...args } = options;
        // Error on extraneous arguments
        if (Object.keys(args).length > 0) {
            error(`Invalid put transaction options: ${Object.keys(args).join(', ')}`);
        }
        // Generate the put parameters
        let payload = this.putParams(item, options, params);
        // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
        if ('ReturnValues' in payload) {
            const { ReturnValues, ..._payload } = payload;
            payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        // Return in transaction format
        return { Put: payload };
    }
    // Generate PUT Parameters
    putParams(item, options = {}, params = {}) {
        // Extract schema and defaults
        const { schema, defaults, required, linked, _table } = this;
        // Initialize validateType
        const validateType = validateTypes();
        const shouldFilterUnmappedFields = options.strictSchemaCheck === false;
        // Merge defaults
        const data = normalizeData()(schema.attributes, linked, Object.assign({}, defaults, item), shouldFilterUnmappedFields);
        // Extract valid options
        const { conditions, // ConditionExpression
        capacity, // ReturnConsumedCapacity (none, total, or indexes)
        metrics, // ReturnItemCollectionMetrics: (size or none)
        returnValues, // Return Values (none, all_old, updated_old, all_new, updated_new)
        strictSchemaCheck, // Strict Schema Check (true or false)
        ..._args } = options;
        // Remove other valid options from options
        const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x));
        // Error on extraneous arguments
        if (args.length > 0)
            error(`Invalid put options: ${args.join(', ')}`);
        // Verify metrics
        if (metrics !== undefined &&
            (typeof metrics !== 'string' || !['NONE', 'SIZE'].includes(metrics.toUpperCase()))) {
            error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        }
        // Verify capacity
        if (capacity !== undefined &&
            (typeof capacity !== 'string' ||
                !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))) {
            error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        // Verify returnValues
        if (returnValues !== undefined &&
            (typeof returnValues !== 'string' ||
                !['NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', 'UPDATED_NEW'].includes(returnValues.toUpperCase()))) {
            error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', or 'UPDATED_NEW'`);
        }
        let ExpressionAttributeNames; // init ExpressionAttributeNames
        let ExpressionAttributeValues; // init ExpressionAttributeValues
        let ConditionExpression; // init ConditionExpression
        // If conditions
        if (conditions) {
            // Parse the conditions
            const { expression, names, values } = parseConditions(conditions, this.table, this.name);
            if (Object.keys(names).length > 0) {
                // TODO: alias attribute field names
                // Add names, values and condition expression
                ExpressionAttributeNames = names;
                ExpressionAttributeValues = values;
                ConditionExpression = expression;
            }
        }
        // Check for required fields
        Object.keys(required).forEach(field => required[field] !== undefined &&
            (data[field] === undefined || data[field] === null) &&
            error(`'${field}${this.schema.attributes[field].alias ? `/${this.schema.attributes[field].alias}` : ''}' is a required field`));
        // Checks for partition and sort keys
        getKey()(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey);
        // Generate the payload
        const payload = Object.assign({
            TableName: _table.name,
            // Loop through valid fields and add appropriate action
            Item: Object.keys(data).reduce((acc, field) => {
                const mapping = schema.attributes[field];
                let value = data[field];
                if (value !== undefined &&
                    (mapping.save === undefined || mapping.save === true) &&
                    (!mapping.link || (mapping.link && mapping.save === true)) &&
                    (!_table._removeNulls || (_table._removeNulls && value !== null))) {
                    // Transform before validation as user can transform entity into
                    // invalid value which will be thrown by DynamoDB Document client
                    value = transformAttr(mapping, value, data);
                    value = validateType(mapping, field, value);
                    return Object.assign(acc, { [field]: value });
                }
                return acc;
            }, {}),
        }, ExpressionAttributeNames ? { ExpressionAttributeNames } : null, !isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : null, ConditionExpression ? { ConditionExpression } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, returnValues ? { ReturnValues: returnValues.toUpperCase() } : null, typeof params === 'object' ? params : {});
        return payload;
    }
    /**
     * Generate parameters for ConditionCheck transaction operation
     * @param {object} item - The keys from item you wish to check.
     * @param {object} [options] - Additional condition check options
     *
     * Creates a ConditionCheck object:
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ConditionCheck.html
     */
    conditionCheck(item, options = {}) {
        // Destructure options to check for extraneous arguments
        const { conditions, // ConditionExpression
        returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
        ...args } = options;
        // Error on extraneous arguments
        if (Object.keys(args).length > 0) {
            error(`Invalid conditionCheck options: ${Object.keys(args).join(', ')}`);
        }
        // Generate the condition parameters (same params as delete)
        let payload = this.deleteParams(item, options);
        // Error on missing conditions
        if (!('ConditionExpression' in payload))
            error(`'conditions' are required in a conditionCheck`);
        // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
        if ('ReturnValues' in payload) {
            const { ReturnValues, ..._payload } = payload;
            payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        // Return in transaction format
        return { ConditionCheck: payload };
    }
    // Query pass-through (default entity)
    query(pk, options = {}, params = {}) {
        if (!this.table) {
            throw new Error('Entity table is not defined');
        }
        options.entity = this.name;
        return this.table.query(pk, options, params);
    }
    // Scan pass-through (default entity)
    scan(options = {}, params = {}) {
        if (!this.table) {
            throw new Error('Entity table is not defined');
        }
        options.entity = this.name;
        return this.table.scan(options, params);
    }
    setTable(table) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (table == null && !this._table) {
            return this;
        }
        if ((table === null || table === void 0 ? void 0 : table.name) === ((_a = this === null || this === void 0 ? void 0 : this._table) === null || _a === void 0 ? void 0 : _a.name)) {
            return this;
        }
        if (table != null && !((_b = table === null || table === void 0 ? void 0 : table.Table) === null || _b === void 0 ? void 0 : _b.attributes)) {
            error(`Entity ${this.name} was assigned an invalid table`);
        }
        if ((_d = (_c = this._table) === null || _c === void 0 ? void 0 : _c.Table) === null || _d === void 0 ? void 0 : _d.entityField) {
            delete this.schema.attributes[this._table.Table.entityField];
            delete this.defaults[this._table.Table.entityField];
            delete this.schema.attributes[this._etAlias];
            delete this.defaults[this._etAlias];
        }
        (_f = (_e = this._table) === null || _e === void 0 ? void 0 : _e.removeEntity) === null || _f === void 0 ? void 0 : _f.call(_e, this);
        this._table = table;
        table === null || table === void 0 ? void 0 : table.addEntity(this);
        // If an entity tracking field is enabled, add the attributes, alias and the default
        if ((_g = table === null || table === void 0 ? void 0 : table.Table) === null || _g === void 0 ? void 0 : _g.entityField) {
            this.schema.attributes[table.Table.entityField] = {
                type: 'string',
                hidden: this.typeHidden,
                alias: this._etAlias,
                default: this.name,
            };
            this.defaults[table.Table.entityField] = this.name;
            this.schema.attributes[this._etAlias] = {
                type: 'string',
                map: table.Table.entityField,
                default: this.name,
            };
            this.defaults[this._etAlias] = this.name;
        }
        return this;
    }
}
export default Entity;
export const shouldExecute = (execute, autoExecute) => execute === true || (execute === undefined && autoExecute);
export const shouldParse = (parse, autoParse) => parse === true || (parse === undefined && autoParse);
