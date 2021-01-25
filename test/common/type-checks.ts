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

const isSmockVariable = (obj: any): boolean => {
  return obj && obj.will && obj.will.be
}

const isSmockLibrary = (obj: any): boolean => {
  return (
    obj &&
    obj.functions &&
    Object.values(obj.functions).every((smockFunction: any) => {
      return isSmockFunction(smockFunction)
    })
  )
}

export const isSmockContract = (obj: any): boolean => {
  return (
    obj &&
    obj.smocked &&
    obj.smocked.fallback &&
    obj.smocked.functions &&
    Object.values(obj.smocked.functions).every((smockFunction: any) => {
      return isSmockFunction(smockFunction)
    })
  )
}

export const isMagicSmockContract = (obj: any): boolean => {
  return (
    isSmockContract(obj) &&
    obj.smocked.variables &&
    Object.values(obj.smocked.variables).every((smockVariable: any) => {
      return isSmockVariable(smockVariable)
    }) &&
    obj.smocked.libraries &&
    Object.values(obj.smocked.libraries).every((smockLibrary: any) => {
      return isSmockLibrary(smockLibrary)
    })
  )
}
