import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import AddCountry from '../AddCountry'
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router';

const mockStore = configureStore([thunk]);
let store=mockStore({superAdminUserReducer: {

    companyInfoById:{id:"yyy"},
    companyInfoLoading:false
  
}})
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useLocation: () => ({
        pathname: ""
      })
   }));
   jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
jest.mock('axios');

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><AddCountry /></Router></Provider>);
}
describe("add-country Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test('render add-country without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'add-country')
        expect(indexDiv.length).toBe(1)
    })
})