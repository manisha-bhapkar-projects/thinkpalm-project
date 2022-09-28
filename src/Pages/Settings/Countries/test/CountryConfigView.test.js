import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import {
  
    uploadImageFile,
    addCountryDetails
    
  } from "../../../../Store/reducers/country";
import CountryConfigurationView from '../CountryConfigurationView'
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router-dom'
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import Dropzone from 'react-dropzone'

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
    return mount(<Provider store={store}><Router history={historyMock}><CountryConfigurationView {...props}/></Router></Provider>);
}
describe("CountryConfigview Component",()=>{
    let wrapper;
    let props={
        notify:jest.fn(),
        isViewAddNew:{active:false},
        onEditFromData:jest.fn(),
        formState:false,
        onImageChange:jest.fn(),
        onChangeCountry:jest.fn(),
        country:{id: 813, country_Name: 'A New Country', country_Code: 'ANC', order_Id: 0, region_Id: '54'}
    }
    const historyMock = { push: jest.fn(), location: {state:{SuperTopicName:"khaleel"}}, listen: jest.fn(),useParams: jest.fn().mockReturnValue({ country:"india" }) };
    beforeEach(() => {
        uploadImageFile.mockReturnValue({data:{id:3333}})
        wrapper = setup(historyMock,props);
    });
   
    test('render CountryConfigview without error',()=>{
        const countryConfig = findByTestAttr(wrapper,'countryConfig')
        expect(countryConfig.length).toBe(1)
        const video = findByTestAttr(wrapper,'video')
        expect(video.simulate('change',{target:{value:"kkkkk"}}).length).toBe(1)
        const edit = findByTestAttr(wrapper,'edit')
        expect(edit.simulate('click').length).toBe(1)
        const country = findByTestAttr(wrapper,'country')
        expect(country.simulate('change',{target:{value:"india"}}).length).toBe(1)
        const edit1 = findByTestAttr(wrapper,'edit1')
        expect(edit1.simulate('click').length).toBe(1)
        const edit2 = findByTestAttr(wrapper,'edit2')
        expect(edit2.simulate('click').length).toBe(1)
        const code = findByTestAttr(wrapper,'code')
        expect(code.simulate('change',{target:{value:"IND"}}).length).toBe(1)
        
        const region = findByTestAttr(wrapper,'region')
        expect(region.simulate('change',{value:"IND"}).length).toBe(1)
        const edit3 = findByTestAttr(wrapper,'edit3')
        expect(edit3.simulate('click').length).toBe(1)
        const fileContents = "file contents";
        const file = new Blob([fileContents], { type: "text/plain" });
        
         wrapper.find(Dropzone).first().simulate("drop", { dataTransfer: { files: [file] } });
       

    })
   
})
describe("CountryConfigView Component with other props",()=>{
    let wrapper;
    let props={
        notify:jest.fn(),
        isViewAddNew:{active:true},
        onEditFromData:jest.fn(),
        formState:false,
        onImageChange:jest.fn(),
        onChangeCountry:jest.fn(),
        country:{id: 813, country_Name: 'A New Country', country_Code: 'ANC', order_Id: 0, region_Id: '54'}
    }
    const historyMock = { push: jest.fn(), location: {state:{SuperTopicName:"khaleel"}}, listen: jest.fn(),useParams: jest.fn().mockReturnValue({ country:"india" }) };
    beforeEach(() => {
        uploadImageFile.mockReturnValue({data:{id:3333}})
        wrapper = setup(historyMock,props);
    });
   
    test('render CountryConfigview without error',()=>{
        const countryConfig = findByTestAttr(wrapper,'countryConfig')
        expect(countryConfig.length).toBe(1)
        const upload = findByTestAttr(wrapper,'upload')
        expect(upload.simulate('click').length).toBe(1)
        const change = findByTestAttr(wrapper,'change')
        expect(change.simulate('click').length).toBe(1)
       

    })
   
})



   
