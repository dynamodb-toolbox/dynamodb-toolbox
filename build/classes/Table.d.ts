/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
declare const parseTable: any;
declare const parseFilters: any;
declare const parseProjections: any;
declare const validateTypes: any;
declare const error: any;
declare const Entity: any;
declare const conditonError: (op: any) => any;
declare class Table {
    constructor(table: any);
    set autoExecute(val: any);
    get autoExecute(): any;
    set autoParse(val: any);
    get autoParse(): any;
    set removeNullAttributes(val: any);
    get removeNullAttributes(): any;
    get DocumentClient(): any;
    set DocumentClient(docClient: any);
    set entities(entity: any);
    get entities(): any;
    query(pk: any, options?: {}, params?: {}): Promise<any>;
    queryParams(pk: any, options?: {}, params?: {}, projections?: boolean): any;
    scan(options?: {}, params?: {}): Promise<any>;
    scanParams(options?: {}, params?: {}, meta?: boolean): any;
    batchGet(items: any, options?: {}, params?: {}): Promise<any>;
    parseBatchGetResponse(result: any, Tables: any, EntityProjections: any, TableProjections: any, options?: {}): any;
    batchGetParams(_items: any, options?: {}, params?: {}, meta?: boolean): ({
        RequestItems: {};
    } & {
        ReturnConsumedCapacity: any;
    }) | {
        payload: {
            RequestItems: {};
        } & {
            ReturnConsumedCapacity: any;
        };
        Tables: {};
        EntityProjections: {};
        TableProjections: {};
    };
    batchWrite(items: any, options?: {}, params?: {}): Promise<any>;
    parseBatchWriteResponse(result: any, options?: {}): any;
    batchWriteParams(_items: any, options: {} | undefined, params: {} | undefined, meta: any): ({
        RequestItems: {};
    } & {
        ReturnConsumedCapacity: any;
    } & {
        ReturnItemCollectionMetrics: any;
    }) | {
        payload: {
            RequestItems: {};
        } & {
            ReturnConsumedCapacity: any;
        } & {
            ReturnItemCollectionMetrics: any;
        };
        Tables: {};
    };
    parse(entity: any, input: any, include?: never[]): Promise<any>;
    get(entity: any, item?: {}, options?: {}, params?: {}): Promise<any>;
    delete(entity: any, item?: {}, options?: {}, params?: {}): Promise<any>;
    update(entity: any, item?: {}, options?: {}, params?: {}): Promise<any>;
    put(entity: any, item?: {}, options?: {}, params?: {}): Promise<any>;
}
