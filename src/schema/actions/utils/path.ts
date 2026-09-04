import { formatArrayPath } from './formatArrayPath.js'
import { parseStringPath } from './parseStringPath.js'
import type { ArrayPath, StrPath } from './types.js'

/**
 * An attribute path, kept in sync in both array and string forms.
 */
export class Path {
  arrayPath: ArrayPath
  strPath: StrPath

  /**
   * Build a path from its array form.
   */
  static fromArray(arrayPath: ArrayPath): Path {
    return new Path(formatArrayPath(arrayPath), arrayPath)
  }

  /**
   * Instantiate a path from its string form (or an empty root path).
   */
  constructor(strPath = '', arrayPath = parseStringPath(strPath)) {
    this.arrayPath = arrayPath
    this.strPath = formatArrayPath(this.arrayPath)
  }

  /**
   * Return a new path with the given parts prepended.
   */
  prepend(...arrayPath: ArrayPath): Path {
    return this.prependPath(Path.fromArray(arrayPath))
  }

  /**
   * Return a new path with another path prepended.
   */
  prependPath(path: Path): Path {
    return new Path(
      [path.strPath, this.strPath].filter(Boolean).join(this.strPath[0] !== '[' ? '.' : ''),
      path.arrayPath.concat(this.arrayPath)
    )
  }

  /**
   * Return a new path with the given parts appended.
   */
  append(...arrayPath: ArrayPath): Path {
    return this.appendPath(Path.fromArray(arrayPath))
  }

  /**
   * Return a new path with another path appended.
   */
  appendPath(path: Path): Path {
    return new Path(
      [this.strPath, path.strPath].filter(Boolean).join(path.strPath[0] !== '[' ? '.' : ''),
      this.arrayPath.concat(path.arrayPath)
    )
  }
}
