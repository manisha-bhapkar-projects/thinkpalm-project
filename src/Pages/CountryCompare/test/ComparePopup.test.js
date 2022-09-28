import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ComparePopup from '../ComparePopup';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})

jest.mock('../../../utils/axiosConfig', () => ({
    post: () => {
        return new Promise((reject, resolve) => reject({ data:""}));
    },
    get: () => {
        return new Promise((reject, resolve) => reject({ data:{data:[
            {id: 813, country_Name: 'A New Country', country_Code: 'ANC', order_Id: 0, region_Id: '54'},
            {id: 1, country_Name: 'Afghanistan', country_Code: 'AFG', order_Id: 0, region_Id: '5'},
            {id: 2, country_Name: 'Albania', country_Code: 'ALB', order_Id: 0, region_Id: '1,3',},
            {id: 3, country_Name: 'Algeria', country_Code: 'DZA', order_Id: 0, region_Id: '1,4'}
        ]}}));
    },
    
}));

const setup = (historyMock,props) => {

    return mount(<Provider store={store}><Router history={historyMock}><ComparePopup {...props} /></Router></Provider>,{ attachTo: document.getElementById('table-container') });
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("CountryComparePopup Component", () => {
    let wrapper;
    let wrapper1
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    const defaultprops = {
        show:true,
        callGetCompareCountrySolutionIdAPIAction:jest.fn(),
        callGetSnapShotAPIAction:jest.fn(),
        callgetCountryListAPIAction:jest.fn(),
        onHide:jest.fn()
    }
    beforeEach(() => {
       
        wrapper = setup(historyMock, defaultprops);
        
        
    });
  
    test('render CountryCompare Popup without error', () => {
      
        
        const ComparePopup = findByTestAttr(wrapper, 'compare-popup')
        expect(ComparePopup.length).toBe(3)
        const handleSearch = findByTestAttr(wrapper, 'handleSearch')
        expect(handleSearch.simulate('change',{target:{value:"hello"}}).length).toBe(1)
        const searchItem = findByTestAttr(wrapper, 'searchItem')
        expect(searchItem.simulate('click').length).toBe(1)
        
        const handleCompare = findByTestAttr(wrapper, 'handleCompare')
        expect(handleCompare.simulate('click').length).toBe(1)
        
    })
    test('render CountryCompare Popup with country id without error', () => {
        wrapper1 = setup(historyMock, {...defaultprops,id:1});
        
        const ComparePopup = findByTestAttr(wrapper1, 'compare-popup')
        expect(ComparePopup.length).toBe(3)
        
        const handleAdd = findByTestAttr(wrapper, 'handleAdd')
        expect(handleAdd.simulate('click').length).toBe(1)
        
      
        const handleCompare = findByTestAttr(wrapper, 'handleCompare')
        expect(handleCompare.simulate('click').length).toBe(1)
        
    })
})