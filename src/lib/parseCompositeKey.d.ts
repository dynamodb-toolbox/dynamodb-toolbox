import { CompositeAttributeDefinition, AttributeDefinitions } from '../classes/Entity/types.js';
import { TrackingInfo } from './parseEntity.js';
declare const parseCompositeKey: <ReadonlyAttributeDefinitions extends AttributeDefinitions | {
    [x: string]: import("ts-toolbelt/out/Object/Readonly.js").ReadonlyDeep<import("../classes/Entity/types.js").AttributeDefinition>;
    [x: number]: import("ts-toolbelt/out/Object/Readonly.js").ReadonlyDeep<import("../classes/Entity/types.js").AttributeDefinition>;
    [x: symbol]: import("ts-toolbelt/out/Object/Readonly.js").ReadonlyDeep<import("../classes/Entity/types.js").AttributeDefinition>;
}>(field: string, config: CompositeAttributeDefinition, track: TrackingInfo, schema: ReadonlyAttributeDefinitions) => ({
    [x: string]: {
        save: boolean;
    } & Partial<{
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
    }> & {
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
    } & {
        map: string;
    } & {
        alias: string;
    } & {
        link: string;
        pos: number;
    };
} & {
    [x: string]: Partial<{
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
    }> & {
        map: string;
    };
}) | undefined;
export default parseCompositeKey;
