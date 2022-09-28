import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import CountryConfigurationList from '../CountryConfigurationList'
import {
  
    uploadImageFile,
    addCountryDetails
    
  } from "../../../../Store/reducers/country";
import CountryConfigurationView from '../CountryConfigurationView'
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router-dom'
import { render, cleanup, waitFor, screen } from '@testing-library/react';

import { act } from 'react-dom/test-utils';
jest.mock('axios')
const mockStore = configureStore([thunk]);
let store=mockStore({favoriteCountriesReducer: {
    regionList:[{id: 5, region_Name: 'East Asia and Pacific', region_Code: null, order_Id: 5, header_Image_Id: null},
    {id: 3, region_Name: 'Europe and Central Asia', region_Code: null, order_Id: 3, header_Image_Id: null},
    {id: 1, region_Name: 'Global', region_Code: null, order_Id: 1, header_Image_Id: null}]
},country:{
    allCountryLoading:false,
    allCountryList:[
        {id: 281, country_Name: 'A India', country_Code: 'IN', order_Id: 0, region_Id: '3',},
 {id: 813, country_Name: 'A New Country', country_Code: 'ANC', order_Id: 0, region_Id: '54'},
 {id: 297, country_Name: 'aa_QAtest123', country_Code: null, order_Id: 0, region_Id: '54'},
    ]
}})
afterEach(cleanup);
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
jest.mock('../../../../Store/reducers/country', () => ({
    
    uploadImageFile:jest.fn(),
    addCountryDetails:jest.fn()
    
  })
 );
const setup = (historyMock,props) => {
    return mount(<Provider store={store}><Router history={historyMock}><CountryConfigurationList {...props}/></Router></Provider>);
}
describe("CountryConfigList Component",()=>{
    let wrapper;
    let props={
        notify:jest.fn()
    }
    const historyMock = { push: jest.fn(), location: {state:{SuperTopicName:"khaleel"}}, listen: jest.fn(),useParams: jest.fn().mockReturnValue({ country:"india" }) };
    beforeEach(() => {
        uploadImageFile.mockReturnValue({data:{id:3333}})
        wrapper = setup(historyMock,props);
    });
   
    test('render CountryConfigList without error',()=>{
        const countryConfig = findByTestAttr(wrapper,'countryConfig')
        expect(countryConfig.length).toBe(1)
        const countryClick = findByTestAttr(wrapper,'countryClick')
        expect(countryClick.first().simulate('click').length).toBe(1)
        const search = findByTestAttr(wrapper,'search')
        expect(search.simulate('change',{target:{value:"ind"}}).length).toBe(1)
        const searchClose = findByTestAttr(wrapper,'searchClose')
        expect(searchClose.first().simulate('click').length).toBe(1)
        const addCountry = findByTestAttr(wrapper,'addCountry')
        expect(addCountry.simulate('click').length).toBe(1)
        const cancelAddnew = findByTestAttr(wrapper,'cancelAddnew')
        expect(cancelAddnew.simulate('click').length).toBe(1)
        addCountry.simulate('click')
        const addnew = findByTestAttr(wrapper,'addnew')
        expect(addnew.simulate('click').length).toBe(1)
        wrapper.find(CountryConfigurationView).props().onImageChange()
        wrapper.find(CountryConfigurationView).props().onImageChange(false)
        wrapper.find(CountryConfigurationView).props().uploadImage()

    })
   
})
describe("CountryConfigList with no response Component",()=>{
    let wrapper;
    let props={
        notify:jest.fn()
    }
    const historyMock = { push: jest.fn(), location: {state:{SuperTopicName:"khaleel"}}, listen: jest.fn(),useParams: jest.fn().mockReturnValue({ country:"india" }) };
    beforeEach(() => {
        uploadImageFile.mockReturnValue({})
        addCountryDetails.mockReturnValue({responseCode : 200})
        wrapper = setup(historyMock,props);
    });
   
    test('render CountryConfigList without error',()=>{
       
        const countryConfig = findByTestAttr(wrapper,'countryConfig')
        expect(countryConfig.length).toBe(1)
        const addCountry = findByTestAttr(wrapper,'addCountry')
        addCountry.simulate('click')
        wrapper.find(CountryConfigurationView).props().onChangeCountry({
            country_Code: "ABC",
            country_Name: "Abcde",
            created_At: "12",
            flag_Upload_Id: "123-iyt-987",
            header_Image_Id: "123-0998",
            is_Active: true,
            is_Deleted: false,
            videoLink: "ww."
        })
        const addnew = findByTestAttr(wrapper,'addnew')
        expect(addnew.simulate('click').length).toBe(1)
       
        wrapper.find(CountryConfigurationView).props().uploadImage()

    })
   
})

describe("CountryConfigList Update CountryComponent",()=>{
    let wrapper;
    let props={
        notify:jest.fn()
    }
    const historyMock = { push: jest.fn(), location: {state:{SuperTopicName:"khaleel"}}, listen: jest.fn(),useParams: jest.fn().mockReturnValue({ country:"india" }) };
    beforeEach(() => {
        uploadImageFile.mockReturnValue({})
        addCountryDetails.mockReturnValue({responseCode : 200})
        wrapper = setup(historyMock,props);
    });
   
    test('render CountryConfigList UpdateCountry without error',()=>{
       
        const countryConfig = findByTestAttr(wrapper,'countryConfig')
        expect(countryConfig.length).toBe(1)
        const countryClick = findByTestAttr(wrapper,'countryClick')
        expect(countryClick.first().simulate('click').length).toBe(1)
        act(async()=>{
          await  wrapper.find(CountryConfigurationView).props().onEditFromData()
        })
        
        
        
           

        // const addnew = findByTestAttr(wrapper,'addnew')
        // expect(addnew.simulate('click').length).toBe(1)
        // wrapper.find(CountryConfigurationView).props().uploadImage()

    })
   
})