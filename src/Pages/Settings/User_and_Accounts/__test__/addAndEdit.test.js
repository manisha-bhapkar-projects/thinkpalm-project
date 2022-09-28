import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import AddAccount from '../AddAccount'
import EditAccount from '../EditAccount'
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';

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
    useParams: () => { return { id: "143f01e0-7b1f-4f63-9f79-4a5716038b96" } },
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
    superAdminUserReducer: {
        userList: [],
        companyList: [{
            "id": 898,
            "companyName": "CompanyQAupdated",
            "companyCode": "QA345",
            "industryId": 4,
            "isPrimaryUserAdded": false,
            "isActive": true,
            "isDeleted": false,
            "industryName": "Education",
            "noOfLicenses": 5,
            "availableLicenses": 5,
            "subscription": [
                {
                    "id": "08d95bd2-2ce1-4b3c-8586-11550cdc0fdf",
                    "companyId": 898,
                    "subscriptionId": "090d2602-7f33-4257-bef4-c0577211f66a",
                    "countryId": 2,
                    "registrationDate": "2021-08-10T00:00:00",
                    "renewalDate": "2021-08-27T00:00:00",
                    "additionalHRTemplate": 0,
                    "hrTemplateDiscount": 0,
                    "additionalExpertHour": 0,
                    "isActive": true,
                    "isDeleted": false,
                    "subscriptionName": "updatedSubNameYHe"
                }
            ]
        },
        {
            "id": 891,
            "companyName": "Companytestqa25",
            "companyCode": "CMP",
            "industryId": 7,
            "isPrimaryUserAdded": false,
            "isActive": false,
            "isDeleted": false,
            "industryName": "HR and Staffing",
            "noOfLicenses": 2,
            "availableLicenses": 2,
            "subscription": [
                {
                    "id": "08d95af6-1b3b-4c76-82ed-d282b6e99343",
                    "companyId": 891,
                    "subscriptionId": "11a37144-98cf-432c-9d4a-7983f435dd8b",
                    "countryId": 1,
                    "registrationDate": "2021-07-23T00:00:00",
                    "renewalDate": "2021-07-23T00:00:00",
                    "additionalHRTemplate": 0,
                    "hrTemplateDiscount": 1,
                    "additionalExpertHour": 1,
                    "isActive": false,
                    "isDeleted": false,
                    "subscriptionName": "Geon-sub"
                }
            ]
        }],
        userListAll: [],
        administratorRole: [{
            "id": "0035537e-cb12-4b26-945f-fae132803bc6",
            "roleName": "updatedRoleIdI",
            "description": "updated Description",
            "isActive": true,
            "isDeleted": false
        },
        {
            "id": "011278bc-109d-42db-a654-e91b855dc76c",
            "roleName": "QAhAl",
            "description": "QA Role from Automation",
            "isActive": true,
            "isDeleted": false
        }],
        userDetails: {},
        emailStatus: "",
        updateUser: {},

        accountsList: {
            data: [
                {
                    "id": 898,
                    "companyName": "CompanyQAupdated",
                    "companyCode": "QA345",
                    "industryId": 4,
                    "isPrimaryUserAdded": false,
                    "isActive": true,
                    "isDeleted": false,
                    "industryName": "Education",
                    "noOfLicenses": 5,
                    "availableLicenses": 5,
                    "subscription": [
                        {
                            "id": "08d95bd2-2ce1-4b3c-8586-11550cdc0fdf",
                            "companyId": 898,
                            "subscriptionId": "090d2602-7f33-4257-bef4-c0577211f66a",
                            "countryId": 2,
                            "registrationDate": "2021-08-10T00:00:00",
                            "renewalDate": "2021-08-27T00:00:00",
                            "additionalHRTemplate": 0,
                            "hrTemplateDiscount": 0,
                            "additionalExpertHour": 0,
                            "isActive": true,
                            "isDeleted": false,
                            "subscriptionName": "updatedSubNameYHe"
                        }
                    ]
                },
                {
                    "id": 891,
                    "companyName": "Companytestqa25",
                    "companyCode": "CMP",
                    "industryId": 7,
                    "isPrimaryUserAdded": false,
                    "isActive": false,
                    "isDeleted": false,
                    "industryName": "HR and Staffing",
                    "noOfLicenses": 2,
                    "availableLicenses": 2,
                    "subscription": [
                        {
                            "id": "08d95af6-1b3b-4c76-82ed-d282b6e99343",
                            "companyId": 891,
                            "subscriptionId": "11a37144-98cf-432c-9d4a-7983f435dd8b",
                            "countryId": 1,
                            "registrationDate": "2021-07-23T00:00:00",
                            "renewalDate": "2021-07-23T00:00:00",
                            "additionalHRTemplate": 0,
                            "hrTemplateDiscount": 1,
                            "additionalExpertHour": 1,
                            "isActive": false,
                            "isDeleted": false,
                            "subscriptionName": "Geon-sub"
                        }
                    ]
                }
            ],
            pageSize: 1,
            totalCount: 15,
        },
        accountsListLoading: false,
        accountInfoLoading: false,
        accountInfo: {
            "id": 898,
            "companyName": "CompanyQAupdated",
            "companyCode": "QA345",
            "industryId": 4,
            "isPrimaryUserAdded": false,
            "isActive": true,
            "isDeleted": false,
            "industryName": "Education",
            "noOfLicenses": 5,
            "availableLicenses": 5,
            "subscription": [
                {
                    "id": "d81e61ce-1404-4222-8844-5f54544db395",
                    "companyId": 898,
                    "subscriptionId": "090d2602-7f33-4257-bef4-c0577211f66a",
                    "countryId": 2,
                    "registrationDate": "2021-08-10T00:00:00",
                    "renewalDate": "2021-08-27T00:00:00",
                    "additionalHRTemplate": 0,
                    "hrTemplateDiscount": 0,
                    "additionalExpertHour": 0,
                    "isActive": true,
                    "isDeleted": false,
                    "subscriptionName": "updatedSubNameYHe"
                }
            ]
        },
        allAccountList: [{
            "id": 898,
            "companyName": "CompanyQAupdated",
            "companyCode": "QA345",
            "industryId": 4,
            "isPrimaryUserAdded": false,
            "isActive": true,
            "isDeleted": false,
            "industryName": "Education",
            "noOfLicenses": 5,
            "availableLicenses": 5,
            "subscription": [
                {
                    "id": "08d95bd2-2ce1-4b3c-8586-11550cdc0fdf",
                    "companyId": 898,
                    "subscriptionId": "090d2602-7f33-4257-bef4-c0577211f66a",
                    "countryId": 2,
                    "registrationDate": "2021-08-10T00:00:00",
                    "renewalDate": "2021-08-27T00:00:00",
                    "additionalHRTemplate": 0,
                    "hrTemplateDiscount": 0,
                    "additionalExpertHour": 0,
                    "isActive": true,
                    "isDeleted": false,
                    "subscriptionName": "updatedSubNameYHe"
                }
            ]
        },
        {
            "id": 891,
            "companyName": "Companytestqa25",
            "companyCode": "CMP",
            "industryId": 7,
            "isPrimaryUserAdded": false,
            "isActive": false,
            "isDeleted": false,
            "industryName": "HR and Staffing",
            "noOfLicenses": 2,
            "availableLicenses": 2,
            "subscription": [
                {
                    "id": "08d95af6-1b3b-4c76-82ed-d282b6e99343",
                    "companyId": 891,
                    "subscriptionId": "11a37144-98cf-432c-9d4a-7983f435dd8b",
                    "countryId": 1,
                    "registrationDate": "2021-07-23T00:00:00",
                    "renewalDate": "2021-07-23T00:00:00",
                    "additionalHRTemplate": 0,
                    "hrTemplateDiscount": 1,
                    "additionalExpertHour": 1,
                    "isActive": false,
                    "isDeleted": false,
                    "subscriptionName": "Geon-sub"
                }
            ]
        }],
        industryList: [],
        subscriptionList: [{
            "id": "00901ebb-b261-4e01-821c-2e9a9dfbf36b",
            "name": "AutoSubscriptionriW",
            "description": "AutoSub Description",
            "price": 200,
            "promotionPrice": 100,
            "isPromotionApplied": false,
            "duration": 2,
            "features": [
                {
                    "id": 21,
                    "name": "Access & contribute to HR professional community membership (forum)",
                    "attributes": [
                        {
                            "id": 1,
                            "name": "% discount",
                            "value": "10",
                            "fieldType": "percentage",
                            "fieldFormat": "00"
                        }
                    ]
                },
                {
                    "id": 22,
                    "name": "HR Templates",
                    "attributes": []
                }
            ]
        },
        {
            "id": "02b88c38-1cbe-4bea-b13a-dd0cdcdff21d",
            "name": "gopals",
            "description": "",
            "price": 1992,
            "promotionPrice": 1020,
            "isPromotionApplied": false,
            "duration": 2,
            "features": [
                {
                    "id": 21,
                    "name": "Access & contribute to HR professional community membership (forum)",
                    "attributes": []
                }
            ]
        }],
        allCountryList: [{
            "id": 813,
            "country_Name": "A New Country",
            "country_Code": "ANC",
            "order_Id": 0,
            "region_Id": "54",
            "flag_Upload_Id": "",
            "header_Image_Id": "",
            "is_Deleted": false,
            "is_Active": true,
            "defaultRegion": {
                "id": 54,
                "regionName": "Americas",
                "regionCode": ""
            },
            "videoLink": "https://youtu.be/8Od_820WZ0E"
        },
        {
            "id": 447,
            "country_Name": "aaaa",
            "country_Code": null,
            "order_Id": 0,
            "region_Id": null,
            "flag_Upload_Id": "",
            "header_Image_Id": "",
            "is_Deleted": false,
            "is_Active": true,
            "defaultRegion": null,
            "videoLink": null
        }],
    },
    searchResultReducer: {
        autoSuggestResults: []
    },
    dispatch: jest.fn()
});

