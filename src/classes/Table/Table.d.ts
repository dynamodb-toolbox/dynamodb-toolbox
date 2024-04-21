import type { A, O } from 'ts-toolbelt';
import { ParsedTable } from '../../lib/parseTable.js';
import Entity from '../Entity/Entity.js';
import { AttributeMap } from '../Entity/types.js';
import type { ParsedEntity } from '../../lib/parseEntity.js';
import type { BatchGetOptions, batchWriteOptions, ScanOptions, ScanParamsWithMeta, TableConstructor, TableQueryOptions, transactGetOptions, TransactGetParamsWithMeta, transactGetParamsOptions, TransactWriteOptions, transactWriteParamsOptions } from './types.js';
import { If, Compute } from '../../lib/utils.js';
import { BatchGetCommandInput, BatchWriteCommandInput, DynamoDBDocumentClient, QueryCommandInput, QueryCommandOutput, ScanCommandInput, ScanCommandOutput, TransactGetCommandInput, TransactGetCommandOutput, TransactWriteCommandInput, TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { TransactGetItem } from '@aws-sdk/client-dynamodb';
declare class Table<Name extends string, PartitionKey extends A.Key, SortKey extends A.Key | null> {
    private _execute;
    private _parse;
    _removeNulls: boolean;
    private _docClient?;
    private _entities;
    Table: ParsedTable['Table'];
    name: string;
    alias?: string;
    [key: string]: any;
    constructor(table: TableConstructor<Name, PartitionKey, SortKey>);
    set autoExecute(val: boolean);
    get autoExecute(): boolean;
    set autoParse(val: boolean);
    get autoParse(): boolean;
    set removeNullAttributes(val: boolean);
    get removeNullAttributes(): boolean;
    get DocumentClient(): DynamoDBDocumentClient & {
        options?: {
            convertEmptyValues: boolean;
            wrapNumbers: boolean;
        };
    };
    set DocumentClient(docClient: (DynamoDBDocumentClient) | undefined);
    /**
     * Adds an entity to the table
     * @param {Entity|Entity[]} Entity - An Entity or array of Entities to add to the table.
     * NOTE: this does not adjust the entity's type inference because it is static
     */
    addEntity(entity: ParsedEntity | ParsedEntity[]): void;
    removeEntity(entity: Entity): void;
    get entities(): string[];
    query<Item = AttributeMap, Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(pk: any, options?: TableQueryOptions<Execute, Parse>, params?: Partial<QueryCommandInput>): Promise<If<A.Equals<Execute, false>, QueryCommandInput, If<A.Equals<Parse, false>, Compute<QueryCommandOutput & {
        next?: () => Promise<QueryCommandOutput>;
    }>, Compute<O.Update<QueryCommandOutput, 'Items', Item[]> & {
        next?: () => Promise<O.Update<QueryCommandOutput, 'Items', Item[]>>;
    }>>>>;
    queryParams<Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(pk: any, options?: TableQueryOptions<Execute, Parse>, params?: Partial<QueryCommandInput>, projections?: boolean): any;
    scan<Item = AttributeMap, Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(options?: ScanOptions<Execute, Parse>, params?: Partial<ScanCommandInput>): Promise<If<A.Equals<Execute, false>, ScanCommandInput, If<A.Equals<Parse, false>, Compute<ScanCommandOutput & {
        next?: () => Promise<ScanCommandOutput>;
    }>, Compute<O.Update<ScanCommandOutput, 'Items', Item[]> & {
        next?: () => Promise<O.Update<ScanCommandOutput, 'Items', Item[]>>;
    }>>>>;
    scanParams<Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(options?: ScanOptions<Execute, Parse>, params?: Partial<ScanCommandInput>, meta?: boolean): ScanCommandInput | ScanParamsWithMeta;
    batchGet(items: any, options?: BatchGetOptions, params?: Partial<BatchGetCommandInput>): Promise<any>;
    parseBatchGetResponse(result: any, Tables: any, EntityProjections: {
        [key: string]: any;
    }, TableProjections: {
        [key: string]: string[];
    }, options?: BatchGetOptions): any;
    batchGetParams(_items: any, options?: BatchGetOptions, params?: Partial<BatchGetCommandInput>, meta?: boolean): ({
        RequestItems: Record<string, Omit<import("@aws-sdk/client-dynamodb").KeysAndAttributes, "Keys"> & {
            Keys: Record<string, any>[] | undefined;
        }>;
    } & {
        ReturnConsumedCapacity: string;
    } & Partial<BatchGetCommandInput>) | {
        payload: {
            RequestItems: Record<string, Omit<import("@aws-sdk/client-dynamodb").KeysAndAttributes, "Keys"> & {
                Keys: Record<string, any>[] | undefined;
            }>;
        } & {
            ReturnConsumedCapacity: string;
        } & Partial<BatchGetCommandInput>;
        Tables: {
            [key: string]: any;
        };
        EntityProjections: {
            [key: string]: any;
        };
        TableProjections: {
            [key: string]: any;
        };
    };
    batchWrite(items: any, options?: batchWriteOptions, params?: Partial<BatchWriteCommandInput>): Promise<any>;
    private parseBatchWriteResponse;
    /**
     * Generates parameters for a batchWrite
     * @param {object} _items - An array of objects generated from putBatch and/or deleteBatch entity calls.
     * @param {object} [options] - Additional batchWrite options
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the batchWrite request.
     * @param {boolean} [meta] - Internal flag to enable entity parsing
     *
     */
    batchWriteParams(_items: any, options?: batchWriteOptions, params?: Partial<BatchWriteCommandInput>, meta?: boolean): BatchWriteCommandInput | {
        payload: BatchWriteCommandInput;
        Tables: {};
    };
    /**
     * Performs a transactGet operation
     * @param {object} items - An array of objects generated from getTransaction entity calls.
     * @param {object} [options] - Additional transactGet options
     *
     */
    transactGet(items?: ({
        Entity?: any;
    } & TransactGetItem)[], options?: transactGetOptions): Promise<TransactGetCommandInput | TransactGetCommandOutput>;
    /**
     * Generates parameters for a transactGet operation
     * @param {object} _items - An array of objects generated from getTransaction entity calls.
     * @param {object} [options] - Additional transactGet options.
     * @param {boolean} [meta] - A flag for returning metadata, this is for internal use.
     *
     * Creates a TransactGetItems object:
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html
     */
    transactGetParams(_items: ({
        Entity?: any;
    } & TransactGetItem)[], options?: transactGetParamsOptions, meta?: false | undefined): TransactGetCommandInput;
    transactGetParams(_items: ({
        Entity?: any;
    } & TransactGetItem)[], options: transactGetParamsOptions, meta: true): TransactGetParamsWithMeta;
    /**
     * Performs a transactWrite operation
     * @param {object} items - An array of objects generated from putTransaction, updateTransaction, or deleteTransaction
     *   entity calls.
     * @param {object} [options] - Additional transactWrite options.
     * @param {object} [params] - Additional transactWrite parameters.
     *
     */
    transactWrite(items: TransactWriteCommandInput['TransactItems'], options?: TransactWriteOptions, params?: Partial<TransactWriteCommandInput>): Promise<TransactWriteCommandInput | TransactWriteCommandOutput>;
    /**
     * Generates parameters for a transactWrite operation
     * @param {object} _items - An array of objects generated from putTransaction, updateTransaction, or deleteTransaction
     *   entity calls.
     * @param {object} [options] - Additional options
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the transactWrite request.
     *
     * Creates a TransactWriteItems object:
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html
     */
    transactWriteParams(_items: TransactWriteCommandInput['TransactItems'], options?: transactWriteParamsOptions, params?: Partial<TransactWriteCommandInput>): TransactWriteCommandInput;
    parse(entity: string, input: any, include?: never[]): Promise<any>;
    get(entity: string, item?: {}, options?: {}, params?: {}): Promise<any>;
    delete(entity: string, item?: {}, options?: {}, params?: {}): Promise<any>;
    update(entity: string, item?: {}, options?: {}, params?: {}): Promise<any>;
    put(entity: string, item?: {}, options?: {}, params?: {}): Promise<any>;
}
export default Table;
