"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRandomAddress = void 0;
const ethers_1 = require("ethers");
exports.makeRandomAddress = () => {
    return ethers_1.ethers.utils.getAddress('0x' +
        [...Array(40)]
            .map(() => {
            return Math.floor(Math.random() * 16).toString(16);
        })
            .join(''));
};
//# sourceMappingURL=address-utils.js.map