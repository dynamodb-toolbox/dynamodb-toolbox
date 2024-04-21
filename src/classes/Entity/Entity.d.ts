import { DeleteCommandInput, DeleteCommandOutput, DynamoDBDocumentClient, GetCommandInput, GetCommandOutput, PutCommandInput, PutCommandOutput, UpdateCommandInput, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import type { WriteRequest, Delete, Update, Put, ConditionCheck, QueryInput, ScanInput, TransactGetItem } from '@aws-sdk/client-dynamodb';
import type { A, B, O } from 'ts-toolbelt';
import { If, FirstDefined, Compute } from '../../lib/utils.js';
import type { ScanOptions, TableDef } from '../Table/types.js';
import type { $GetOptions, $PutOptions, $UpdateOptions, AttributeDefinitions, DeleteOptionsReturnValues, EntityConstructor, EntityQueryOptions, InferCompositePrimaryKey, InferItem, Overlay, ParseAttributes, ParsedAttributes, PutItem, PutOptionsReturnValues, RawDeleteOptions, ShouldExecute, ShouldParse, TransactionOptions, TransactionOptionsReturnValues, UpdateCustomParams, UpdateItem, UpdateOptionsReturnValues, Writable, Readonly, $PutBatchOptions, AttributeMap } from './types.js';
declare class Entity<Name extends string = string, EntityItemOverlay extends Overlay = string extends Name ? Overlay : undefined, EntityCompositeKeyOverlay extends Overlay = string extends Name ? Overlay : EntityItemOverlay, EntityTable extends TableDef | undefined = string extends Name ? TableDef | undefined : undefined, AutoExecute extends boolean = string extends Name ? boolean : true, AutoParse extends boolean = string extends Name ? boolean : true, Timestamps extends boolean = string extends Name ? boolean : true, CreatedAlias extends string = string extends Name ? string : 'created', ModifiedAlias extends string = string extends Name ? string : 'modified', TypeAlias extends string = string extends Name ? string : 'entity', TypeHidden extends boolean = string extends Name ? boolean : false, ReadonlyAttributeDefinitions extends Readonly<AttributeDefinitions> = Readonly<AttributeDefinitions>, WritableAttributeDefinitions extends AttributeDefinitions = Writable<ReadonlyAttributeDefinitions>, Attributes extends ParsedAttributes = string extends Name ? ParsedAttributes : If<A.Equals<EntityItemOverlay, undefined>, ParseAttributes<WritableAttributeDefinitions, Timestamps, CreatedAlias, ModifiedAlias, TypeAlias, TypeHidden>, ParsedAttributes<keyof EntityItemOverlay>>, $Item = string extends Name ? any : If<A.Equals<EntityItemOverlay, undefined>, InferItem<WritableAttributeDefinitions, Attributes>, EntityItemOverlay>, Item extends O.Object = string extends Name ? O.Object : A.Cast<$Item, O.Object>, CompositePrimaryKey extends O.Object = string extends Name ? O.Object : If<A.Equals<EntityItemOverlay, undefined>, InferCompositePrimaryKey<Item, Attributes>, O.Object>> {
    _typesOnly: {
        _entityItemOverlay: EntityItemOverlay;
        _attributes: Attributes;
        _compositePrimaryKey: CompositePrimaryKey;
        _item: Item;
    };
    private _table?;
    private _execute?;
    private _parse?;
    name: string;
    schema: any;
    _etAlias: string;
    defaults: any;
    linked: any;
    required: any;
    attributes: ReadonlyAttributeDefinitions;
    timestamps: Timestamps;
    createdAlias: CreatedAlias;
    modifiedAlias: ModifiedAlias;
    typeAlias: TypeAlias;
    typeHidden: TypeHidden;
    constructor(entity: EntityConstructor<EntityTable, Name, AutoExecute, AutoParse, Timestamps, CreatedAlias, ModifiedAlias, TypeAlias, TypeHidden, ReadonlyAttributeDefinitions>);
    get table(): EntityTable | undefined;
    set table(table: EntityTable | undefined);
    get DocumentClient(): DynamoDBDocumentClient;
    set autoExecute(val: boolean);
    get autoExecute(): boolean;
    set autoParse(val: boolean);
    get autoParse(): boolean;
    get partitionKey(): Attributes['key']['partitionKey']['pure'];
    get sortKey(): string | null;
    attribute(attr: string): any;
    parse(input: {
        Item: unknown;
    }, include?: string[]): Item;
    parse(input: {
        Items: unknown[];
    }, include?: string[]): Item[];
    parse(input: unknown[], include?: string[]): Item[];
    parse(input: unknown, include?: string[]): Item;
    /**
     * Generate GET parameters and execute operation
     * @param {object} item - The keys from item you wish to get.
     * @param {object} [options] - Additional get options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the get request.
     */
    get<MethodItemOverlay extends Overlay = undefined, MethodCompositeKeyOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>, options?: $GetOptions<ResponseAttributes, Execute, Parse>, params?: Partial<GetCommandInput>): Promise<If<B.Not<ShouldExecute<Execute, AutoExecute>>, GetCommandInput, If<B.Not<ShouldParse<Parse, AutoParse>>, GetCommandOutput, Compute<O.Update<GetCommandOutput, 'Item', FirstDefined<[MethodItemOverlay, Compute<O.Pick<Item, ResponseAttributes>>]>>>>>>;
    /**
     * Generate parameters for GET batch operation
     * @param {object} item - The keys from item you wish to get.
     */
    getBatch<MethodCompositeKeyOverlay extends Overlay = undefined>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>): {
        Table: EntityTable | undefined;
        Key: Record<string, any> | undefined;
    };
    /**
     * Generate parameters for GET transaction operation
     * @param {object} item - The keys from item you wish to get.
     * @param {object} [options] - Additional get options
     */
    getTransaction<MethodItemOverlay extends Overlay = undefined, MethodCompositeKeyOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>, options?: {
        attributes?: ResponseAttributes[];
    }): {
        Entity: Entity<Name, EntityItemOverlay, EntityCompositeKeyOverlay, EntityTable, AutoExecute, AutoParse, Timestamps, CreatedAlias, ModifiedAlias, TypeAlias, TypeHidden, ReadonlyAttributeDefinitions, WritableAttributeDefinitions, Attributes, $Item, Item, CompositePrimaryKey>;
    } & TransactGetItem;
    /**
     * Generate GET parameters
     * @param {object} item - The keys from item you wish to get.
     * @param {object} [options] - Additional get options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the get request.
     */
    getParams<MethodItemOverlay extends Overlay = undefined, MethodCompositeKeyOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>, options?: $GetOptions<ResponseAttributes, Execute, Parse>, params?: Partial<GetCommandInput>): GetCommandInput;
    /**
     * Generate DELETE parameters and execute operation
     * @param {object} item - The keys from item you wish to delete.
     * @param {object} [options] - Additional delete options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
     */
    delete<MethodItemOverlay extends Overlay = undefined, MethodCompositeKeyOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, ReturnValues extends DeleteOptionsReturnValues = 'NONE', Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>, options?: RawDeleteOptions<ResponseAttributes, ReturnValues, Execute, Parse>, params?: Partial<DeleteCommandInput>): Promise<If<B.Not<ShouldExecute<Execute, AutoExecute>>, DeleteCommandInput, If<B.Not<ShouldParse<Parse, AutoParse>>, DeleteCommandOutput, If<// If MethodItemOverlay is defined, ReturnValues is not inferred from args anymore
    B.And<A.Equals<ReturnValues, 'NONE'>, A.Equals<MethodItemOverlay, undefined>>, O.Omit<DeleteCommandOutput, 'Attributes'>, O.Update<DeleteCommandOutput, 'Attributes', FirstDefined<[MethodItemOverlay, EntityItemOverlay, Compute<O.Pick<Item, ResponseAttributes>>]>>>>>>;
    /**
     * Generate parameters for DELETE batch operation
     * @param {object} item - The keys from item you wish to delete.
     *
     * Only Key is supported (e.g. no conditions)
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
     */
    deleteBatch<MethodCompositeKeyOverlay extends Overlay = undefined>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>): {
        [key: string]: WriteRequest;
    };
    /**
     * Generate parameters for DELETE transaction operation
     * @param {object} item - The keys from item you wish to delete.
     * @param {object} [options] - Additional delete options
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
     *
     * Creates a Delete object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Delete.html
     */
    deleteTransaction<MethodItemOverlay extends Overlay = undefined, MethodCompositeKeyOverlay extends Overlay = undefined, ItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['all'], keyof MethodItemOverlay>, ResponseAttributes extends ItemAttributes = ItemAttributes>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>, options?: TransactionOptions<ResponseAttributes>, params?: Partial<DeleteCommandInput>): {
        Delete: Delete;
    };
    /**
     * Generate DELETE parameters
     * @param {object} item - The keys from item you wish to delete.
     * @param {object} [options] - Additional delete options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
     */
    deleteParams<MethodItemOverlay extends Overlay = undefined, MethodCompositeKeyOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, ReturnValues extends DeleteOptionsReturnValues | TransactionOptionsReturnValues = 'NONE', Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>, options?: RawDeleteOptions<ResponseAttributes, ReturnValues, Execute, Parse>, params?: Partial<DeleteCommandInput>): DeleteCommandInput;
    /**
     * Generate UPDATE parameters and execute operations
     * @param {object} item - The keys from item you wish to update.
     * @param {object} [options] - Additional update options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the update request.
     */
    update<MethodItemOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, ReturnValues extends UpdateOptionsReturnValues = 'NONE', Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined, StrictSchemaCheck extends boolean | undefined = true>(item: UpdateItem<MethodItemOverlay, EntityItemOverlay, CompositePrimaryKey, Item, Attributes, StrictSchemaCheck>, options?: $UpdateOptions<ResponseAttributes, ReturnValues, Execute, Parse, StrictSchemaCheck>, params?: UpdateCustomParams): Promise<If<B.Not<ShouldExecute<Execute, AutoExecute>>, UpdateCommandInput, If<B.Not<ShouldParse<Parse, AutoParse>>, UpdateCommandOutput, If<A.Equals<ReturnValues, 'NONE'>, Omit<UpdateCommandOutput, 'Attributes'>, O.Update<UpdateCommandOutput, 'Attributes', If<B.Or<A.Equals<ReturnValues, 'ALL_OLD'>, A.Equals<ReturnValues, 'ALL_NEW'>>, FirstDefined<[MethodItemOverlay, EntityItemOverlay, Pick<Item, Attributes['shown']>]>, If<B.Or<A.Equals<ReturnValues, 'UPDATED_OLD'>, A.Equals<ReturnValues, 'UPDATED_NEW'>>, FirstDefined<[MethodItemOverlay, EntityItemOverlay, O.Pick<Item, ResponseAttributes>, 'bla']>>>>>>>>;
    /**
     * Generate parameters for UPDATE transaction operation
     * @param {object} item - The item you wish to update.
     * @param {object} [options] - Additional update options.
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the update request.
     *
     * Creates an Update object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Update.html
     */
    updateTransaction<MethodItemOverlay extends Overlay = undefined, ItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['all'], keyof MethodItemOverlay>, ResponseAttributes extends ItemAttributes = ItemAttributes, StrictSchemaCheck extends boolean | undefined = true>(item: UpdateItem<MethodItemOverlay, EntityItemOverlay, CompositePrimaryKey, Item, Attributes, StrictSchemaCheck>, options?: TransactionOptions<ResponseAttributes, StrictSchemaCheck>, params?: UpdateCustomParams): {
        Update: Update;
    };
    updateParams<MethodItemOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, ReturnValues extends UpdateOptionsReturnValues | TransactionOptionsReturnValues = 'NONE', Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined, StrictSchemaCheck extends boolean | undefined = true>(item: UpdateItem<MethodItemOverlay, EntityItemOverlay, CompositePrimaryKey, Item, Attributes, StrictSchemaCheck>, options?: $UpdateOptions<ResponseAttributes, ReturnValues, Execute, Parse, StrictSchemaCheck>, { SET, REMOVE, ADD, DELETE, ExpressionAttributeNames, ExpressionAttributeValues, ...params }?: UpdateCustomParams): UpdateCommandInput;
    put<MethodItemOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, ReturnValues extends PutOptionsReturnValues = 'NONE', Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined, StrictSchemaCheck extends boolean | undefined = true>(item: PutItem<MethodItemOverlay, EntityItemOverlay, CompositePrimaryKey, Item, Attributes, StrictSchemaCheck>, options?: $PutOptions<ResponseAttributes, ReturnValues, Execute, Parse, StrictSchemaCheck>, params?: Partial<PutCommandInput>): Promise<If<B.Not<ShouldExecute<Execute, AutoExecute>>, PutCommandInput, If<B.Not<ShouldParse<Parse, AutoParse>>, PutCommandOutput, If<B.And<A.Equals<ReturnValues, 'NONE'>, A.Equals<MethodItemOverlay, undefined>>, O.Omit<PutCommandOutput, 'Attributes'>, O.Update<PutCommandOutput, 'Attributes', FirstDefined<[MethodItemOverlay, EntityItemOverlay, Compute<O.Pick<Item, ResponseAttributes>>]>>>>>>;
    /**
     * Generate parameters for PUT batch operation
     * @param {object} item - The item you wish to put.
     * @param {object} options - Options for the operation.
     *
     * Only Item is supported (e.g. no conditions)
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
     */
    putBatch<MethodItemOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined, StrictSchemaCheck extends boolean | undefined = true>(item: PutItem<MethodItemOverlay, EntityItemOverlay, CompositePrimaryKey, Item, Attributes, StrictSchemaCheck>, options?: $PutBatchOptions<Execute, Parse, StrictSchemaCheck>): {
        [key: string]: WriteRequest;
    };
    /**
     * Generate parameters for PUT transaction operation
     * @param {object} item - The item you wish to put.
     * @param {object} [options] - Additional put options
     * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the put request.
     *
     * Creates a Put object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Put.html
     */
    putTransaction<MethodItemOverlay extends Overlay = undefined, ItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['all'], keyof MethodItemOverlay>, ResponseAttributes extends ItemAttributes = ItemAttributes, StrictSchemaCheck extends boolean | undefined = true>(item: PutItem<MethodItemOverlay, EntityItemOverlay, CompositePrimaryKey, Item, Attributes, StrictSchemaCheck>, options?: TransactionOptions<ResponseAttributes, StrictSchemaCheck>, params?: Partial<PutCommandInput>): {
        Put: Put;
    };
    putParams<MethodItemOverlay extends Overlay = undefined, ShownItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['shown'], keyof MethodItemOverlay>, ResponseAttributes extends ShownItemAttributes = ShownItemAttributes, ReturnValues extends PutOptionsReturnValues = 'NONE', Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined, StrictSchemaCheck extends boolean | undefined = true>(item: PutItem<MethodItemOverlay, EntityItemOverlay, CompositePrimaryKey, Item, Attributes, StrictSchemaCheck>, options?: $PutOptions<ResponseAttributes, ReturnValues, Execute, Parse, StrictSchemaCheck>, params?: Partial<PutCommandInput>): PutCommandInput;
    /**
     * Generate parameters for ConditionCheck transaction operation
     * @param {object} item - The keys from item you wish to check.
     * @param {object} [options] - Additional condition check options
     *
     * Creates a ConditionCheck object:
     *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ConditionCheck.html
     */
    conditionCheck<MethodItemOverlay extends Overlay = undefined, MethodCompositeKeyOverlay extends Overlay = undefined, ItemAttributes extends A.Key = If<A.Equals<MethodItemOverlay, undefined>, Attributes['all'], keyof MethodItemOverlay>, ResponseAttributes extends ItemAttributes = ItemAttributes>(item: FirstDefined<[MethodCompositeKeyOverlay, EntityCompositeKeyOverlay, CompositePrimaryKey]>, options?: TransactionOptions<ResponseAttributes>): {
        ConditionCheck: ConditionCheck;
    };
    query<MethodItemOverlay extends Overlay = undefined, ItemAttributes extends {
        all: A.Key;
        shown: A.Key;
    } = If<A.Equals<MethodItemOverlay, undefined>, {
        all: Attributes['all'];
        shown: Attributes['shown'];
    }, {
        all: keyof MethodItemOverlay;
        shown: keyof MethodItemOverlay;
    }>, ResponseAttributes extends ItemAttributes['shown'] = ItemAttributes['shown'], FiltersAttributes extends ItemAttributes['all'] = ItemAttributes['all'], Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(pk: any, options?: EntityQueryOptions<ResponseAttributes, FiltersAttributes, Execute, Parse>, params?: Partial<QueryInput>): Promise<If<A.Equals<Execute, false>, import("@aws-sdk/lib-dynamodb").QueryCommandInput, If<A.Equals<Parse, false>, {
        ConsumedCapacity?: {
            TableName?: string | undefined;
            CapacityUnits?: number | undefined;
            ReadCapacityUnits?: number | undefined;
            WriteCapacityUnits?: number | undefined;
            Table?: {
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                CapacityUnits?: number | undefined;
            } | undefined;
            LocalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
            GlobalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
        } | undefined;
        $metadata: {
            httpStatusCode?: number | undefined;
            requestId?: string | undefined;
            extendedRequestId?: string | undefined;
            cfId?: string | undefined;
            attempts?: number | undefined;
            totalRetryDelay?: number | undefined;
        };
        Count?: number | undefined;
        ScannedCount?: number | undefined;
        Items?: {
            [x: string]: any;
        }[] | undefined;
        LastEvaluatedKey?: {
            [x: string]: any;
        } | undefined;
        next?: (() => Promise<{
            ConsumedCapacity?: {
                TableName?: string | undefined;
                CapacityUnits?: number | undefined;
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                Table?: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                } | undefined;
                LocalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
                GlobalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
            } | undefined;
            $metadata: {
                httpStatusCode?: number | undefined;
                requestId?: string | undefined;
                extendedRequestId?: string | undefined;
                cfId?: string | undefined;
                attempts?: number | undefined;
                totalRetryDelay?: number | undefined;
            };
            Count?: number | undefined;
            ScannedCount?: number | undefined;
            Items?: {
                [x: string]: any;
            }[] | undefined;
            LastEvaluatedKey?: {
                [x: string]: any;
            } | undefined;
        }>) | undefined;
    }, {
        ConsumedCapacity?: {
            TableName?: string | undefined;
            CapacityUnits?: number | undefined;
            ReadCapacityUnits?: number | undefined;
            WriteCapacityUnits?: number | undefined;
            Table?: {
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                CapacityUnits?: number | undefined;
            } | undefined;
            LocalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
            GlobalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
        } | undefined;
        $metadata: {
            httpStatusCode?: number | undefined;
            requestId?: string | undefined;
            extendedRequestId?: string | undefined;
            cfId?: string | undefined;
            attempts?: number | undefined;
            totalRetryDelay?: number | undefined;
        };
        Count?: number | undefined;
        ScannedCount?: number | undefined;
        Items?: Compute<FirstDefined<[MethodItemOverlay, O.Pick<Item, ResponseAttributes>]>>[] | undefined;
        LastEvaluatedKey?: {
            [x: string]: any;
        } | undefined;
        next?: (() => Promise<{
            ConsumedCapacity?: {
                TableName?: string | undefined;
                CapacityUnits?: number | undefined;
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                Table?: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                } | undefined;
                LocalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
                GlobalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
            } | undefined;
            $metadata: {
                httpStatusCode?: number | undefined;
                requestId?: string | undefined;
                extendedRequestId?: string | undefined;
                cfId?: string | undefined;
                attempts?: number | undefined;
                totalRetryDelay?: number | undefined;
            };
            Count?: number | undefined;
            ScannedCount?: number | undefined;
            Items?: Compute<FirstDefined<[MethodItemOverlay, O.Pick<Item, ResponseAttributes>]>>[] | undefined;
            LastEvaluatedKey?: {
                [x: string]: any;
            } | undefined;
        }>) | undefined;
    }>>>;
    scan<MethodItemOverlay extends Overlay = undefined, Execute extends boolean | undefined = undefined, Parse extends boolean | undefined = undefined>(options?: ScanOptions<Execute, Parse>, params?: Partial<ScanInput>): Promise<If<A.Equals<Execute, false>, import("@aws-sdk/lib-dynamodb").ScanCommandInput, If<A.Equals<Parse, false>, {
        ConsumedCapacity?: {
            TableName?: string | undefined;
            CapacityUnits?: number | undefined;
            ReadCapacityUnits?: number | undefined;
            WriteCapacityUnits?: number | undefined;
            Table?: {
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                CapacityUnits?: number | undefined;
            } | undefined;
            LocalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
            GlobalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
        } | undefined;
        $metadata: {
            httpStatusCode?: number | undefined;
            requestId?: string | undefined;
            extendedRequestId?: string | undefined;
            cfId?: string | undefined;
            attempts?: number | undefined;
            totalRetryDelay?: number | undefined;
        };
        Count?: number | undefined;
        ScannedCount?: number | undefined;
        Items?: {
            [x: string]: any;
        }[] | undefined;
        LastEvaluatedKey?: {
            [x: string]: any;
        } | undefined;
        next?: (() => Promise<{
            ConsumedCapacity?: {
                TableName?: string | undefined;
                CapacityUnits?: number | undefined;
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                Table?: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                } | undefined;
                LocalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
                GlobalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
            } | undefined;
            $metadata: {
                httpStatusCode?: number | undefined;
                requestId?: string | undefined;
                extendedRequestId?: string | undefined;
                cfId?: string | undefined;
                attempts?: number | undefined;
                totalRetryDelay?: number | undefined;
            };
            Count?: number | undefined;
            ScannedCount?: number | undefined;
            Items?: {
                [x: string]: any;
            }[] | undefined;
            LastEvaluatedKey?: {
                [x: string]: any;
            } | undefined;
        }>) | undefined;
    }, {
        ConsumedCapacity?: {
            TableName?: string | undefined;
            CapacityUnits?: number | undefined;
            ReadCapacityUnits?: number | undefined;
            WriteCapacityUnits?: number | undefined;
            Table?: {
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                CapacityUnits?: number | undefined;
            } | undefined;
            LocalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
            GlobalSecondaryIndexes?: {
                [x: string]: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                };
            } | undefined;
        } | undefined;
        $metadata: {
            httpStatusCode?: number | undefined;
            requestId?: string | undefined;
            extendedRequestId?: string | undefined;
            cfId?: string | undefined;
            attempts?: number | undefined;
            totalRetryDelay?: number | undefined;
        };
        Count?: number | undefined;
        ScannedCount?: number | undefined;
        Items?: Compute<FirstDefined<[MethodItemOverlay, AttributeMap]>>[] | undefined;
        LastEvaluatedKey?: {
            [x: string]: any;
        } | undefined;
        next?: (() => Promise<{
            ConsumedCapacity?: {
                TableName?: string | undefined;
                CapacityUnits?: number | undefined;
                ReadCapacityUnits?: number | undefined;
                WriteCapacityUnits?: number | undefined;
                Table?: {
                    ReadCapacityUnits?: number | undefined;
                    WriteCapacityUnits?: number | undefined;
                    CapacityUnits?: number | undefined;
                } | undefined;
                LocalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
                GlobalSecondaryIndexes?: {
                    [x: string]: {
                        ReadCapacityUnits?: number | undefined;
                        WriteCapacityUnits?: number | undefined;
                        CapacityUnits?: number | undefined;
                    };
                } | undefined;
            } | undefined;
            $metadata: {
                httpStatusCode?: number | undefined;
                requestId?: string | undefined;
                extendedRequestId?: string | undefined;
                cfId?: string | undefined;
                attempts?: number | undefined;
                totalRetryDelay?: number | undefined;
            };
            Count?: number | undefined;
            ScannedCount?: number | undefined;
            Items?: Compute<FirstDefined<[MethodItemOverlay, AttributeMap]>>[] | undefined;
            LastEvaluatedKey?: {
                [x: string]: any;
            } | undefined;
        }>) | undefined;
    }>>>;
    setTable<NextTable extends TableDef | undefined>(table: NextTable): Entity<Name, EntityItemOverlay, EntityCompositeKeyOverlay, NextTable, AutoExecute, AutoParse, Timestamps, CreatedAlias, ModifiedAlias, TypeAlias, TypeHidden, ReadonlyAttributeDefinitions, WritableAttributeDefinitions, Attributes, $Item, Item, CompositePrimaryKey>;
}
export default Entity;
export declare const shouldExecute: (execute: boolean | undefined, autoExecute: boolean) => boolean;
export declare const shouldParse: (parse: boolean | undefined, autoParse: boolean) => boolean;
