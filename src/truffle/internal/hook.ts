const locals = require('import-locals')
locals.export('ethereumjs-vm/dist/runTx', 'evm_1')

import { VM4xEngine } from '../../engine/vm4.x/engine'

if (!global.smengines) {
  global.smengines = {}
}

if (!('truffle' in global.smengines)) {
  const engine = new VM4xEngine()

  const { evm_1 } = require('ethereumjs-vm/dist/runTx')
  engine.attachEVM(evm_1)

  global.smengines['truffle'] = engine
}

export const engine = global.smengines['truffle'] as VM4xEngine
