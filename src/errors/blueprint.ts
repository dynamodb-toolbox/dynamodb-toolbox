interface ErrorBlueprintConstraint {
  code: string
  hasPath: boolean
  payload: unknown
}

/** Blueprint of a DynamoDB-Toolbox error: its `code`, whether it carries a `path`, and its `payload` type. */
export type ErrorBlueprint<BLUEPRINT extends ErrorBlueprintConstraint = ErrorBlueprintConstraint> =
  BLUEPRINT
