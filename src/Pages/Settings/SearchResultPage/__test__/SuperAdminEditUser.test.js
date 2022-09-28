import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import SuperAdminEditUser from '../../User_and_Accounts/SuperAdminEditUser'
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn().mockReturnValue({
        pathname: '/test',
        search: '',
        hash: '',
        state: null,
        key: '5nvxpbdafa',
    }),
    useHistory: jest.fn().mockReturnValue({ push: jest.fn(), location: {}, listen: jest.fn() }),
}));
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

let store=mockStore({superAdminUserReducer: {
  
}})


const setup = () => {
    return mount(<Provider store={store}><SuperAdminEditUser /></Provider>);
}
describe("SuperAdminEditUser Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render SuperAdminEditUser without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'SuperAdminEditUser')
        expect(indexDiv.length).toBe(1)
    })
})