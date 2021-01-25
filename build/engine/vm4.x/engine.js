"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VM4xEngine = void 0;
const BN = require("bn.js");
class VM4xEngine {
    constructor() {
        this.smocks = {};
    }
    attachEVM(evm) {
        if (this.evm) {
            return;
        }
        this.evm = evm;
        const hook = this._hookExecuteCall.bind(this);
        const ogvm = evm.default;
        evm.default = (function () {
            return function (...args) {
                const subvm = new ogvm(...args);
                const ogExecuteCall = subvm._executeCall.bind(subvm);
                subvm._executeCall = async (message) => {
                    return hook(ogExecuteCall, message);
                };
                return subvm;
            };
        })();
    }
    detatchEVM() {
        this.evm = undefined;
    }
    attachSmockContract(mock) {
        this.smocks[mock.smocked.id] = mock;
    }
    detatchSmockContract(mock) {
        if (typeof mock === 'string') {
            delete this.smocks[mock];
        }
        else {
            delete this.smocks[mock.smocked.id];
        }
    }
    attachMagicSmockContract(mock, id) { }
    detatchMagicSmockContract(mock) { }
    _getSmockByAddress(address) {
        for (const smock of Object.values(this.smocks)) {
            if (smock.smocked.address.toLowerCase() === address.toLowerCase()) {
                return smock;
            }
        }
    }
    async _hookExecuteCall(ogExecuteCall, message) {
        try {
            const address = '0x' + message.to.toString('hex');
            const smock = this._getSmockByAddress(address);
            if (smock) {
                const { resolve, returnValue } = await smock._smockit(message.data);
                return {
                    gasUsed: new BN(0),
                    execResult: {
                        gasUsed: new BN(0),
                        returnValue: returnValue,
                        exceptionError: resolve === 'revert' ? new VmError(`revert`) : undefined,
                    },
                };
            }
        }
        catch (err) {
            throw new Error(`Smock: Something went wrong while trying to mock a return value. Here's the error:\n${err}`);
        }
        return ogExecuteCall(message);
    }
}
exports.VM4xEngine = VM4xEngine;
class VmError {
    constructor(error) {
        this.error = error;
        this.errorType = 'VmError';
    }
}
//# sourceMappingURL=engine.js.map