import { $interceptor } from './constants.js'
import type { EntitySendableAction } from './entity.js'

export const sender = () => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalValue = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const action = this as EntitySendableAction
      const interceptor = action.entity[$interceptor]

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
