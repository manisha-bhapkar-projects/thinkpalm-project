import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';

import ComparisonTable from './index'
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})
const defaultprops = {
    countries:[
    {id: 1, country_Name: 'Afghanistan', country_Code: 'AFG', order_Id: 0, region_Id: '5'},
    {id: 2, country_Name: 'Albania', country_Code: 'ALB', order_Id: 0, region_Id: '1,3'},
    {id: 3, country_Name: 'Algeria', country_Code: 'DZA', order_Id: 0, region_Id: '1,4'},
    {id: 5, country_Name: 'Angola', country_Code: 'AGO', order_Id: 0, region_Id: '1,6'},
    {id: 6, country_Name: 'Anguilla', country_Code: 'AIA', order_Id: 0, region_Id: '1,7'}],

    attributeLabels :["Public Holidays",
    "Vacation Leave",
     "Sick Leave",
    "Maternity Leave",
    "Working Hours",
    "Bonus Payments",
    "Taxes",
    "Employee Termination & Severance",
    "Advantages",
    "Risk Factors"],
    attributes :["Public Holidays",
    "Vacation Leave",
     "Sick Leave",
    "Maternity Leave",
    "Working Hours",
    "Bonus Payments",
    "Taxes",
    "Employee Termination & Severance",
    "Advantages",
    "Risk Factors"],
    countryDetails:[
        {countryId: 1,supertopicId: '60ed506fbb1db26aa277def2', supertopicContentId: '60ed6ec67b61ed6b976dd6d1', supertopicName: 'Taxes', supertopicContent: null, superTopicSnapshotContent: null,
        topics:[{countryId: 1,
            subTopics: [],
            topicContent: "<div>kjj</div>",
            topicContentId: "60ed6ec67b61ed6b976dd6d3",
            topicId: "60ed50a3d2fe4059ca4aa884",
            topicName: "Social Security & Payroll Taxes",
            topicSnapshotContent: ["<div></div>"]}]},
        {countryId: 1,supertopicId: '60ed504069497d4a9221e944', supertopicContentId: '60ed6ec67b61ed6b976dd6cf', supertopicName: 'Working Hours', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 1,supertopicId: '60ed4fc569497d4a9221e942', supertopicContentId: '60ed6ec67b61ed6b976dd6c9', supertopicName: 'Annual Leave', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 1,supertopicId: '60ed50570695e267f94bf3e5', supertopicContentId: '60ed6ec67b61ed6b976dd6d8', supertopicName: 'Wages, Bonuses & Other Remuneration', supertopicContent: null},
        {countryId: 2,supertopicId: '60ed506fbb1db26aa277def2', supertopicContentId: '60ed6ec67b61ed6b976dd6d1', supertopicName: 'Taxes', supertopicContent: null, superTopicSnapshotContent: null,
       },
        {countryId: 2,supertopicId: '60ed504069497d4a9221e944', supertopicContentId: '60ed6ec67b61ed6b976dd6cf', supertopicName: 'Working Hours', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 2,supertopicId: '60ed4fc569497d4a9221e942', supertopicContentId: '60ed6ec67b61ed6b976dd6c9', supertopicName: 'Annual Leave', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 2,supertopicId: '60ed50570695e267f94bf3e5', supertopicContentId: '60ed6ec67b61ed6b976dd6d8', supertopicName: 'Wages, Bonuses & Other Remuneration', supertopicContent: null},
        {countryId: 3,supertopicId: '60ed506fbb1db26aa277def2', supertopicContentId: '60ed6ec67b61ed6b976dd6d1', supertopicName: 'Taxes', supertopicContent: null, superTopicSnapshotContent: null,
        },
        {countryId: 3,supertopicId: '60ed504069497d4a9221e944', supertopicContentId: '60ed6ec67b61ed6b976dd6cf', supertopicName: 'Working Hours', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 3,supertopicId: '60ed4fc569497d4a9221e942', supertopicContentId: '60ed6ec67b61ed6b976dd6c9', supertopicName: 'Annual Leave', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 3,supertopicId: '60ed50570695e267f94bf3e5', supertopicContentId: '60ed6ec67b61ed6b976dd6d8', supertopicName: 'Wages, Bonuses & Other Remuneration', supertopicContent: null},
        {countryId: 4,supertopicId: '60ed506fbb1db26aa277def2', supertopicContentId: '60ed6ec67b61ed6b976dd6d1', supertopicName: 'Taxes', supertopicContent: null, superTopicSnapshotContent: null,
       },
        {countryId: 4,supertopicId: '60ed504069497d4a9221e944', supertopicContentId: '60ed6ec67b61ed6b976dd6cf', supertopicName: 'Working Hours', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 4,supertopicId: '60ed4fc569497d4a9221e942', supertopicContentId: '60ed6ec67b61ed6b976dd6c9', supertopicName: 'Annual Leave', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 4,supertopicId: '60ed50570695e267f94bf3e5', supertopicContentId: '60ed6ec67b61ed6b976dd6d8', supertopicName: 'Wages, Bonuses & Other Remuneration', supertopicContent: null},
        {countryId: 5,supertopicId: '60ed506fbb1db26aa277def2', supertopicContentId: '60ed6ec67b61ed6b976dd6d1', supertopicName: 'Taxes', supertopicContent: null, superTopicSnapshotContent: null,
       },
        {countryId: 5,supertopicId: '60ed504069497d4a9221e944', supertopicContentId: '60ed6ec67b61ed6b976dd6cf', supertopicName: 'Working Hours', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 5,supertopicId: '60ed4fc569497d4a9221e942', supertopicContentId: '60ed6ec67b61ed6b976dd6c9', supertopicName: 'Annual Leave', supertopicContent: null, superTopicSnapshotContent: null},
        {countryId: 5,supertopicId: '60ed50570695e267f94bf3e5', supertopicContentId: '60ed6ec67b61ed6b976dd6d8', supertopicName: 'Wages, Bonuses & Other Remuneration', supertopicContent: null}
    ]
}
jest.mock('../../../utils/axiosConfig', () => ({
    post: () => {
        return new Promise((reject, resolve) => reject({ data:"" }));
    },
}));

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><ComparisonTable {...defaultprops} /></Router></Provider>,{ attachTo: document.getElementById('table-container') });
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("CountryCompare Table Component", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    
    beforeEach(() => {  
        const div = document.createElement('div');
        div.setAttribute('id', 'table-container');
        div.scrollBy = jest.fn();
        document.body.appendChild(div);
       
    })
   
    test('render CountryCompare Table without error', () => {
        Object.assign(window, 'screen', { width: 1500 });
        wrapper = setup(historyMock, defaultprops);  
        const table = findByTestAttr(wrapper, 'table')
        
        expect(table.length).toBe(1)
        const country=findByTestAttr (wrapper,"country")
        expect(country.simulate('click').length).toBe (1)
        const country1=findByTestAttr (wrapper,"country1")
        expect(country1.simulate('click').length).toBe (1)
        country1.simulate('click')
    })
    test('render CountryCompare Table ', () => {
        const country=findByTestAttr (wrapper,"country")
        expect(country.simulate('click').length).toBe (1)

    })
})