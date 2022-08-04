import {
  item,
  binary,
  boolean,
  number,
  string,
  map,
  list,
  Input,
  Output,
  ComputedDefault,
  PreComputedDefaults,
  PostComputedDefaults
} from '.'

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

type PlaygroundItem1Input = Input<typeof playgroundItem1>
type PlaygroundItem1Output = Output<typeof playgroundItem1>

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
}).computeDefaults(preComp => {
  const equivalentMap = map(allCasesOfProps)
  type PreCompProps = PreComputedDefaults<typeof equivalentMap>
  type PostCompProps = PostComputedDefaults<typeof equivalentMap>

  const fillGaps = (preComp: PreCompProps): PostCompProps => ({
    ...preComp,
    optPropWithCompDef: preComp.optPropWithCompDef ?? 'baz',
    reqPropWithCompDef: preComp.reqPropWithCompDef ?? 'foo'
  })

  return {
    ...fillGaps(preComp),
    map: fillGaps(preComp.map),
    list: preComp.list.map(fillGaps)
  }
})

type PlaygroundItem2Input = Input<typeof playgroundItem2>
type PlaygroundItem2Output = Output<typeof playgroundItem2>
