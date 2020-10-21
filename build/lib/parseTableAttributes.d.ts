/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
declare const error: any, typeError: any, keyTypeError: any, validTypes: any, validKeyTypes: any;
declare const parseAttributeConfig: (field: any, config: any) => {
    [x: number]: any;
};
