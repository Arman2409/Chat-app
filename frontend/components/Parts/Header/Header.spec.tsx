import { screen, render, fireEvent } from "@testing-library/react";
import {describe, beforeAll, test, expect} from "@jest/globals";
import { Provider } from "react-redux";
// import '@testing-library/jest-dom/extend-expect';
// import '@testing-library/jest-dom';

import Header from "./Header";
import store from "../../../store/store";

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
    test("", () => {
        render(<Provider store={store}><Header /></Provider>);
        const toggleOwner = screen.getByRole("toggleOwnerInfo");
        fireEvent.click(toggleOwner);
        const ownerWindow = screen.getByRole("ownerWindow");
        expect(ownerWindow).toBeInTheDocument() ;
    })
});