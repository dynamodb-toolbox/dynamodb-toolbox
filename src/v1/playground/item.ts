/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  // typers
  binary,
  boolean,
  number,
  string,
  map,
  list,
  any,
  item,
  // constants
  ComputedDefault,
  // generics
  PutItemInput,
  PutItem,
  FormattedItem,
  SavedItem,
  KeyInput,
  _HasComputedDefaults
} from 'v1'
import { freezeItem, FreezeItem } from 'v1/item'

const playgroundItem1 = item({
  reqStr: string(),
  reqStrWithDef: string().default('string'),
  hiddenStr: string().optional().hidden(),
  num: number().optional(),
  bool: boolean().optional(),
  bin: binary().optional(),
  map: map({
    nestedMap: map({
      str: string().optional()
    }).optional()
  }).optional(),
  reqMap: map({
    str: string().optional()
  }),
  hiddenMap: map({
    str: string().optional()
  })
    .optional()
    .hidden(),
  reqList: list(
    map({
      str: string().optional()
    })
  ),
  hiddenList: list(string()).optional().hidden()
})
const frozenPlaygroundItem1 = freezeItem(playgroundItem1)

type PlaygroundItem1PutItemInput = PutItemInput<typeof frozenPlaygroundItem1>
type PlaygroundItem1FormattedItem = FormattedItem<typeof frozenPlaygroundItem1>

const allCasesOfProps = {
  optProp: string().optional(),
  optPropWithInitDef: string().optional().default('foo'),
  optPropWithCompDef: string().optional().default(ComputedDefault),
  reqProp: string(),
  reqPropWithInitDef: string().default('baz'),
  reqPropWithCompDef: string().default(ComputedDefault)
}

const playgroundItem2 = item({
  ...allCasesOfProps,
  map: map(allCasesOfProps),
  list: list(map(allCasesOfProps))
})

const frozenPlaygroundItem2 = freezeItem(playgroundItem2)

type PlaygroundItem2FormattedItem = FormattedItem<typeof frozenPlaygroundItem2>
type PlaygroundItem2HasComputedDefault = _HasComputedDefaults<typeof playgroundItem3>
type PlaygroundItem2PutItem = PutItem<typeof frozenPlaygroundItem2>
type PlaygroundItem2PutItemInput = PutItemInput<typeof frozenPlaygroundItem2>
type PlaygroundItem2PutItemInputWithDefaults = PutItemInput<
  FreezeItem<typeof playgroundItem2>,
  true
>

const playgroundItem3 = item({
  keyEl: string().key(),
  nonKeyEl: string().optional(),
  coucou: map({
    renamed: string().savedAs('bar').key()
  })
    .savedAs('baz')
    .key()
    .open(),
  anyvalue: any()
})

const frozenPlaygroundItem3 = freezeItem(playgroundItem3)

type PlaygroundItem3SavedItem = SavedItem<typeof frozenPlaygroundItem3>
type PlaygroundItem3KeyInput = KeyInput<typeof frozenPlaygroundItem3>
type PlaygroundItem3HasComputedDefault = _HasComputedDefaults<typeof playgroundItem3>
