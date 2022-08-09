import { O } from 'ts-toolbelt'

import { Mapped } from './map'
import { MappedProperties } from './property'
import { Narrow, PreComputedDefaults, PostComputedDefaults, validateProperty } from './utility'

type DefaultsComputer<P extends MappedProperties = MappedProperties> = (
  preDefaults: PreComputedDefaults<Mapped<P>>
) => PostComputedDefaults<Mapped<P>>

interface _ItemOptions<
  P extends MappedProperties = MappedProperties,
  D extends DefaultsComputer<P> | undefined = DefaultsComputer<P> | undefined
> {
  _validate: boolean
  _computeDefaults: D
}

export interface Item<
  P extends MappedProperties = MappedProperties,
  D extends DefaultsComputer<P> | undefined = DefaultsComputer<P> | undefined
> extends _ItemOptions<P, D> {
  _type: 'item'
  _properties: P
  computeDefaults: <$D extends DefaultsComputer<P> | undefined>(
    nextComputeDefaults: $D
  ) => Item<P, D>
}

interface ItemOptions<
  P extends MappedProperties = MappedProperties,
  D extends DefaultsComputer<P> | undefined = DefaultsComputer<P> | undefined
> {
  _validate: boolean
  computeDefaults: D
}

const itemDefaultOptions: ItemOptions<{}, undefined> = {
  _validate: true,
  computeDefaults: undefined
}

type ItemTyper = <
  P extends MappedProperties = {},
  D extends DefaultsComputer<P> | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<ItemOptions<P, D>>
) => Item<P, D>

export const item: ItemTyper = <
  P extends MappedProperties = {},
  D extends DefaultsComputer<P> | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<ItemOptions<P, D>>
): Item<P, D> => {
  const appliedOptions = { ...itemDefaultOptions, ...options }
  const { _validate: validate, computeDefaults: _computeDefaults } = appliedOptions

  if (validate) {
    Object.entries(_properties).forEach(([propertyName, property]) => {
      validateProperty(property, propertyName)
    })
  }

  return {
    _type: 'item',
    _properties,
    _computeDefaults,
    computeDefaults: nextComputeDefaults =>
      item(_properties, {
        ...appliedOptions,
        _validate: false,
        computeDefaults: nextComputeDefaults
      })
  } as Item<P, D>
}
