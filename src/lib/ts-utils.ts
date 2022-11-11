export type Key = string | number | symbol;

export type Object = Record<Key, any>;

export type List<A = any> = ReadonlyArray<A>;
export type ListTail<L extends List> = L extends readonly [] ? L : L extends readonly [any?, ...infer LTail] ? LTail : L;
export type ListHead<L extends List> = L extends readonly [] ? never : L extends readonly [infer LHead, ...any[]] ? LHead : L;
export type Cast<A1 extends any, A2 extends any> = A1 extends A2 ? A1 : A2;
export type Equals<A1 extends any, A2 extends any> = (<A>() => A extends A2 ? 1 : 0) extends (<A>() => A extends A1 ? 1 : 0) ? 1 : 0;
