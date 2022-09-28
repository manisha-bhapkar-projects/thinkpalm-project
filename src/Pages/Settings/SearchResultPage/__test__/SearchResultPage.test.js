import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../../test/testUtils';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import SearchResultPage from '../index'
import SearchPageHeader from '../SearchPageHeader'
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';

jest.mock('axios');

afterEach(cleanup);
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn().mockReturnValue({
        pathname: '/test',
        search: '',
        hash: '',
        state: null,
        key: '5nvxpbdafa',
    }),
    useHistory: jest.fn().mockReturnValue({ push: jest.fn(), location: {}, listen: jest.fn() }),
    
}));

jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
const mockStore = configureStore([thunk]);
let store = mockStore({
    searchResultReducer: {
        searchTextValue: "Test",
        stateId: false,
        countryId: 1,
        regionId: false,
        stateName: '',
        countryName: 'Test country',
        regionName: '',
    }
});

const defaultprops = {
    searchTextValue: "Test",
    getSearchResult: () => { },
    updateSearchText: () => { },
    reducer: {
        countryId: 1,
        countryName: 'Test country',
    }
}


describe("Search Header Component", () => {
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

    it('render Search page header without error', async () => {
        const { getByTestId, asFragment } = render(<Provider store={store}><SearchPageHeader {...defaultprops} /></Provider>);
        const listNode = await waitFor(() => getByTestId('search-results-wrap'));
        expect(listNode.children).toHaveLength(2);
        // expect(asFragment()).toMatchSnapshot();
    });

    test('simulate Header Navigation Click without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Provider store={store}><SearchPageHeader {...defaultprops } history={historyMock} /></Provider>)
        const paginateBtn = getByTestId('navBar');
        userEvent.click(paginateBtn);
        expect(historyMock.push.mock.calls[0][0]).toEqual('/details/1');
        await act(() => promise);
    });

    test('simulate Header search Click without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Provider store={store}><SearchPageHeader {...defaultprops } /></Provider>)
        const paginateBtn = getByTestId('quick-search-input');
        userEvent.type(paginateBtn, "testing UI");
        userEvent.click(paginateBtn);
        await act(() => promise);
    });
});