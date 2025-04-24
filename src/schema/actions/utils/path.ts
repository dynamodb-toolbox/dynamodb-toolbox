import { formatArrayPath } from './formatArrayPath.js'
import { parseStringPath } from './parseStringPath.js'
import type { ArrayPath, StrPath } from './types.js'

export class Path {
  arrayPath: ArrayPath
  strPath: StrPath

  static fromArray(arrayPath: ArrayPath): Path {
    return new Path({
      arrayPath,
      strPath: formatArrayPath(arrayPath)
    })
  }

  static fromStr(strPath: StrPath): Path {
    const arrayPath = parseStringPath(strPath)
    return Path.fromArray(arrayPath)
  }

  constructor({ arrayPath, strPath }: { arrayPath: ArrayPath; strPath: StrPath }) {
    this.arrayPath = arrayPath
    this.strPath = strPath
  }

  prepend(path: Path): Path {
    return new Path({
      arrayPath: path.arrayPath.concat(this.arrayPath),
      strPath: [path.strPath, this.strPath].filter(Boolean).join(this.strPath[0] !== '[' ? '.' : '')
    })
  }

  append(path: Path): Path {
    return new Path({
      arrayPath: this.arrayPath.concat(path.arrayPath),
      strPath: [this.strPath, path.strPath].filter(Boolean).join(path.strPath[0] !== '[' ? '.' : '')
    })
  }
}
