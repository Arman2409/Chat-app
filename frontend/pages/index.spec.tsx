import { screen, render } from "@testing-library/react";
import {describe, beforeAll} from "@jest/globals";
import "@testing-library/jest-dom";

import Home from "./index";
import store from "../store/store";
import { Provider } from "react-redux";
import { useRouter } from "next/router";

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
    // useRouter.mockReturnValue({ query: {}})
    test("cd", () => {
        render(<Provider store={store}><Home /></Provider>);
        const div = screen.findAllByText("p")
        expect(true).toBeDefined();
    })
});

