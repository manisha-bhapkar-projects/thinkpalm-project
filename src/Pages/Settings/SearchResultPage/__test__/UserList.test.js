import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import UserList from '../../User_and_Accounts/UserList';
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router';

const mockStore = configureStore([thunk]);
let store=mockStore({superAdminUserReducer: {
    userList: [{0:{id: "1", name: "Permanent"}}, {1:{id: "2", name: "Temporary"}}, {2:{id: "2", name: "Contract"}}],
    userDetails: [{0:{id: "1", name: "Permanent"}}, {1:{id: "2", name: "Temporary"}}, {2:{id: "2", name: "Contract"}}],
}})
jest.mock('axios');
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
const defaultProps={
    setPageNumber:jest.fn(),
    setSortField:jest.fn(),
    setSortOrder:jest.fn()
}
const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><UserList {...defaultProps} /></Router></Provider>);
}
describe("userList-page Component",()=>{
    let wrapper;
   

    beforeEach(() => {
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
        wrapper = setup(historyMock);
    });
   
    test('render userList-page without error',()=>{
        const userList = findByTestAttr(wrapper,'userList-page')
        expect(userList.length).toBe(1)
    })
    test('render  custome-table without error',()=>{
        const  custometable = findByTestAttr(wrapper,'custome-table')
        expect( custometable.length).toBe(1)
    })

   
})