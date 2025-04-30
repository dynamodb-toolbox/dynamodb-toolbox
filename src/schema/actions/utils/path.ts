import { formatArrayPath } from './formatArrayPath.js'
import { parseStringPath } from './parseStringPath.js'
import type { ArrayPath, StrPath } from './types.js'

export class Path {
  arrayPath: ArrayPath
  strPath: StrPath

  static fromArray(arrayPath: ArrayPath): Path {
    return new Path(formatArrayPath(arrayPath), arrayPath)
  }

  constructor(strPath = '', arrayPath = parseStringPath(strPath)) {
    this.arrayPath = arrayPath
    this.strPath = formatArrayPath(this.arrayPath)
  }

  prepend(...arrayPath: ArrayPath): Path {
    return this.prependPath(Path.fromArray(arrayPath))
  }

  prependPath(path: Path): Path {
    return new Path(
      [path.strPath, this.strPath].filter(Boolean).join(this.strPath[0] !== '[' ? '.' : ''),
      path.arrayPath.concat(this.arrayPath)
    )
  }

  append(...arrayPath: ArrayPath): Path {
    return this.appendPath(Path.fromArray(arrayPath))
  }

  appendPath(path: Path): Path {
    return new Path(
      [this.strPath, path.strPath].filter(Boolean).join(path.strPath[0] !== '[' ? '.' : ''),
      this.arrayPath.concat(path.arrayPath)
    )
  }
}
