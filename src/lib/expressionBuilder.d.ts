/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { A } from 'ts-toolbelt';
import { TableDef } from '../classes/Table/types.js';
interface AttrRef {
    attr: string;
}
interface FilterExpression<Attr extends A.Key = A.Key> {
    attr?: Attr;
    size?: string;
    eq?: string | number | bigint | boolean | null | AttrRef;
    ne?: string | number | bigint | boolean | null | AttrRef;
    lt?: string | number | bigint | AttrRef;
    lte?: string | number | bigint | AttrRef;
    gt?: string | number | bigint | AttrRef;
    gte?: string | number | bigint | AttrRef;
    between?: string[] | number[] | bigint[];
    beginsWith?: string;
    in?: any[];
    contains?: string;
    exists?: boolean;
    type?: string;
    or?: boolean;
    negate?: boolean;
    entity?: string;
}
export declare const SUPPORTED_FILTER_EXP_ATTR_REF_OPERATORS: string[];
export declare type FilterExpressions<Attr extends A.Key = A.Key> = FilterExpression<Attr> | FilterExpression<Attr>[] | FilterExpressions<Attr>[];
declare const buildExpression: <Attr extends A.Key = A.Key, EntityTable extends TableDef | undefined = undefined>(exp: FilterExpressions<Attr>, table: EntityTable, entity?: string, group?: number, level?: number) => any;
export default buildExpression;
