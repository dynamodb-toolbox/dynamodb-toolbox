type DeepCloner = <OBJ>(obj: OBJ) => OBJ

export const cloneDeep: DeepCloner = <OBJ>(obj: OBJ): OBJ => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as OBJ
  }

  if (obj instanceof Array) {
    return obj.map(cloneDeep) as unknown as OBJ
  }

  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, cloneDeep(value)])
    ) as OBJ
  }

  throw new Error('Unable to clone object')
}
