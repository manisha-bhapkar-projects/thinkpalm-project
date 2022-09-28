import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CountryCompare from '../index'
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})
const defaultprops = {
    callGetCompareCountrySolutionIdAPIAction:jest.fn().mockReturnValue({ response: { status: 200, data: {data:[{solutionId:"1we2221",countryName:'USA'}]} } })
}
jest.mock('../../../utils/axiosConfig', () => ({
    post: () => {
        return new Promise((reject, resolve) => reject({ data:{data:[
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Working Hours",},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Public Holidays"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Annual Leave"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Sick & Carer’s Leave"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Maternity, Paternity & Family Leave"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Wages, Bonuses & Other Remuneration"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Termination & Severance"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Advantages"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Risk Factors"},
            {solutionId:"1we2221",countryName:'USA',countryId: 30,supertopicName: "Taxes",topics:[{
                topicName:"Social Security & Payroll Taxes"
            }]}


        
        ]} }));
    },
}));

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><CountryCompare {...defaultprops} /></Router></Provider>,{ attachTo: document.getElementById('table-container') });
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("CountryCompare Component", () => {
    let wrapper;
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    
    beforeEach(() => {
       
       
        const div = document.createElement('div');
        div.setAttribute('id', 'table-container');
        document.body.appendChild(div);
       
        
    });
    afterAll(() => {
        const div = document.getElementById('table-container');
        if (div) {
          document.body.removeChild(div);
        }
      });
    test('render CountryCompare without error', () => {
      
        window.localStorage.setItem('hasCountryId', 30);
        window.localStorage.setItem('CountryData',`[{"id":30,"country_Name":"Canada","country_Code":"CAN","order_Id":0,"region_Id":"5","flag_Upload_Id":"06ee0b84-a5e0-4716-beb5-52d38ce0d64b","header_Image_Id":"bae38709-8129-482c-a5c2-c1a0a722dc68","is_Deleted":false,"is_Active":true,"created_At":"2021-05-19T11:47:01","updated_At":"2021-10-11T08:08:57.1877","defaultRegion":{"id":5,"regionName":"East Asia and Pacific","regionCode":null},"videoLink":"https://www.youtube.com/watch?v=wgMGCmyXrbY"},{"id":162,"country_Name":"USA","country_Code":"USA","order_Id":1,"region_Id":"7","flag_Upload_Id":"7da9daee-18eb-401d-a1be-5cf520a4c364","header_Image_Id":"b29b2f30-1d58-4e00-bd55-d406962b9e35","is_Deleted":false,"is_Active":true,"created_At":"2021-05-19T11:47:01","updated_At":"2021-08-19T15:00:52.755868","defaultRegion":{"id":54,"regionName":"Americas","regionCode":""},"videoLink":null}]`)
        wrapper = setup(historyMock, defaultprops);
        const Compare = findByTestAttr(wrapper, 'compare')
      
        const country = findByTestAttr(wrapper, 'country')
        expect(Compare.length).toBe(1)
        expect(country.length).toBe(1)
        const countryPush = findByTestAttr(wrapper, 'countryPush')
        expect(countryPush.simulate('click').length).toBe(1)
    })
})