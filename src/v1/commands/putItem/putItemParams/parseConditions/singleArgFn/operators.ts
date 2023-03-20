export type SingleArgFnOperator = 'exists'

export const isSingleArgFnOperator = (key: string): key is SingleArgFnOperator => key === 'exists'
