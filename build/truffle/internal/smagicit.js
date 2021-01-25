"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smagicit = exports.smagicify = void 0;
const ethers_1 = require("ethers");
const hook_1 = require("./hook");
const smockit_1 = require("./smockit");
const utils_1 = require("../../utils");
exports.smagicify = (contract) => {
    smockit_1.smockify(contract);
    contract.smocked.internal = {
        functions: {},
        variables: {},
    };
};
exports.smagicit = async (spec, options = {}) => {
    if (typeof spec === 'string') {
        try {
            spec = await artifacts.require(spec);
        }
        catch (err) {
            if (!err.toString().includes('HH903')) {
                throw err;
            }
            try {
                spec = new ethers_1.ethers.utils.Interface(JSON.parse(spec));
            }
            catch (err) {
                throw err;
            }
        }
    }
    else {
        try {
            spec = new ethers_1.ethers.utils.Interface(spec.abi);
        }
        catch (err) { }
    }
    const iface = spec.interface || spec;
    const contract = new ethers_1.Contract(options.address || utils_1.makeRandomAddress(), iface, options.provider || spec.provider);
    exports.smagicify(contract);
    hook_1.engine.attachSmockContract(contract);
    return contract;
};
//# sourceMappingURL=smagicit.js.map