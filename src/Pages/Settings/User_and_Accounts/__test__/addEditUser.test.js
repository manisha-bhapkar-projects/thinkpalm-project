import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import EditUser from '../SuperAdminEditUser'
import AddUser from '../SuperAdminAddUser'
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
    useHistory: () => { return { push: jest.fn(), location: {}, listen: jest.fn() } },
    useParams: () => { return { id: 7, company: 898 } },
}));

jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
jest.mock('../../../../utils/axiosConfig', () => ({
    post: () => {
        return new Promise((reject, resolve) => resolve({ response: { status: true, data: '' } }));
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
        updateUser: false,
        userAllListLoading: false,
        accountsList: {},
        accountsListLoading: false,
        accountInfoLoading: false,
        accountInfo: {},
        allAccountList: [],
        allAccountListLoading: false,
        industryList: [],
        subscriptionList: [],
        allCountryList: [],
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
    notify: () => { },
    reducer: {
        countryId: 1,
        countryName: 'Test country',
    }
};

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

describe("Add and Edit Account Page Component", () => {

    it('render Add page without error', async () => {
        const { rerender, getByTestId, asFragment } = render(<Provider store={store}><AddUser {...defaultprops} /></Provider>);
        const listNode = await waitFor(() => getByTestId('superAdminAddUser'));
        expect(listNode.children).toHaveLength(5);
        const input1 = getByTestId('firstName');
        const input2 = getByTestId('lastName');
        const input3 = getByTestId('email');

        userEvent.type(input1, "test");
        userEvent.type(input2, "test");
        userEvent.type(input3, "test");
        rerender(<Provider store={store}><AddUser {...defaultprops} /></Provider>);
        // expect(asFragment()).toMatchSnapshot();
    })

    it('render Edit page without error', async () => {
        const { rerender, getByTestId, asFragment } = render(<Provider store={store}><EditUser {...defaultprops} /></Provider>);
        const listNode = await waitFor(() => getByTestId('SuperAdminEditUser'));
        expect(listNode.children).toHaveLength(5);
        const input1 = getByTestId('firstName');
        const input2 = getByTestId('lastName');
        const input3 = getByTestId('email');
        const saveBtn = getByTestId('save-Template');

        userEvent.type(input1, "test");
        userEvent.type(input2, "test");
        userEvent.type(input3, "test");
        userEvent.click(saveBtn);
        rerender(<Provider store={store}><EditUser {...defaultprops} /></Provider>);
        // expect(asFragment()).toMatchSnapshot();
    })

    test('simulate Add form interaction without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Provider store={store}><EditUser history={historyMock} {...defaultprops} /></Provider>)
        // 
        await act(() => promise);
    });

    // test('simulate Edit form interaction without error', async () => {
    //     const promise = Promise.resolve();
    //     const { getByTestId, asFragment } = render(<Provider store={store}><AddUser history={historyMock} {...defaultprops} /></Provider>)
    //     const input1 = getByTestId('company-input');
    //     const input2 = getByTestId('company-code');


    //     await act(() => promise);
    // });

});
