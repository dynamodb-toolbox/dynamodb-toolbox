"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        include: ['**/*.unit.test.?(c|m)[jt]s?(x)'],
        globals: true
    },
    resolve: {
        alias: {
            v1: path_1.default.resolve(__dirname, 'src', 'v1')
        }
    }
});
