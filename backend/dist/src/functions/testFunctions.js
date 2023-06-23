"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestContext = void 0;
const crypto_1 = require("crypto");
const getTestContext = () => {
    const randomId = (0, crypto_1.randomBytes)(12).toString("hex");
    const randomId2 = (0, crypto_1.randomBytes)(12).toString("hex");
    return {
        req: {
            session: {
                user: {
                    id: randomId,
                    friendRequests: [randomId2]
                }
            }
        }
    };
};
exports.getTestContext = getTestContext;
//# sourceMappingURL=testFunctions.js.map