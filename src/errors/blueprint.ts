interface ErrorBlueprintConstraint {
  code: string
  hasPath: boolean
  payload: unknown
}

export type ErrorBlueprint<BLUEPRINT extends ErrorBlueprintConstraint = ErrorBlueprintConstraint> =
  BLUEPRINT
