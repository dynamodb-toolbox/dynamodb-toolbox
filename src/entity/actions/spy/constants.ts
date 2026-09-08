export const $actionName = Symbol('$actionName')
/** Symbol key for the intercepted action's name on a stub/inspector. */
export type $actionName = typeof $actionName

export const $sentActions = Symbol('$sentActions')
/** Symbol key for a spy's recorded sent actions. */
export type $sentActions = typeof $sentActions

export const $spy = Symbol('$spy')
/** Symbol key for the spy referenced by a stub/inspector. */
export type $spy = typeof $spy

export const $mocks = Symbol('$mocks')
/** Symbol key for a spy's action mocks. */
export type $mocks = typeof $mocks
