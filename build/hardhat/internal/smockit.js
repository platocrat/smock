"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smockit = exports.smockify = void 0;
const ethers_1 = require("ethers");
const uuid = __importStar(require("uuid"));
const hardhat_1 = __importDefault(require("hardhat"));
const hook_1 = require("./hook");
const utils_1 = require("../../utils");
const fnsmockify = (smockedFunction) => {
    smockedFunction.reset = () => {
        ;
        smockedFunction.resolve = 'return';
        smockedFunction.returnValue = undefined;
    };
    smockedFunction.will = {
        get return() {
            const fn = () => {
                ;
                smockedFunction.resolve = 'return';
                smockedFunction.returnValue = undefined;
            };
            fn.with = (returnValue) => {
                ;
                smockedFunction.resolve = 'return';
                smockedFunction.returnValue = returnValue;
            };
            return fn;
        },
        get revert() {
            const fn = () => {
                ;
                smockedFunction.resolve = 'revert';
                smockedFunction.returnValue = undefined;
            };
            fn.with = (returnValue) => {
                ;
                smockedFunction.resolve = 'revert';
                smockedFunction.returnValue = returnValue;
            };
            return fn;
        },
    };
    smockedFunction.reset();
};
exports.smockify = (contract) => {
    contract.smocked = {
        id: uuid.v4(),
        address: contract.address,
        fallback: {},
        functions: {},
    };
    fnsmockify(contract.smocked.fallback);
    for (const functionName of Object.keys(contract.functions)) {
        contract.smocked.functions[functionName] = {};
        const smockedFunction = contract.smocked.functions[functionName];
        fnsmockify(smockedFunction);
    }
    ;
    contract._smockit = async function (data) {
        let fn;
        try {
            const sighash = utils_1.toHexString(data.slice(0, 4));
            fn = this.interface.getFunction(sighash);
        }
        catch (err) {
            fn = null;
        }
        let params;
        let mockFn;
        if (fn !== null) {
            params = this.interface.decodeFunctionData(fn, utils_1.toHexString(data));
            mockFn = this.smocked.functions[fn.name];
        }
        else {
            params = utils_1.toHexString(data);
            mockFn = this.smocked.fallback;
        }
        const rawReturnValue = mockFn.returnValue instanceof Function
            ? await mockFn.returnValue(...params)
            : mockFn.returnValue;
        let encodedReturnValue = '0x';
        if (rawReturnValue !== undefined) {
            if (mockFn.resolve === 'revert') {
                if (typeof rawReturnValue !== 'string') {
                    throw new Error(`Smock: Tried to revert with a non-string (or non-bytes) type: ${typeof rawReturnValue}`);
                }
                if (rawReturnValue.startsWith('0x')) {
                    encodedReturnValue = rawReturnValue;
                }
                else {
                    const errorface = new ethers_1.ethers.utils.Interface([
                        {
                            inputs: [
                                {
                                    name: '_reason',
                                    type: 'string',
                                },
                            ],
                            name: 'Error',
                            outputs: [],
                            stateMutability: 'nonpayable',
                            type: 'function',
                        },
                    ]);
                    encodedReturnValue = errorface.encodeFunctionData('Error', [
                        rawReturnValue,
                    ]);
                }
            }
            else {
                if (fn === null) {
                    encodedReturnValue = rawReturnValue;
                }
                else {
                    try {
                        encodedReturnValue = this.interface.encodeFunctionResult(fn, [
                            rawReturnValue,
                        ]);
                    }
                    catch (err) {
                        if (err.code === 'INVALID_ARGUMENT') {
                            try {
                                encodedReturnValue = this.interface.encodeFunctionResult(fn, rawReturnValue);
                            }
                            catch (_a) {
                                if (typeof rawReturnValue !== 'string') {
                                    throw new Error(`Could not properly encode mock return value for ${fn.name}`);
                                }
                                encodedReturnValue = rawReturnValue;
                            }
                        }
                        else {
                            throw err;
                        }
                    }
                }
            }
        }
        else {
            if (fn === null) {
                encodedReturnValue = '0x';
            }
            else {
                encodedReturnValue = '0x' + '00'.repeat(2048);
            }
        }
        return {
            resolve: mockFn.resolve,
            returnValue: utils_1.fromHexString(encodedReturnValue),
        };
    };
};
exports.smockit = async (spec, options = {}) => {
    if (typeof spec === 'string') {
        try {
            spec = await hardhat_1.default.ethers.getContractFactory(spec);
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
    const contract = new ethers_1.Contract(options.address || utils_1.makeRandomAddress(), iface, options.provider || spec.provider || hardhat_1.default.ethers.provider);
    exports.smockify(contract);
    hook_1.engine.attachSmockContract(contract);
    return contract;
};
//# sourceMappingURL=smockit.js.map