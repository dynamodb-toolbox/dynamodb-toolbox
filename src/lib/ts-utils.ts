export type Key = string | number | symbol;

export type Object = Record<Key, any>;

export type List<A = any> = ReadonlyArray<A>;
export type ListTail<L extends List> = L extends readonly [] ? L : L extends readonly [any?, ...infer LTail] ? LTail : L;
export type ListHead<L extends List> = L extends readonly [] ? never : L extends readonly [infer LHead, ...any[]] ? LHead : L;
