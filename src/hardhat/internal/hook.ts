const locals = require('import-locals')
locals.export('@nomiclabs/ethereumjs-vm/dist/runTx', 'evm_1')

import { VM4xEngine } from '../../engine/vm4.x/engine'

if (!global.smengines) {
  global.smengines = {}
}

if (!('hardhat' in global.smengines)) {
  const engine = new VM4xEngine()

  const { evm_1 } = require('@nomiclabs/ethereumjs-vm/dist/runTx')
  engine.attachEVM(evm_1)

  global.smengines['hardhat'] = engine
}

export const engine = global.smengines['hardhat'] as VM4xEngine
