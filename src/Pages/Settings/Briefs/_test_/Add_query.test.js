import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import AddQuery from '../Add_Query';
jest.mock('axios');
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store = mockStore({
  purchaseExpertReducer: {
    accountList: [
      {
        availableLicenses: 6,
        companyCode: '989',
        companyName: 'test',
        createdAt: '2021-08-11T05:06:52.567648',
        createdBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
        id: 899,
        industryId: 8,
        industryName: 'Biochemical',
        value: 899,
        label: 'test',
        isActive: true,
        isAllCountrySubscriptionExists: false,
        isDeleted: false,
        isPrimaryUserAdded: false,
        isUnlimitedLisense: false,
        noOfLicenses: 6,
        qboCompanyID: null,
        subscription: [
          { id: '08d95c85-d521-431d-8aeb-6d39fab99c06', companyId: 899 },
        ],
        updatedAt: '2021-08-11T05:06:52.567648',
        updatedBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
      },
    ],
    userList: [
      {
        availableLicenses: 6,
        companyCode: '989',
        companyName: 'test',
        createdAt: '2021-08-11T05:06:52.567648',
        createdBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
        id: 899,
        value: 899,
        industryId: 8,
        industryName: 'Biochemical',
        isActive: true,
        isAllCountrySubscriptionExists: false,
        isDeleted: false,
        isPrimaryUserAdded: false,
        isUnlimitedLisense: false,
        noOfLicenses: 6,
        qboCompanyID: null,
        label: 'haritha nihara',
        userProfile: [
          {
            id: '08d95c85-d521-431d-8aeb-6d39fab99c06',
            companyId: 899,
            createdAt: '2021-09-10T10:35:50.075303',
            createdBy: '00000000-0000-0000-0000-000000000000',
            firstName: 'haritha',
            id: '2610e6ec-7481-4e84-ad74-5d2f96d165f3',
            imageUrl: null,
            isActive: true,
            isDeleted: false,
            jobTitle: null,
            lastName: 'nihara',
            preferredName: 'haritha',
          },
        ],
        subscription: [
          { id: '08d95c85-d521-431d-8aeb-6d39fab99c06', companyId: 899 },
        ],
        updatedAt: '2021-08-11T05:06:52.567648',
        updatedBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
      },
      {
        availableLicenses: 6,
        companyCode: '989',
        companyName: 'test',
        createdAt: '2021-08-11T05:06:52.567648',
        createdBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
        id: 899,
        industryId: 8,
        industryName: 'Biochemical',
        isActive: true,
        isAllCountrySubscriptionExists: false,
        isDeleted: false,
        isPrimaryUserAdded: false,
        isUnlimitedLisense: false,
        noOfLicenses: 6,
        qboCompanyID: null,
        userProfile: [
          {
            id: '08d95c85-d521-431d-8aeb-6d39fab99c06',
            companyId: 899,
            createdAt: '2021-09-10T10:35:50.075303',
            createdBy: '00000000-0000-0000-0000-000000000000',
            firstName: 'haritha',
            id: '2610e6ec-7481-4e84-ad74-5d2f96d165f3',
            label: 'haritha nihara',
            imageUrl: null,
            isActive: true,
            isDeleted: false,
            jobTitle: null,
            lastName: 'nihara',
            preferredName: 'haritha',
          },
        ],
        subscription: [
          { id: '08d95c85-d521-431d-8aeb-6d39fab99c06', companyId: 899 },
        ],
        updatedAt: '2021-08-11T05:06:52.567648',
        updatedBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
      },
    ],

    userListData: [
      {
        availableLicenses: 6,
        companyCode: '989',
        companyName: 'test',
        createdAt: '2021-08-11T05:06:52.567648',
        createdBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
        id: 899,
        value: 899,
        industryId: 8,
        industryName: 'Biochemical',
        isActive: true,
        isAllCountrySubscriptionExists: false,
        isDeleted: false,
        isPrimaryUserAdded: false,
        isUnlimitedLisense: false,
        noOfLicenses: 6,
        qboCompanyID: null,
        label: 'haritha nihara',
        userProfile: [
          {
            id: '08d95c85-d521-431d-8aeb-6d39fab99c06',
            companyId: 899,
            createdAt: '2021-09-10T10:35:50.075303',
            createdBy: '00000000-0000-0000-0000-000000000000',
            firstName: 'haritha',
            id: '2610e6ec-7481-4e84-ad74-5d2f96d165f3',
            imageUrl: null,
            isActive: true,
            isDeleted: false,
            jobTitle: null,
            lastName: 'nihara',
            preferredName: 'haritha',
          },
        ],
        subscription: [
          { id: '08d95c85-d521-431d-8aeb-6d39fab99c06', companyId: 899 },
        ],
        updatedAt: '2021-08-11T05:06:52.567648',
        updatedBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
      },
      {
        availableLicenses: 6,
        companyCode: '989',
        companyName: 'test',
        createdAt: '2021-08-11T05:06:52.567648',
        createdBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
        id: 899,
        industryId: 8,
        industryName: 'Biochemical',
        isActive: true,
        isAllCountrySubscriptionExists: false,
        isDeleted: false,
        isPrimaryUserAdded: false,
        isUnlimitedLisense: false,
        noOfLicenses: 6,
        qboCompanyID: null,
        userProfile: [
          {
            id: '08d95c85-d521-431d-8aeb-6d39fab99c06',
            companyId: 899,
            createdAt: '2021-09-10T10:35:50.075303',
            createdBy: '00000000-0000-0000-0000-000000000000',
            firstName: 'haritha',
            id: '2610e6ec-7481-4e84-ad74-5d2f96d165f3',
            label: 'haritha nihara',
            imageUrl: null,
            isActive: true,
            isDeleted: false,
            jobTitle: null,
            lastName: 'nihara',
            preferredName: 'haritha',
          },
        ],
        subscription: [
          { id: '08d95c85-d521-431d-8aeb-6d39fab99c06', companyId: 899 },
        ],
        updatedAt: '2021-08-11T05:06:52.567648',
        updatedBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
      },
    ],
  },
});

