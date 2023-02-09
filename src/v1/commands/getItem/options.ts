import type { CapacityOption } from 'v1/commands/constants/options/capacity'

export interface GetItemOptions {
  capacity?: CapacityOption
  consistent?: boolean
}
