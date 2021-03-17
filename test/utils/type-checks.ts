const isSmockFunction = (obj: any): boolean => {
  return (
    obj &&
    obj.will &&
    obj.will.return &&
    obj.will.return.with &&
    obj.will.revert &&
    obj.will.revert.with
    // TODO: obj.will.emit
  )
}

export const isSmockContract = (obj: any): boolean => {
  return (
    obj &&
    obj.smocked &&
    obj.smocked.fallback &&
    Object.values(obj.smocked).every((smockFunction: any) => {
      return isSmockFunction(smockFunction)
    })
  )
}
