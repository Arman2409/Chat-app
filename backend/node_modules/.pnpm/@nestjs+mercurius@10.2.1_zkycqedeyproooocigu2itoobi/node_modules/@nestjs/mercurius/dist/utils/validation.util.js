"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = exports.isNull = exports.isUndefined = void 0;
const isUndefined = (value) => {
    return typeof value === 'undefined';
};
exports.isUndefined = isUndefined;
const isNull = (value) => value === null;
exports.isNull = isNull;
const isArray = (value) => {
    return Array.isArray(value);
};
exports.isArray = isArray;
