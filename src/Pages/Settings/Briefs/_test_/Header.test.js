import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk';
import Header from '../Header';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store = mockStore({
  purchaseExpertReducer: {
    statusList: [
      {
        createdAt: '2021-09-30T06:59:41.576991',
        createdBy: '8e58e971-b839-4897-ba36-ab6a1a06bb1b',
        displayOrder: 'A',
        id: 1,
        isActive: true,
        isDeleted: false,
        status: 'Submitted',
        updatedAt: '2021-09-30T06:59:41.576991',
        updatedBy: '8e58e971-b839-4897-ba36-ab6a1a06bb1b',
      },
      {
        createdAt: '2021-09-30T06:59:41.576991',
        createdBy: '8e58e971-b839-4897-ba36-ab6a1a06bb1b',
        displayOrder: 'B',
        id: 2,
        isActive: true,
        isDeleted: false,
        status: 'In Progress',
        updatedAt: '2021-09-30T06:59:41.576991',
        updatedBy: '8e58e971-b839-4897-ba36-ab6a1a06bb1b',
      },
    ],
    
  },
});

const defaultprops = {
  pageNumber: 1,
  sortField: 'updateddate',
  sortOrder: true,
  setPageNumber: jest.fn(),
  setSortField: jest.fn(),
  setSortOrder: jest.fn(),
  onTextChange: jest.fn(),
  setSearchValue: 'search',
  downlodFileloading: false,
  statusData: [],
  searchValue: true,
  loading: false
};
jest.mock('@react-keycloak/web', () => ({
  useKeycloak: () => {
    return {
      keycloak: false,
      initialize: false,
    };
  },
}));
const setup = (historyMock, defaultprops) => {
  return mount(
    <Provider store={store}>
      <Router history={historyMock}>
        <Header {...defaultprops} />
      </Router>
    </Provider>
  );
};

describe('Header Component', () => {
  let wrapper;
  let useEffect;
  const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
  const mockUseEffect = () => {
    useEffect.mockImplementationOnce((f) => f());
  };
  beforeEach(() => {
    useEffect = jest.spyOn(React, 'useEffect');
    wrapper = setup(historyMock, defaultprops);
    mockUseEffect();
    mockUseEffect();
  });
  test('render Header without error', () => {
    const indexDiv = findByTestAttr(wrapper, 'manage-brief-header');
    expect(indexDiv.length).toBe(1);
  });

  test('handle downloadFile click', async () => {
    const promise = Promise.resolve();
    const downloadFile = findByTestAttr(wrapper, 'downloadFile');
    expect(downloadFile.simulate('click').length).toBe(1);
    downloadFile.simulate('click');
    // const userDiv = findByTestAttr(wrapper, 'userDiv');
    // expect(userDiv.length).toBe(1);
    // await act(() => promise);
  });

  
});
