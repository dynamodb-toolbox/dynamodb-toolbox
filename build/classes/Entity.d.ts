/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
declare const parseEntity: any;
declare const validateTypes: any;
declare const normalizeData: any;
declare const formatItem: any;
declare const getKey: any;
declare const parseConditions: any;
declare const parseProjections: any;
declare const error: any, transformAttr: any, isEmpty: any;
declare class Entity {
    constructor(entity: any);
    set table(table: any);
    get table(): any;
    get DocumentClient(): any;
    set autoExecute(val: any);
    get autoExecute(): any;
    set autoParse(val: any);
    get autoParse(): any;
    get partitionKey(): any;
    get sortKey(): any;
    attribute(attr: any): any;
    parse(input: any, include?: never[]): any;
    get(item?: {}, options?: {}, params?: {}): Promise<any>;
    getBatch(item?: {}): {
        Table: any;
        Key: any;
    };
    getParams(item?: {}, options?: {}, params?: {}): any;
    delete(item?: {}, options?: {}, params?: {}): Promise<any>;
    deleteBatch(item?: {}): {
        [x: number]: {
            DeleteRequest: {
                Key: any;
            };
        };
    };
    deleteParams(item?: {}, options?: {}, params?: {}): any;
    update(item?: {}, options?: {}, params?: {}): Promise<any>;
    updateParams(item?: {}, options?: {}, { SET, REMOVE, ADD, DELETE, ExpressionAttributeNames, ExpressionAttributeValues, ...params }?: {
        SET?: never[] | undefined;
        REMOVE?: never[] | undefined;
        ADD?: never[] | undefined;
        DELETE?: never[] | undefined;
        ExpressionAttributeNames?: {} | undefined;
        ExpressionAttributeValues?: {} | undefined;
    }): any;
    put(item?: {}, options?: {}, params?: {}): Promise<any>;
    putBatch(item?: {}): {
        [x: number]: {
            PutRequest: {
                Item: any;
            };
        };
    };
    putParams(item?: {}, options?: {}, params?: {}): any;
    query(pk: any, options?: {}, params?: {}): any;
    scan(options?: {}, params?: {}): any;
}
