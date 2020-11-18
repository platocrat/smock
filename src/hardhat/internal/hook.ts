const locals = require('import-locals')
locals.export("@nomiclabs/ethereumjs-vm/dist/runTx", "evm_1")

import { VM4xEngine } from '../../engine/vm4.x/engine'

if (!global.smengines) {
  global.smengines = {}
}

if (!('hardhat' in global.smengines)) {
  const engine = new VM4xEngine()

  const { evm_1 } = require("@nomiclabs/ethereumjs-vm/dist/runTx")
  const x = evm_1.default

  evm_1.default = (function () {
    return function(...args: any) {
      const evm = new x(...args)
      engine.attachEVM(evm)
      return evm
    }
  }())

  global.smengines['hardhat'] = engine
}

export const engine = global.smengines['hardhat'] as VM4xEngine