const defaultprops = {
  initialValues: {
    AccountId: '',
    AccountName: '',
    UserId: '',
    UserName: '',
    RequestDate: '',
    QueryDetails: '',
  },
  accountLoading: false,
  userLoading: false,
  AddQuery: true,
  addQuerySuccess: '',
  userListData: [],
  accountData: [
    {
      availableLicenses: 6,
      companyCode: '989',
      companyName: 'test',
      createdAt: '2021-08-11T05:06:52.567648',
      createdBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
      id: 899,
      industryId: 8,
      industryName: 'Biochemical',
      value: 899,
      label: 'test',
      isActive: true,
      isAllCountrySubscriptionExists: false,
      isDeleted: false,
      isPrimaryUserAdded: false,
      isUnlimitedLisense: false,
      noOfLicenses: 6,
      qboCompanyID: null,
      subscription: [
        { id: '08d95c85-d521-431d-8aeb-6d39fab99c06', companyId: 899 },
      ],
      updatedAt: '2021-08-11T05:06:52.567648',
      updatedBy: '5274c659-2b2a-40a3-9fce-5f5fbb19509a',
    },
  ],
  notify: () => {},
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
        <AddQuery {...defaultprops} />
      </Router>
    </Provider>
  );
};

describe('Add Query Component', () => {
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
  test('render Add Query without error', async () => {
    const promise = Promise.resolve();
    const indexDiv = findByTestAttr(wrapper, 'addQuery');
    expect(indexDiv.length).toBe(2);
    await act(() => promise);
  });
  test('handle accountDropdown click', async () => {
    const promise = Promise.resolve();
    const accountDropdown = findByTestAttr(wrapper, 'accountDropdown');
    expect(accountDropdown.simulate('click').length).toBe(1);
    accountDropdown.simulate('click');
    const accountDiv = findByTestAttr(wrapper, 'accountDiv');
    expect(accountDiv.length).toBe(1);
    await act(() => promise);
  });

  test('handle userDropdown click', async () => {
    const promise = Promise.resolve();
    const userDropdown = findByTestAttr(wrapper, 'userDropdown');
    expect(userDropdown.simulate('click').length).toBe(1);
    userDropdown.simulate('click');
    const userDiv = findByTestAttr(wrapper, 'userDiv');
    expect(userDiv.length).toBe(1);
    await act(() => promise);
  });
});

// import { mount } from 'enzyme';
// import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';
// import { render, cleanup, waitFor, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'
// import { Router } from 'react-router';
// import React from 'react';
// import thunk from 'redux-thunk'
// import AddQuery from '../Add_Query';
// import { act } from 'react-dom/test-utils';

// jest.mock('axios');
// jest.mock('react-router-dom', () => ({
//   useLocation: jest.fn().mockReturnValue({
//     pathname: '/test',
//     search: '',
//     hash: '',
//     state: null,
//     key: '5nvxpbdafa',
//   }),
//   useHistory: jest.fn().mockReturnValue({ push: jest.fn(), location: {}, listen: jest.fn() }),
//   useParams: () => { return { id: "143f01e0-7b1f-4f63-9f79-4a5716038b96" } },
// }));

// jest.mock('@react-keycloak/web', () => ({
//   useKeycloak: () => {
//     return {
//       keycloak: false,
//       initialize: false
//     }
//   },
// }));

