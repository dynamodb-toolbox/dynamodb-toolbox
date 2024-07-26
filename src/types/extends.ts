export type Extends<LEFT, RIGHT> = [LEFT] extends [never]
  ? false
  : LEFT extends RIGHT
    ? true
    : false

export type ExtendsStr<LEFT, RIGHT> = [LEFT] extends [never]
  ? 'false'
  : LEFT extends RIGHT
    ? 'true'
    : 'false'
