import '@testing-library/jest-dom';
import React from 'react';
import { screen, render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";

import Header from "../components/Parts/Header/Header";
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
    // can come handy for routing 
    // useRouter.mockReturnValue({ query: {}})
    test("", () => {
        render(<Provider store={store}><Header /></Provider>);
        const toggleOwner = screen.getByRole("toggleOwnerInfo");
        fireEvent.click(toggleOwner);
        const ownerWindow = screen.getByRole("ownerWindow");
        expect(ownerWindow).toBeDefined() ;
    })
});