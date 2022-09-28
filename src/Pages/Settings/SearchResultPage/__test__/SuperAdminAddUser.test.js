import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import SuperAdminAddUser from '../../User_and_Accounts/SuperAdminAddUser'
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store=mockStore({superAdminUserReducer: {
  
}})
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
    useParams: () => { return { company:"exp" } },
}));
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
const setup = () => {
    return mount(<Provider store={store}><SuperAdminAddUser /></Provider>);
}
describe("SuperAdminAddUser Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render SuperAdminAddUser without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'superAdminAddUser')
        expect(indexDiv.length).toBe(1)
    })
})