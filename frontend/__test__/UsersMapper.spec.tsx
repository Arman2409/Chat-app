import React from 'react';
import { screen, render, fireEvent } from "@testing-library/react";
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';

import UsersMapper from "../components/Custom/UsersMapper/UsersMapper";
import store from '../store/store';
import {setWindowProperties} from "../functions/testFunctions";


jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

describe("<UsersMapper />", () => {
        beforeAll(() => setWindowProperties(window, jest));
    (useRouter as jest.Mock).mockReturnValue({
      query: {}
    });
    
    test("should have one list item", () => {
        const testUsers = [{
            name: "test",
            email: "test@test"
        }]
        render(
           <Provider store={store}>
             <UsersMapper 
               users={testUsers}
               setLoadingSearchType={() => {}}
             />
            </Provider>
            );
        
        const listItems = screen.getAllByTestId("listItem");
        expect(listItems).toHaveLength(1) ;
    })
});