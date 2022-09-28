import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import userEvent from '@testing-library/user-event'
import AllCountryPage from '../AllCountry'
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';

jest.mock('axios');

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
      pathname: "localhost:3000/example/path"
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
afterEach(cleanup);

const mockStore = configureStore([thunk]);
let store = mockStore({
    favoriteCountriesReducer: {
        regionList: [{
            region_Name:'All countries',
            id:1
        }]
    },
    country: {
        allCountriesList: [],
        allCountriesLoading: true,
    },
    dispatch: jest.fn()
});
let store1 = mockStore({
    favoriteCountriesReducer: {
        regionList: [{
            region_Name:'All countries',
            id:1
        },{
            region_Name:'Global',
            id:2
        }]
    },
    country: {
        allCountriesList: [{
            "countryId": 70,
            "countryName": "India",
            "IsFavourite": true,
            "Topics":
                [
                    {
                        "supertopicName": "Advantages",
                        "SupertopicContent": "<p>Good Social Security Measures and employee benefits</p>< p > Low Corpo...",
                        "CoutryId": 70,
                        "regionId": 2
                    },
                    {
                        "supertopicName": "Risk Factors",
                        "SupertopicContent": "<p>In case of injury or illness, employers must pay up to 24 month sal...",
                        "CoutryId": 70,
                        "regionId": 2
                    }
                ]
        },
        {
            "countryId": 1,
            "countryName": "Afghanistan",
            "IsFavourite": true,
            "Topics":
                [
                    {
                        "supertopicName": "Advantages",
                        "SupertopicContent": "<p>Good Social Security Measures and employee benefits</p><p> Low Corpo...",
                        "CoutryId": 1,
                        "regionId": 1
                    },
                    {
                        "supertopicName": "Risk Factors",
                        "SupertopicContent": "<p>In case of injury or illness, employers must pay up to 24 month sal...",
                        "CoutryId": 1,
                        "regionId": 1
                    }
                ]
        }],
        allCountriesLoading: false,
    },
    dispatch: jest.fn()
});

const defaultprops = {
    className: "",
    insight: true,
    testCase: true,
    callgetRegionListAPI: () => {},
    getAllCountriesList: () => {}
};

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
const setup = (props) => {
   
    return mount(<Provider store={store1}><AllCountryPage {...props} /></Provider>);
}
describe("AllCountryPage Page Component", () => {
    it('render Home page without error', async () => {
        const { rerender, getByTestId, asFragment } = render(<Provider store={store}><AllCountryPage {...defaultprops} /></Provider>);
        const listNode = await waitFor(() => getByTestId('AllCountryPage-result-page'));
        rerender(<Provider store={store1}><AllCountryPage {...defaultprops} /></Provider>);
        // expect(asFragment()).toMatchSnapshot();
    });
   

});
describe("AllCountryPage Page Component1", () => {
    let wrapper;
    const defaultProps = {
        className: "",
    insight: true,
    testCase: false,
    callgetRegionListAPI: () => {},
    getAllCountriesList: () => {}

       };
    
    beforeEach(() => {
        wrapper = setup(defaultProps,);
    });

    test("render onClick in the component",()=>{
        const scroll=findByTestAttr(wrapper,"scroll")
        expect(scroll.simulate('click').length).toBe(1)
        const region=findByTestAttr(wrapper,"region")
        expect(region.first().simulate('click').length).toBe(1)
        const showMore=findByTestAttr(wrapper,"showMore")
        expect(showMore.first().simulate('click').length).toBe(1)
        const Card=findByTestAttr(wrapper,"Card")
        expect(Card.length).toBe(2)
        expect(region.first().simulate('click',{value:{id:0}}).length).toBe(1)
    })


})

