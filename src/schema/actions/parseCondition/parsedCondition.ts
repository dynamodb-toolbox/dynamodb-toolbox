import type { SchemaCondition } from './condition.js'

export class ParsedCondition {
  constructor(public condition: SchemaCondition) {}

  // express(): ConditionExpression {}
}

// export class _Condition {
//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(condition: _AnyCondition, { force = false }: { force?: boolean } = {}): _AnyCondition {
//     if (!force && this.implies(condition)) {
//       return this
//     }

//     // TODO
//   }

//   or(condition: _AnyCondition, { force = false }: { force?: boolean } = {}): void {
//     if (!force && this.implies(condition)) {
//       return
//     }

//     // TODO
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// type _AnyCondition =
//   | _EqCondition
//   | _NotEqCondition
//   | _InCondition
//   | _ContainsCondition
//   | _TypeCondition
//   | _GteCondition
//   | _GtCondition
//   | _LteCondition
//   | _LtCondition
//   | _BetweenCondition
//   | _BeginsWithCondition
//   | _OrCondition
//   | _AndCondition
//   | _NotCondition

// class _EqCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _NotEqCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _InCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _ContainsCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _TypeCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _GteCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _GtCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _LteCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _LtCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _BetweenCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _BeginsWithCondition implements _Condition {
//   constructor(
//     public path: Path,
//     public value: unknown
//   ) {}

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _AndCondition implements _Condition {
//   conditions: _AnyCondition[]

//   constructor(conditions: _AndCondition[]) {
//     this.conditions = conditions
//   }

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): _AnyCondition {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _OrCondition implements _Condition {
//   conditions: _AnyCondition[]

//   constructor(conditions: _AndCondition[]) {
//     this.conditions = conditions
//   }

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): _AnyCondition {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }

// class _NotCondition implements _Condition {
//   condition: _AnyCondition

//   constructor(conditions: _AndCondition[]) {
//     this.conditions = conditions
//   }

//   implies(condition: _AnyCondition): boolean {
//     return false
//   }

//   and(cond: _AnyCondition): boolean {
//     // TODO
//     return false
//   }

//   express(prefix = ''): ConditionExpression {
//     const ConditionExpression = ''
//     const ExpressionAttributeNames: ConditionExpression['ExpressionAttributeNames'] = {}
//     const ExpressionAttributeValues: ConditionExpression['ExpressionAttributeValues'] = {}

//     // TODO

//     return { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }
//   }
// }
