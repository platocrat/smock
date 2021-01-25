"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHexString32 = exports.fromHexString = exports.toHexString = exports.remove0x = exports.add0x = void 0;
const ethers_1 = require("ethers");
exports.add0x = (str) => {
    return str.startsWith('0x') ? str : '0x' + str;
};
exports.remove0x = (str) => {
    return str.startsWith('0x') ? str.slice(2) : str;
};
exports.toHexString = (buf) => {
    return exports.add0x(buf.toString('hex'));
};
exports.fromHexString = (str) => {
    return Buffer.from(exports.remove0x(str), 'hex');
};
exports.toHexString32 = (value) => {
    if (typeof value === 'string' && value.startsWith('0x')) {
        return '0x' + exports.remove0x(value).padStart(64, '0').toLowerCase();
    }
    else if (typeof value === 'boolean') {
        return exports.toHexString32(value ? 1 : 0);
    }
    else {
        return exports.toHexString32(ethers_1.BigNumber.from(value).toHexString());
    }
};
//# sourceMappingURL=hex-utils.js.map