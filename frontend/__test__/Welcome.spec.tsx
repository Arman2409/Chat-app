import React from 'react';
import { screen, render, fireEvent, act } from "@testing-library/react";
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';

import Welcome from "../components/Parts/Welcome/Welcome";
import store from '../store/store';
import {setWindowProperties} from "../functions/testFunctions";

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

const mockState =  [
        {
            name: "test news",
            description: "test news"
        }
    ];

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

jest.mock("react-responsive", () => ({useMediaQuery: ()=> false}));
  
describe("<Welcome />", () => {
    beforeAll(() => setWindowProperties(window, jest));
    (useRouter as jest.Mock).mockReturnValue({
      query: {}
    });
    
    (React.useState as jest.Mock).mockImplementation(() => [mockState, jest.fn()]);

    test("should open modal when clicking news' list item", async () => {
        await act( async () =>  render(
            <Provider store={store}>
              <Welcome />
            </Provider>
        ));
       
        const news = screen.getAllByTestId("news-cont");
        fireEvent.click(news[0]);
        const newsModal = screen.getAllByTestId("news-modal");
        expect(newsModal).toBeDefined();
    })
});