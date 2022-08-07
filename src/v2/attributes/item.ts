import { O } from 'ts-toolbelt'

import { Mapped } from './map'
import { MappedProperties } from './property'
import { Narrow, PreComputedDefaults, PostComputedDefaults } from './utility'

type DefaultsComputer<P extends MappedProperties = MappedProperties> = (
  preDefaults: PreComputedDefaults<Mapped<P>>
) => PostComputedDefaults<Mapped<P>>

interface _ItemOptions<
  P extends MappedProperties = MappedProperties,
  D extends DefaultsComputer<P> | undefined = DefaultsComputer<P> | undefined
> {
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
  computeDefaults: D
}

const itemDefaultOptions: ItemOptions<{}, undefined> = {
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
  const { computeDefaults: _computeDefaults } = appliedOptions

  return {
    _type: 'item',
    _properties,
    _computeDefaults,
    computeDefaults: nextComputeDefaults =>
      item(_properties, { ...appliedOptions, computeDefaults: nextComputeDefaults })
  } as Item<P, D>
}
