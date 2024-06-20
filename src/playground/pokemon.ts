import { EntityV2 } from '~/entity/index.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import { schema } from '~/schema/index.js'
import { number, string } from '~/schema/attributes/index.js'
import { MyTable } from './table.js'

const PokemonEntity = new EntityV2({
  name: 'POKEMON',
  table: MyTable,
  schema: schema({
    userId: string().key(),
    level: number().key().savedAs('sk')
  })
})

const conditionParser = PokemonEntity.build(EntityConditionParser)

// conditionParser.parse({ attr: 'level', gte: 50 })

// console.log(conditionParser.toCommandOptions())

conditionParser.setId('toto')

console.log(conditionParser.toCommandOptions())

conditionParser.parse({ attr: 'level', gte: 30 })

console.log(conditionParser.toCommandOptions())
