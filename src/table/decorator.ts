import { $interceptor } from './constants.js'
import type { TableSendableAction } from './table.js'

export const interceptable = () => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalValue = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const action = this as TableSendableAction
      const interceptor = action.table[$interceptor]

      if (interceptor !== undefined) {
        const response = await interceptor(action)

        if (response !== undefined) {
          return response
        }
      }

      return originalValue.apply(this, args)
    }
  }
}
