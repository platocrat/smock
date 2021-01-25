"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smock = void 0;
const smockit_1 = require("./internal/smockit");
const smagicit_1 = require("./internal/smagicit");
const smock = smockit_1.smockit;
exports.smock = smock;
smock.magic = smagicit_1.smagicit;
//# sourceMappingURL=index.js.map