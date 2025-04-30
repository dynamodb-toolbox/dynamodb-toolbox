// import { ExpressionParser } from '~/schema/actions/utils/expressionParser.js'
// import type { ArrayPath } from '~/schema/actions/utils/types.js'
// import type { Schema, TransformedValue, ValidValue } from '~/schema/index.js'
// import { isNumber } from '~/utils/validation/isNumber.js'
// import { isString } from '~/utils/validation/isString.js'

// import { $GET, isGetting } from '../symbols/index.js'
// import type { ReferenceExtension, UpdateItemInputExtension } from '../types.js'
// import type { UpdateExpression } from './type.js'

// export class UpdateExpressionVerbParser<
//   SCHEMA extends Schema = Schema
// > extends ExpressionParser<SCHEMA> {
//   verbPrefix: 's' | 'r' | 'a' | 'd'
//   expressionAttributeValues: unknown[]

//   constructor(schema: SCHEMA, verbPrefix: 's' | 'r' | 'a' | 'd', expressionId = '') {
//     super(schema, expressionId)
//     this.verbPrefix = verbPrefix
//     this.expressionTokenPrefix = `${verbPrefix}${this.expressionId}_`
//     this.expressionAttributeValues = []
//   }

//   appendAttributeValue = (_: Schema, attributeValue: unknown): void => {
//     const expressionAttributeValueIndex = this.expressionAttributeValues.push(attributeValue)

//     this.appendToExpression(`:${this.expressionTokenPrefix}${expressionAttributeValueIndex}`)
//   }

//   beginNewInstruction = () => {
//     if (this.expression.length > 0) {
//       this.appendToExpression(', ')
//     }
//   }

//   appendValidAttributePath = (validAttributePath: ArrayPath): void => {
//     validAttributePath.forEach((pathPart, index) => {
//       if (isString(pathPart)) {
//         if (index > 0) {
//           this.appendToExpression('.')
//         }

//         this.appendToExpression(this.tokenize(pathPart))
//       }

//       if (isNumber(pathPart)) {
//         this.appendToExpression(`[${pathPart}]`)
//       }
//     })
//   }

//   appendValidAttributeValue = (
//     validAttributeValue: TransformedValue<
//       Schema,
//       { mode: 'update'; extension: UpdateItemInputExtension }
//     >
//   ): void => {
//     if (isGetting(validAttributeValue)) {
//       // TODO: Fix this cast
//       const [expression, fallback] = validAttributeValue[$GET] as [
//         string,
//         ValidValue<Schema, { mode: 'update'; extension: ReferenceExtension }> | undefined
//       ]

//       if (fallback === undefined) {
//         this.appendAttributePath(expression)
//         return
//       }

//       if (fallback !== undefined) {
//         this.appendToExpression('if_not_exists(')
//         this.appendAttributePath(expression)
//         this.appendToExpression(', ')
//         this.appendValidAttributeValue(fallback)
//         this.appendToExpression(')')
//         return
//       }
//     }

//     const expressionAttributeValueIndex = this.expressionAttributeValues.push(validAttributeValue)

//     this.appendToExpression(`:${this.expressionTokenPrefix}${expressionAttributeValueIndex}`)
//   }

//   toCommandOptions = (): UpdateExpression => {
//     const { Expression: UpdateExpression, ExpressionAttributeNames } = this.resolve()

//     const ExpressionAttributeValues: UpdateExpression['ExpressionAttributeValues'] = {}
//     this.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
//       ExpressionAttributeValues[`:${this.expressionTokenPrefix}${index + 1}`] =
//         expressionAttributeValue
//     })

//     return {
//       UpdateExpression,
//       ExpressionAttributeNames,
//       ExpressionAttributeValues
//     }
//   }

//   override clone(schema?: Schema): UpdateExpressionVerbParser {
//     const clonedParser = new UpdateExpressionVerbParser(
//       schema ?? this.schema,
//       this.verbPrefix,
//       this.expressionId
//     )

//     clonedParser.expression = [...this.expression]
//     clonedParser.expressionAttributeNames = { ...this.expressionAttributeNames }
//     clonedParser.expressionAttributeTokens = { ...this.expressionAttributeTokens }

//     clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]

//     return clonedParser
//   }
// }
