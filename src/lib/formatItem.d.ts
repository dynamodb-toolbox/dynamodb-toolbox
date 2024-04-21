/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import type { PureAttributeDefinition } from '../classes/Entity/types.js';
import type { Linked } from './parseEntity.js';
declare const _default: () => (attributes: {
    [key: string]: Partial<{
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
}, linked: Linked, item: any, include?: string[]) => {};
export default _default;
