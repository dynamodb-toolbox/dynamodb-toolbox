/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  binary,
  boolean,
  number,
  string,
  map,
  list,
  any,
  schema,
  PutItemInput,
  FormattedValue,
  SavedItem,
  KeyInput,
  ParserInput
} from 'v1'
import { Parser } from 'v1/schema/actions/parse'
import { Formatter } from 'v1/schema/actions/format'

const playgroundSchema1 = schema({
  reqStr: string(),
  reqStrWithDef: string().putDefault('string'),
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

const parsedValue = playgroundSchema1.build(Parser).parse({ foo: 'bar' })
const formattedValue = playgroundSchema1.build(Formatter).format({ foo: 'bar' })

type PlaygroundSchema1PutItemInput = ParserInput<typeof playgroundSchema1>
type PlaygroundSchema1FormattedItem = FormattedValue<typeof playgroundSchema1>

const listAttr = list(string()).optional().freeze()
const parsedValue2 = listAttr.build(Parser).parse({ foo: 'bar' })
const formattedValue2 = listAttr.build(Formatter).format({ foo: 'bar' })

const strAttr = string().optional().freeze()
const parsedValue3 = strAttr.build(Parser).parse({ foo: 'bar' })
const formattedValue3 = strAttr.build(Formatter).format({ foo: 'bar' })

const allCasesOfProps = {
  optProp: string().optional(),
  optPropWithDef: string().optional().putDefault('foo'),
  reqProp: string(),
  reqPropWithDef: string().putDefault('baz')
}

const playgroundSchema2 = schema({
  ...allCasesOfProps,
  map: map(allCasesOfProps),
  list: list(map(allCasesOfProps))
}).and(schema => ({
  optLink: string()
    .optional()
    .putLink<typeof schema>(({ optPropWithDef }) => optPropWithDef),
  reqLink: string().putLink<typeof schema>(({ reqPropWithDef }) => reqPropWithDef)
}))

type PlaygroundSchema2FormattedItem = FormattedValue<typeof playgroundSchema2>
type PlaygroundSchema2PutItemInput = ParserInput<typeof playgroundSchema2>
type PlaygroundSchema2PutItemInputWithDefaults = ParserInput<
  typeof playgroundSchema2,
  { fill: false }
>

const playgroundSchema3 = schema({
  keyEl: string().key(),
  nonKeyEl: string().optional(),
  coucou: map({
    renamed: string().savedAs('bar').key()
  })
    .savedAs('baz')
    .key(),
  anyvalue: any()
})

type PlaygroundSchema3SavedItem = SavedItem<typeof playgroundSchema3>
type PlaygroundSchema3KeyInput = KeyInput<typeof playgroundSchema3>
