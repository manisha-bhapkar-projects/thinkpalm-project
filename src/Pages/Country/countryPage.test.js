import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Country from './index'
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { getUserProfile, storeCountryData,getKeyClockToken_Data } from "../../utils/storage";
import { BrowserRouter } from 'react-router-dom';
import constants from '../../utils/constants';
import thunk from 'redux-thunk';
const mockStore = configureStore();
let store = mockStore({
    superAdminUserReducer:{
        companyInfoById:{},
        companyInfoLoading:false,
        
    },
})
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><Country /></Router></Provider>);
}
jest.mock('../../utils/storage', () => ({
    
      getUserProfile:jest.fn(),
      getKeyClockToken_Data:jest.fn()
    })
   );
describe("Card Component", () => {
    
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
    beforeEach(() => {
        wrapper = setup(historyMock);
      
    });
    test('render Country without error', () => {
        getUserProfile.mockReturnValue({data:"helo"})
       console.log(getUserProfile())
        const cardDiv = findByTestAttr(wrapper, 'Country')
        expect(cardDiv.length).toBe(1)
       
    })
} )