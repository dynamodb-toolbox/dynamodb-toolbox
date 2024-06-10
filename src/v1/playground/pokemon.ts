import { EntityV2 } from 'v1/entity'
import { EntityConditionParser } from 'v1/entity/actions/parseCondition'
import { schema } from 'v1/schema'
import { number, string } from 'v1/schema/attributes'
import { MyTable } from './table'

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
