import "@testing-library/jest-dom";
import React from "react";
import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";

import Home from "../pages/index";
import store from "../store/store";

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

describe("<Home />", () => {
        beforeAll(() => {
            Object.defineProperty(window, "matchMedia", {
              writable: true,
              value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
              }))
            });
          });
     //  can come handy for routing 
    // useRouter.mockReturnValue({ query: {}})
    test("cd", () => {
        render(<Provider store={store}><Home /></Provider>);
        const div = screen.findAllByText("p")
        expect(true).toBeDefined();
    })
});

