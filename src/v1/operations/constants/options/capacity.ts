export type NoneCapacityOption = 'NONE'
export type TotalCapacityOption = 'TOTAL'
export type IndexesCapacityOption = 'INDEXES'

export type CapacityOption = NoneCapacityOption | TotalCapacityOption | IndexesCapacityOption

export interface CapacityOptions {
  /** Determines the level of detail about either provisioned or on-demand throughput consumption that is returned in the response. */
  capacity?: CapacityOption
}

export const capacityOptionsSet = new Set<CapacityOption>(['NONE', 'TOTAL', 'INDEXES'])
