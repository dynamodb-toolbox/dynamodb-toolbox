import { isObject } from 'v1/utils/validation/isObject'
import { isString } from 'v1/utils/validation/isString'

export const isAttributePath = (candidate: unknown): candidate is { attr: string } =>
  isObject(candidate) && 'attr' in candidate && isString(candidate.attr)
