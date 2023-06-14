import "@testing-library/jest-dom";
import React from "react";
import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";

import Home from "../pages/index";
import store from "../store/store";
import { setWindowProperties } from "../functions/testFunctions";

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

describe("<Home />", () => {
        beforeAll(() => setWindowProperties(window, jest));
     //  can come handy for routing 
    // useRouter.mockReturnValue({ query: {}})
    
    test("should have search input", () => {
        render(<Provider store={store}><Home /></Provider>);
        const searchInput = screen.getByPlaceholderText("Search");
        expect(searchInput).toBeDefined();
    })
});