const defaultprops = {
    className: "",
    testCase: true,
    searchTextValue: "Test",
    getFeaturedArticles: () => { },
    getSearchResult: () => { },
    updateSearchText: () => { },
    reducer: {
        countryId: 1,
        countryName: 'Test country',
    }
};

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

describe("Add and Edit Account Page Component", () => {

    it('render Add page without error', async () => {
        const { rerender, getByTestId, asFragment } = render(<Provider store={store}><AddAccount {...defaultprops} /></Provider>);
        const listNode = await waitFor(() => getByTestId('user-accounts-edit-page'));
        expect(listNode.children).toHaveLength(4);
        rerender(<Provider store={store}><AddAccount {...defaultprops} /></Provider>);
        // expect(asFragment()).toMatchSnapshot();
    })

    it('render Edit page without error', async () => {
        const { rerender, getByTestId, asFragment } = render(<Provider store={store}><EditAccount {...defaultprops} /></Provider>);
        const listNode = await waitFor(() => getByTestId('user-accounts-edit-page'));
        expect(listNode.children).toHaveLength(5);
        rerender(<Provider store={store}><EditAccount {...defaultprops} /></Provider>);
        // expect(asFragment()).toMatchSnapshot();
    })

    test('simulate Add form interaction without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Provider store={store}><AddAccount history={historyMock} {...defaultprops} /></Provider>)
        const input1 = getByTestId('company-input');
        const input2 = getByTestId('company-code');

        const noOfLicense = getByTestId('noOfLicense');
        const additionalHRTemplate = getByTestId('additionalHRTemplate');
        const hrTemplateDiscount = getByTestId('hrTemplateDiscount');
        const additionalExpertHrs = getByTestId('additionalExpertHrs');
        
        userEvent.type(input1, "test");
        userEvent.type(input2, "test");
        userEvent.type(noOfLicense, "test");
        userEvent.type(additionalHRTemplate, "test");
        userEvent.type(hrTemplateDiscount, "test");
        userEvent.type(additionalExpertHrs, "test");
        await act(() => promise);
    });

    test('simulate Edit form interaction without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Provider store={store}><EditAccount history={historyMock} {...defaultprops} /></Provider>)
        const input1 = getByTestId('company-input');
        const input2 = getByTestId('company-code');

        const noOfLicense = getByTestId('noOfLicense');
        const additionalHRTemplate = getByTestId('additionalHRTemplate');
        const hrTemplateDiscount = getByTestId('hrTemplateDiscount');
        const additionalExpertHrs = getByTestId('additionalExpertHrs');
        
        userEvent.type(input1, "test");
        userEvent.type(input2, "test");
        userEvent.type(noOfLicense, "test");
        userEvent.type(additionalHRTemplate, "test");
        userEvent.type(hrTemplateDiscount, "test");
        userEvent.type(additionalExpertHrs, "test");
        await act(() => promise);
    });

});
