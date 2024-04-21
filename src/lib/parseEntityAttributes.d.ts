import { AttributeDefinitions } from '../classes/Entity/types.js';
import { TrackingInfo } from './parseEntity.js';
declare const parseEntityAttributes: <ReadonlyAttributeDefinitions extends AttributeDefinitions | {
    [x: string]: import("ts-toolbelt/out/Object/Readonly.js").ReadonlyDeep<import("../classes/Entity/types.js").AttributeDefinition>;
    [x: number]: import("ts-toolbelt/out/Object/Readonly.js").ReadonlyDeep<import("../classes/Entity/types.js").AttributeDefinition>;
    [x: symbol]: import("ts-toolbelt/out/Object/Readonly.js").ReadonlyDeep<import("../classes/Entity/types.js").AttributeDefinition>;
}>(attributes: ReadonlyAttributeDefinitions, track: TrackingInfo) => {
    keys: any;
    attributes: Record<string, Partial<{
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
    }>>;
};
export default parseEntityAttributes;
