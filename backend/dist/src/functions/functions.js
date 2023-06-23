"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByActivesFirst = exports.capitalizeFirstLetter = exports.getStartEnd = void 0;
const getStartEnd = (page, perPage) => {
    const startIndex = page * perPage - perPage;
    const endIndex = page * perPage;
    return { startIndex, endIndex };
};
exports.getStartEnd = getStartEnd;
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
const sortByActivesFirst = (data) => {
    return data.sort((first) => {
        if (first.active) {
            return -1;
        }
        return 1;
    });
};
exports.sortByActivesFirst = sortByActivesFirst;
//# sourceMappingURL=functions.js.map