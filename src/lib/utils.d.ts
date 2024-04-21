import { A, L } from 'ts-toolbelt';
import { PureAttributeDefinition } from '../classes/Entity/types.js';
import { DynamoDBTypes, DynamoDBKeyTypes } from '../classes/Table/types.js';
export declare const validTypes: DynamoDBTypes[];
export declare const validKeyTypes: DynamoDBKeyTypes[];
export declare const isDynamoDbType: (value: string) => value is DynamoDBTypes;
export declare const isDynamoDbKeyType: (value: string) => value is DynamoDBKeyTypes;
export declare const toBool: (val: any) => boolean;
export declare const toDynamoBigInt: (value: bigint) => any;
export declare const hasValue: (val: any) => boolean;
export declare const isEmpty: (val: any) => boolean;
export declare const error: (err: string) => never;
export declare const typeError: (field: string) => void;
export declare const keyTypeError: (field: string) => void;
export declare const conditionError: (op: string) => never;
export declare const transformAttr: (mapping: PureAttributeDefinition, value: any, data: {}) => any;
export declare function typeOf(data?: any): any;
export declare function isArrayOfSameType<T>(array: Array<T>): boolean;
export declare function isBinary(data: any): boolean;
export declare type If<C extends 0 | 1, T, E = never> = C extends 1 ? (1 extends C ? T : E) : E;
export declare type FirstDefined<List extends L.List> = {
    stopNone: undefined;
    stopOne: L.Head<List>;
    continue: FirstDefined<L.Tail<List>>;
}[A.Cast<If<A.Equals<List, []>, 'stopNone', If<A.Equals<L.Head<List>, undefined>, 'continue', 'stopOne'>>, 'stopNone' | 'stopOne' | 'continue'>];
export declare type Compute<A> = A extends Promise<infer T> ? Promise<Compute<T>> : A extends (...args: infer P) => infer R ? (...args: Compute<P>) => Compute<R> : A extends Set<infer V> ? Set<Compute<V>> : A extends object ? {
    [key in keyof A]: Compute<A[key]>;
} : A;
