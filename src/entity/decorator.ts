import { $interceptor } from './constants.js'
import type { EntitySendableAction } from './entity.js'

/**
 * Method decorator that lets an `Entity`'s interceptor hook a sendable action before it reaches DynamoDB.
 */
export const interceptable = () => {
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
