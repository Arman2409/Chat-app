"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByActivesFirst = exports.capitalizeFirstLetter = exports.getStartEnd = void 0;
const getStartEnd = (page, perPage, length) => {
    const total = Math.ceil(length / perPage) * 10;
    const startIndex = page * perPage - perPage;
    const endIndex = page * perPage;
    return { startIndex, endIndex };
};
exports.getStartEnd = getStartEnd;
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function sortByActivesFirst(data) {
    return data.sort((first) => {
        if (first.active) {
            return -1;
        }
        return 1;
    });
}
exports.sortByActivesFirst = sortByActivesFirst;
//# sourceMappingURL=functions.js.map