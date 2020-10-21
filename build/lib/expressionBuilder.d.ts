/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
declare const error: any;
declare const checkAttribute: any;
declare const buildExpression: (exp: any, table: any, entity: any, group?: number, level?: number) => any;
declare const conditionError: (op: any) => any;
declare const parseClause: (_clause: any, grp: any, table: any) => {
    logic: string;
    clause: string;
    names: {};
    values: {};
};
