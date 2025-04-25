import type { Path } from '~/schema/actions/utils/path.js'
import { isNumber } from '~/utils/validation/isNumber.js'

export interface ProjectionExpression {
  ProjectionExpression: string
  ExpressionAttributeNames: Record<string, string>
}

export class Projection {
  paths: Path[]
  strPaths: Set<string>

  constructor() {
    this.paths = []
    this.strPaths = new Set()
  }

  hasPath(path: Path): boolean {
    return this.strPaths.has(path.strPath)
  }

  addPath(path: Path): void {
    if (this.hasPath(path)) {
      return
    }

    this.paths.push(path)
    this.strPaths.add(path.strPath)
  }

  express(prefix = ''): ProjectionExpression {
    let ProjectionExpression = ''
    const ExpressionAttributeNames: Record<string, string> = {}

    const tokens: Record<string, string> = {}
    let cursor = 1

    this.paths.forEach((path, index) => {
      if (index > 0) {
        ProjectionExpression += ', '
      }

      path.arrayPath.forEach((pathPart, index) => {
        if (isNumber(pathPart)) {
          ProjectionExpression += `[${pathPart}]`
          return
        }

        let token = tokens[pathPart]

        if (token === undefined) {
          token = `#p${prefix}_${cursor}`
          tokens[pathPart] = token
          ExpressionAttributeNames[token] = pathPart
          cursor++
        }

        if (index > 0) {
          ProjectionExpression += '.'
        }

        ProjectionExpression += token
      })
    })

    return { ProjectionExpression, ExpressionAttributeNames }
  }
}
