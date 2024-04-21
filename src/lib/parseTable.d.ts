import { A } from 'ts-toolbelt';
import { TableConstructor, TableIndexes } from '../classes/Table/types.js';
export declare type ParsedTable = ReturnType<typeof parseTable>;
export declare const parseTable: <Name extends string, PartitionKey extends A.Key, SortKey extends A.Key | null>(table: TableConstructor<Name, PartitionKey, SortKey>) => {
    name: Name;
    alias: string | null;
    Table: {
        partitionKey: PartitionKey;
        sortKey: SortKey;
        entityField: string | false;
        attributes: any;
        indexes: TableIndexes;
    };
    autoExecute: boolean | undefined;
    autoParse: boolean | undefined;
    removeNullAttributes: boolean | undefined;
    _entities: never[];
} & ({
    DocumentClient: import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
} | {
    DocumentClient?: undefined;
}) & ({
    entities: {};
} | {
    entities?: undefined;
});
export default parseTable;
