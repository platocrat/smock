"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engine = void 0;
const locals = require('import-locals');
locals.export('ethereumjs-vm/dist/runTx', 'evm_1');
const engine_1 = require("../../engine/vm4.x/engine");
if (!global.smengines) {
    global.smengines = {};
}
if (!('truffle' in global.smengines)) {
    const engine = new engine_1.VM4xEngine();
    const { evm_1 } = require('ethereumjs-vm/dist/runTx');
    engine.attachEVM(evm_1);
    global.smengines['truffle'] = engine;
}
exports.engine = global.smengines['truffle'];
//# sourceMappingURL=hook.js.map