// afterEach(cleanup);
// const mockStore = configureStore([thunk]);
// let store = mockStore({
//   purchaseExpertReducer: {
//     accountList:[
//       {
//         'availableLicenses': 6,
//         'companyCode': "989",
//         'companyName': "test",
//         'createdAt': "2021-08-11T05:06:52.567648",
//         'createdBy': "5274c659-2b2a-40a3-9fce-5f5fbb19509a",
//         'id': 899,
//         'industryId': 8,
//         'industryName': "Biochemical",
//         'value': "Biochemical",
//         'label': "Biochemical",
//         'isActive': true,
//         'isAllCountrySubscriptionExists': false,
//         'isDeleted': false,
//         'isPrimaryUserAdded': false,
//         'isUnlimitedLisense': false,
//         'noOfLicenses': 6,
//         'qboCompanyID': null,
//         'subscription': [
//           {id: "08d95c85-d521-431d-8aeb-6d39fab99c06", 'companyId': 899}],
//         'updatedAt': "2021-08-11T05:06:52.567648",
//         'updatedBy': "5274c659-2b2a-40a3-9fce-5f5fbb19509a"
//       }
//   ],
//   userList:[
//     {
//       'availableLicenses': 6,
//       'companyCode': "989",
//       'companyName': "test",
//       'createdAt': "2021-08-11T05:06:52.567648",
//       'createdBy': "5274c659-2b2a-40a3-9fce-5f5fbb19509a",
//       'id': 899,
//       'industryId': 8,
//       'industryName': "Biochemical",
//       'isActive': true,
//       'isAllCountrySubscriptionExists': false,
//       'isDeleted': false,
//       'isPrimaryUserAdded': false,
//       'isUnlimitedLisense': false,
//       'noOfLicenses': 6,
//       'qboCompanyID': null,
//       userProfile: [
//         {
//           'id': "08d95c85-d521-431d-8aeb-6d39fab99c06",
//           'companyId': 899,
//           'createdAt': "2021-09-10T10:35:50.075303",
//           'createdBy': "00000000-0000-0000-0000-000000000000",
//           'firstName': "haritha",
//           'id': "2610e6ec-7481-4e84-ad74-5d2f96d165f3",
//           'label': 'haritha nihara',
//           'imageUrl': null,
//           'isActive': true,
//           'isDeleted': false,
//           'jobTitle': null,
//           'lastName': "nihara",
//           'preferredName': "haritha",
//         },
//       ],
//       'subscription': [
//         {id: "08d95c85-d521-431d-8aeb-6d39fab99c06", 'companyId': 899}],
//       'updatedAt': "2021-08-11T05:06:52.567648",
//       'updatedBy': "5274c659-2b2a-40a3-9fce-5f5fbb19509a"
//     },

// ]
//   }

// })

// const defaultprops = {
//   initialValues: {
//     AccountId: '',
//     AccountName: '',
//     UserId: '',
//     UserName: '',
//     RequestDate: '',
//     QueryDetails: '',
//   },

//   notify: () => { },
// };

// const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
// describe("AddQuery List Component", () => {

//   it('AddQuery page stimulate', async () => {
//     const promise = Promise.resolve();
//     const { rerender, getByTestId, asFragment } = render(
//       <Provider store={store}><AddQuery history={historyMock} {...defaultprops} /></Provider>
//     );

//     const listNode = await waitFor(() => getByTestId('add-query'));
//     expect(listNode.children).toHaveLength(1);
//     const queryNode = await waitFor(() => getByTestId('queryDetails'));
//     expect(queryNode.children).toHaveLength(1);

//     rerender(<Provider store={store}><AddQuery history={historyMock} {...defaultprops} /></Provider>);
//     await act(() => promise);
//   });

//   it('handle select Account Dropdown', async () => {
//     const promise = Promise.resolve();
//     const { rerender, getByTestId, asFragment } = render(<Provider store={store}><AddQuery history={historyMock} {...defaultprops} /></Provider>);

//     const accDropdown = await waitFor(() => getByTestId('selectAccountDropdown'));
//     userEvent.click(accDropdown);
//     const accountDropdown1 = await waitFor(() => getByTestId('selectAccountDropdown'));
//     userEvent.click(accountDropdown1, 'test');

//     const userDropdown = await waitFor(() => getByTestId('selectUserDropdown'));
//     userEvent.click(userDropdown);
//     const usersDropdown1 = await waitFor(() => getByTestId('selectUserDropdown'));
//     userEvent.click(usersDropdown1, 'test');

//     const date = await waitFor(() => getByTestId('RequestDate'));
//     const accountDropdown = await waitFor(() => getByTestId('selectAccountDropdown'));
//     const usersDropdown = await waitFor(() => getByTestId('selectUserDropdown'));
//     const queryDetail = await waitFor(() => getByTestId('queryDetails'));

//     const addQuery = await waitFor(() => getByTestId('save-Template'));
//     userEvent.click(addQuery);
//     userEvent.click(accountDropdown, '131234');
//     userEvent.click(usersDropdown, '14133');
//     userEvent.type(date, "1/10/2020");
//     userEvent.type(queryDetail, "test");
//     await act(() => promise);
//   });
// })
