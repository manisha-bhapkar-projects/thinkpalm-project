import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk'
import { act } from 'react-dom/test-utils';

import AlertsLandingPage from '../index';
import AllPage from '../allPage';
import MyCountriesPage from '../myCountry';


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
    useParams: () => { return { id: "143f01e0-7b1f-4f63-9f79-4a5716038b96", country: 'Afghanistan' } },
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
const allAlertsResponseEmpty = {
    "data": [],
    "totalCount": 1,
    "pageSize": 25
};
const allAlertsResponse = {
    "data": [
        {
            "id": "5321e4d6-971f-4d19-991c-8ff98cc90178",
            "alerttype": 1,
            "alerttitle": "alert title",
            "alertdescription": "description",
            "accountid": 1,
            "userid": "1221e4d6-971f-4d19-991c-8ff98cc90178",
            "regionid": 2,
            "countryid": 4,
            "stateid": 3,
            "langaugeid": 1,
            "isread": false,
            "noofdays": 2,
            "severity": 1,
            "severityName": "Critical",
            "action": {
                "id": "5321e4d6-971f-4d19-991c-8ff98cc90178",
                "alerttypeid": 1,
                "actionmethod": "get",
                "actionurl": "https://expuitest.azurewebsites.net/login/#/doc-shop",
                "actionbody": "action body "
            }
        }
    ],
    "totalCount": 1,
    "pageSize": 25
};
const countryAlertsResponseEmpty = {
    "data": [],
    "totalCount": 1,
    "pageSize": 25
};
const countryAlertsResponse = {
    "data": [
        {
            "id": "5321e4d6-971f-4d19-991c-8ff98cc90178",
            "alerttype": 1,
            "alerttitle": "alert title",
            "alertdescription": "description",
            "accountid": 1,
            "userid": "1221e4d6-971f-4d19-991c-8ff98cc90178",
            "regionid": 2,
            "countryid": 4,
            "stateid": 3,
            "langaugeid": 1,
            "createdAt": "2021-09-21T12:37:58.243358",
            "updatedAt": "2021-09-21T12:37:58.243358",
            "createdBy": "383620d4-fd40-43c5-bdb0-97b43831ff63",
            "updatedBy": "383620d4-fd40-43c5-bdb0-97b43831ff63",
            "isread": false,
            "noofdays": 2,
            "severity": 1,
            "severityName": "Critical",
            "action": {
                "id": "5321e4d6-971f-4d19-991c-8ff98cc90178",
                "alerttypeid": 1,
                "actionmethod": "get",
                "actionurl": "https://expuitest.azurewebsites.net/login/#/doc-shop",
                "actionbody": "action body "
            }
        }
    ],
    "totalCount": 1,
    "pageSize": 25
};
let store = mockStore({
    alertsReducer: {
    },
    country: {
        userCountryLoading: false,
        countryList: [{
            "id": 1,
            "country_Name": "Afghanistan",
            "country_Code": "AFG",
            "order_Id": 0,
            "region_Id": "5",
            "is_Deleted": false,
            "is_Active": true,
            "isNewlyAdded": false,
            "videoLink": null,
            "isCompanyFavourite": false,
            "isUserFavourite": true
        },
        {
            "id": 2,
            "country_Name": "Albania",
            "country_Code": "ALB",
            "order_Id": 0,
            "region_Id": "1,3",
            "is_Deleted": false,
            "is_Active": true,
            "isNewlyAdded": false,
            "videoLink": null,
            "isCompanyFavourite": false,
            "isUserFavourite": true
        },
        {
            "id": 30,
            "country_Name": "Canada",
            "country_Code": "CAN",
            "order_Id": 0,
            "region_Id": "5",
            "is_Deleted": false,
            "is_Active": true,
            "isNewlyAdded": false,
            "videoLink": "https://www.youtube.com/watch?v=wgMGCmyXrbY",
            "isCompanyFavourite": false,
            "isUserFavourite": true
        }]
    },
    searchResultReducer: {
        autoSuggestResults: [{ id: 1, data: "test", contentName: "country page" }, { id: 2, data: "test", contentName: "country page" }]
    }
})

