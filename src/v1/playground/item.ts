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
  reqStr: string().required(),
  reqStrWithDef: string().required().default('string'),
  hiddenStr: string().hidden(),
  num: number(),
  bool: boolean(),
  bin: binary(),
  map: map({
    nestedMap: map({
      str: string()
    })
  }),
  reqMap: map({
    str: string()
  }).required(),
  hiddenMap: map({
    str: string()
  }).hidden(),
  reqList: list(
    map({
      str: string()
    }).required()
  ).required(),
  hiddenList: list(string().required()).hidden()
})
const frozenPlaygroundItem1 = freezeItem(playgroundItem1)

type PlaygroundItem1PutItemInput = PutItemInput<typeof frozenPlaygroundItem1>
type PlaygroundItem1FormattedItem = FormattedItem<typeof frozenPlaygroundItem1>

const allCasesOfProps = {
  optProp: string(),
  optPropWithInitDef: string().default('foo'),
  optPropWithCompDef: string().default(ComputedDefault),
  reqProp: string().required(),
  reqPropWithInitDef: string().required().default('baz'),
  reqPropWithCompDef: string().required().default(ComputedDefault)
}

const playgroundItem2 = item({
  ...allCasesOfProps,
  map: map(allCasesOfProps).required(),
  list: list(map(allCasesOfProps).required()).required()
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
  keyEl: string().key().required(),
  nonKeyEl: string(),
  coucou: map({
    renamed: string().required().savedAs('bar').key()
  })
    .required()
    .savedAs('baz')
    .key()
    .open(),
  anyvalue: any().required()
})

const frozenPlaygroundItem3 = freezeItem(playgroundItem3)

type PlaygroundItem3SavedItem = SavedItem<typeof frozenPlaygroundItem3>
type PlaygroundItem3KeyInput = KeyInput<typeof frozenPlaygroundItem3>
type PlaygroundItem3HasComputedDefault = _HasComputedDefaults<typeof playgroundItem3>
