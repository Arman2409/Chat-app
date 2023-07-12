import "@testing-library/jest-dom";
import React from 'react';
import { screen, render, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { useRouter } from 'next/router';

import Header from "../components/Parts/Header/Header";
import store from "../store/store";
import { setWindowProperties } from '../functions/testFunctions';

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

describe("<Home />", () => {
     beforeAll(() => setWindowProperties(window, jest));
    (useRouter as jest.Mock).mockReturnValue({
      query: {}
    })

    test("Open owner window",async  () => {
      await act( async () =>  render(
        <Provider store={store}>
          <Header />
        </Provider>
      ));
        
        
        const toggleOwner = screen.getByTestId("toggleOwner");
        await act(() => fireEvent.click(toggleOwner));
        const ownerWindow = screen.getByTestId("ownerWindow");
        expect(ownerWindow).toBeDefined();
    })
});