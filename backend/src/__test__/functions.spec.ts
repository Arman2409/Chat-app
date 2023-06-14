import { getStartEnd } from "../functions/functions";

describe("Test Functions", () => {
    it("Check the returning start and end index", () => {
        const page = 2, perPage = 10;
        expect(getStartEnd(page, perPage)).toStrictEqual({startIndex: 10, endIndex: 20});
    });
})