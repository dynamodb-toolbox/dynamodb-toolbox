/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { A } from 'ts-toolbelt';
import { TableDef } from '../classes/Table/types.js';
export declare type ProjectionAttributesTable = {
    [key: string]: ProjectionAttributes;
};
export declare type ProjectionAttributes = A.Key | ProjectionAttributeType | (A.Key | ProjectionAttributeType)[];
export declare type ProjectionAttributeType = {
    [key: string]: string | string[];
};
declare const projectionBuilder: <EntityTable extends TableDef | undefined>(attributes: ProjectionAttributes, table: EntityTable, entity: string | null, type?: boolean) => {
    names: {
        [key: string]: string;
    };
    projections: string;
    entities: {};
    tableAttrs: string[];
};
export default projectionBuilder;