const defaultprops = {
    isTestCase: true,
    notify: () => { },
    selectedCountryId: ['all', 1, 2],
    getAllAlerts: () => { return { data: allAlertsResponse } },
    getCountryAlerts: () => { return { data: countryAlertsResponse } },
    markAsRead: () => { return { data: true } },
    deleteAlertItem: () => { return { data: null } },
    setLoadingAPI: () => { },
    callListAPI: () => { },
    history: { push: jest.fn(), location: {}, listen: jest.fn() }
};
const emptyValuesProps = {
    isTestCase: true,
    notify: () => { },
    selectedCountryId: ['all', 1, 2],
    getAllAlerts: () => { return { data: allAlertsResponseEmpty } },
    getCountryAlerts: () => { return { data: countryAlertsResponseEmpty } },
    markAsRead: () => { return { data: true } },
    deleteAlertItem: () => { return { data: null } },
    setLoadingAPI: () => { },
    callListAPI: () => { },
    history: { push: jest.fn(), location: {}, listen: jest.fn() }
};

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
describe("Alerts Landing page ", () => {

    it('Alerts landing page stimulate', async () => {
        const promise = Promise.resolve();
        const { rerender, getByTestId, asFragment } = render(
            <Provider store={store}><AlertsLandingPage history={historyMock} {...defaultprops} /></Provider>
        );

        const listNode = await waitFor(() => getByTestId('alerts-page-container'));
        expect(listNode.children).toHaveLength(2);

        rerender(<Provider store={store}><AlertsLandingPage history={historyMock} {...emptyValuesProps} /></Provider>);
        await act(() => promise);
    });

    it('Alerts landing page breadcrumbs stimulate', async () => {
        const promise = Promise.resolve();
        const { rerender, getByTestId, asFragment } = render(
            <Provider store={store}><AlertsLandingPage history={historyMock} {...defaultprops} /></Provider>
        );

        const breadcrumb1 = screen.getByText("Home")
        userEvent.click(breadcrumb1);

        const breadcrumb2 = screen.getByText("Afghanistan")
        userEvent.click(breadcrumb2);

        const breadcrumb3 = screen.getByText("Manage")
        userEvent.click(breadcrumb3);
        await act(() => promise);
    });

    it('Alerts landing page country List stimulate', async () => {
        const promise = Promise.resolve();
        const { rerender, getByTestId, asFragment } = render(
            <Provider store={store}><AlertsLandingPage history={historyMock} {...defaultprops} /></Provider>
        );

        const all = await waitFor(() => getByTestId('All'));
        const country = await waitFor(() => getByTestId('Country'));
        userEvent.click(all);
        userEvent.click(country);

        const checkBox1 = screen.getByText("All Favorites")
        userEvent.click(checkBox1);

        const checkBox2 = screen.getByText("Albania")
        userEvent.click(checkBox2);

        await act(() => promise);
    });

});

describe("All Alerts page", () => {

    it('All Alerts page stimulate', async () => {
        const promise = Promise.resolve();
        const { rerender, getByTestId, asFragment } = render(
            <Provider store={store}><AllPage history={historyMock} {...defaultprops} /></Provider>
        );

        const listNode = await waitFor(() => getByTestId('all-page-container'));
        expect(listNode.children).toHaveLength(1);


        rerender(<Provider store={store}><AllPage history={historyMock} {...emptyValuesProps} /></Provider>);
        await act(() => promise);
    });

    it('All Alerts Card Item stimulate', async () => {
        const promise = Promise.resolve();
        const { rerender, getByTestId, asFragment } = render(
            <Provider store={store}><AlertsLandingPage history={historyMock} {...defaultprops} /></Provider>
        );

        const morePopup = await waitFor(() => getByTestId('more-popup'));
        userEvent.click(morePopup);

        const markAsRead = await waitFor(() => getByTestId('mark-read'));
        userEvent.click(markAsRead);
        userEvent.click(morePopup);

        const deleteAction = await waitFor(() => getByTestId('delete-item'));
        userEvent.click(deleteAction);
        userEvent.click(morePopup);

        const manageNotify = await waitFor(() => getByTestId('manage-notify'));
        userEvent.click(manageNotify);

        const hidePopup = await waitFor(() => getByTestId('click-outside-popup'));
        userEvent.click(hidePopup);

        await act(() => promise);
    });

});

describe("Country Alerts page", () => {

    it('Country Alerts page stimulate', async () => {
        const promise = Promise.resolve();
        const { rerender, getByTestId, asFragment } = render(
            <Provider store={store}><MyCountriesPage history={historyMock} {...defaultprops} /></Provider>
        );

        const listNode = await waitFor(() => getByTestId('my-country-page-container'));
        expect(listNode.children).toHaveLength(1);


        rerender(<Provider store={store}><MyCountriesPage history={historyMock} {...emptyValuesProps} /></Provider>);
        await act(() => promise);
    });

    it('Country Alerts Card Item stimulate', async () => {
        const promise = Promise.resolve();
        const { rerender, getByTestId, asFragment } = render(
            <Provider store={store}><MyCountriesPage history={historyMock} {...defaultprops} /></Provider>
        );

        const morePopup = await waitFor(() => getByTestId('more-popup'));
        userEvent.click(morePopup);

        const markAsRead = await waitFor(() => getByTestId('mark-read'));
        userEvent.click(markAsRead);
        userEvent.click(morePopup);

        const deleteAction = await waitFor(() => getByTestId('delete-item'));
        userEvent.click(deleteAction);
        userEvent.click(morePopup);

        const manageNotify = await waitFor(() => getByTestId('manage-notify'));
        userEvent.click(manageNotify);

        const hidePopup = await waitFor(() => getByTestId('click-outside-popup'));
        userEvent.click(hidePopup);

        await act(() => promise);
    });

});



