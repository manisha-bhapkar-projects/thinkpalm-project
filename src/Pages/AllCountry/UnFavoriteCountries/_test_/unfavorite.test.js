import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import Router from "react-router-dom";
import { Router as Router1 } from 'react-router';
import UnfavoriteCountries from '../index'
import thunk from 'redux-thunk'
import React from 'react';

jest.mock('axios');
const mockStore = configureStore([thunk]);
const store=mockStore({country: {
    CountryDetails: {
        country_Code: "DZA",
        country_Name: "Algeria",
        created_At: "2021-05-19T11:47:01",
        defaultRegion:{
            id: 1,
            regionCode: null,
            regionName: "Global"
        },
        id: 1,
        regionCode: null,
        regionName: "Global",
        flag_Upload_Id: "01dbded8-1742-4ff0-a1a1-ac86e43b1051",
        header_Image_Id: "30590061-4946-4a2b-894f-13c6beecb2d9",
        id: 3,
        is_Active: true,
        is_Deleted: false,
        order_Id: 0,
        region_Id: "1,4",
        updated_At: "2021-06-24T10:19:04.266361",
        videoLink: "www.youtube.com"
            },
    SnapShotData: [{0:{id: "1", name: "Permanent"}}, {1:{id: "2", name: "Temporary"}}, {2:{id: "2", name: "Contract"}}],
    ChartData: [{0:{id: "1", name: "Permanent"}}, {1:{id: "2", name: "Temporary"}}, {2:{id: "2", name: "Contract"}}],
    countryStatus: {
        countryaddedErr: undefined,
        detetedSuccess: false,
        deleteErr: undefined,
        countryadded: false,
      },
    attractId: ["11111111"],
    onBoardId: ["222222222"],
    developId: ["333333333"],
    offBoardId: ["444444444"],
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
const setup = (historyMock,paramMock) => {
    return mount(<Provider store={store}><Router1 history={historyMock} id={paramMock} counrty={paramMock}><UnfavoriteCountries /></Router1></Provider>);
}
describe("UnFavoriteCountries Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
    const paramMock={useParams:jest.fn().mockReturnValue({ id: '1234',country:"india"})}
    beforeEach(() => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234',country:"india" })
        wrapper = setup(historyMock,paramMock);
    });
    test('render UnFavoriteCountries without error',()=>{
      
        const indexDiv = findByTestAttr(wrapper,'unfavpage')
        expect(indexDiv.length).toBe(1)
    })

})