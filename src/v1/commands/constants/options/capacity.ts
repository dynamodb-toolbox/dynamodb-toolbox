export type NoneCapacityOption = 'NONE'
export type TotalCapacityOption = 'TOTAL'
export type IndexesCapacityOption = 'INDEXES'

export type CapacityOption = NoneCapacityOption | TotalCapacityOption | IndexesCapacityOption

export const capacityOptionsSet = new Set<CapacityOption>(['NONE', 'TOTAL', 'INDEXES'])
