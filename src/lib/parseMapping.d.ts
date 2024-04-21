/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { PartitionKeyDefinition, GSIPartitionKeyDefinition, SortKeyDefinition, GSISortKeyDefinition, PureAttributeDefinition } from '../classes/Entity/types.js';
import { TrackingInfo } from './parseEntity.js';
declare const _default: (field: string, config: PartitionKeyDefinition | GSIPartitionKeyDefinition | SortKeyDefinition | GSISortKeyDefinition | PureAttributeDefinition, track: TrackingInfo) => {
    [x: string]: PartitionKeyDefinition | GSIPartitionKeyDefinition | SortKeyDefinition | GSISortKeyDefinition | Partial<{
        partitionKey: false;
        sortKey: false;
        type: import("../classes/Table/types.js").DynamoDBTypes;
        default: any;
        dependsOn: string | string[];
        transform: (value: any, data: {}) => any;
        format: (value: any, data: {}) => any;
        coerce: boolean;
        save: boolean;
        onUpdate: boolean;
        hidden: boolean;
        required: boolean | "always";
        alias: string;
        map: string;
        setType: import("../classes/Table/types.js").DynamoDBKeyTypes;
        delimiter: string;
        prefix: string;
        suffix: string;
    }>;
} & {
    [x: string]: ({
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        partitionKey: true;
        sortKey?: false | undefined;
    } | {
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        partitionKey: string;
        sortKey?: false | undefined;
    } | {
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        sortKey: true;
        partitionKey?: false | undefined;
    } | {
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        partitionKey?: false | undefined;
        sortKey: string;
    } | {
        partitionKey?: false | undefined;
        sortKey?: false | undefined;
        type?: import("../classes/Table/types.js").DynamoDBTypes | undefined;
        default?: any;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: {}) => any) | undefined;
        format?: ((value: any, data: {}) => any) | undefined;
        coerce?: boolean | undefined;
        save?: boolean | undefined;
        onUpdate?: boolean | undefined;
        hidden?: boolean | undefined;
        required?: boolean | "always" | undefined;
        setType?: import("../classes/Table/types.js").DynamoDBKeyTypes | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
    }) & {
        map: string;
    };
} & {
    [x: string]: ({
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        partitionKey: true;
        sortKey?: false | undefined;
    } | {
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        partitionKey: string;
        sortKey?: false | undefined;
    } | {
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        sortKey: true;
        partitionKey?: false | undefined;
    } | {
        type?: "string" | "number" | "bigint" | "binary" | undefined;
        default?: any;
        hidden?: boolean | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        onUpdate?: boolean | undefined;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: any) => any) | undefined;
        format?: ((value: any, data: any) => any) | undefined;
        coerce?: boolean | undefined;
        save?: undefined;
        required?: undefined;
        setType?: undefined;
        partitionKey?: false | undefined;
        sortKey: string;
    } | {
        partitionKey?: false | undefined;
        sortKey?: false | undefined;
        type?: import("../classes/Table/types.js").DynamoDBTypes | undefined;
        default?: any;
        dependsOn?: string | string[] | undefined;
        transform?: ((value: any, data: {}) => any) | undefined;
        format?: ((value: any, data: {}) => any) | undefined;
        coerce?: boolean | undefined;
        save?: boolean | undefined;
        onUpdate?: boolean | undefined;
        hidden?: boolean | undefined;
        required?: boolean | "always" | undefined;
        setType?: import("../classes/Table/types.js").DynamoDBKeyTypes | undefined;
        delimiter?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
    }) & {
        alias: string;
    };
};
export default _default;
