import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../test/testUtils';
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import ManageAlerts from '../manageAlerts';
jest.mock('axios');
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store = mockStore({
  manageAlertReducer: {
    alertTypeList: [
      {
        alertTopics: [
          {
            alertMasterId: 1,
            alertTypes: [
              {
                alertMasterId: 1,
                alertTopicId: 1,
                disableNotifications: false,
                emailNotification: false,
                id: 1,
                inAppNotification: false,
                orderId: 1,
                type: 'Notify me of Critical and Major content updates to My Countries',
                typeCode: 'MAJOR_CONTENT_UPDATE',
                typeDescription:
                  'This includes updates made to Labor & Employment data.',
                topicName: 'Content Updates',
              },
            ],
            id: 1,
            orderId: 1,
            topicName: 'Content Updates',
          },
        ],
        id: 1,
        masterCode: 'MY_COUNTRY',
        masterName: 'My Countries',
        orderId: 1,
      },
    ],
  },
});

const defaultprops = {
  alertTypeListLoading: false,
  updateSuccess: '',
  selectedEmail:[],
  selectedInApp:[],
  userData:{}
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
        <ManageAlerts {...defaultprops} />
      </Router>
    </Provider>
  );
};

describe('Manage Alerts Component', () => {
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
  test('render manageAlerts without error', async () => {
    const indexDiv = findByTestAttr(wrapper, 'manageAlerts');
    expect(indexDiv.length).toBe(1);
  });

  test('render showNotification without error', async () => {
    const indexDiv = findByTestAttr(wrapper, 'showNotification');
    expect(indexDiv.length).toBe(1);
  });
  test('render notifications without error', async () => {
    const indexDiv = findByTestAttr(wrapper, 'notifications');
    expect(indexDiv.length).toBe(1);
  });
  test('handle back_btn click', async () => {
    const promise = Promise.resolve();
    const back_btn = findByTestAttr(wrapper, 'back_btn');
    expect(back_btn.simulate('click').length).toBe(1);
    back_btn.simulate('click');
    await act(() => promise);
  });
  test('handle emailClick click', async () => {
    const promise = Promise.resolve();
    const emailClick = findByTestAttr(wrapper, 'emailClick');
    expect(emailClick.simulate('change').length).toBe(1);
    emailClick.simulate('change');
    await act(() => promise);
  });
  test('handle inAppClick click', async () => {
    const promise = Promise.resolve();
    const inAppClick = findByTestAttr(wrapper, 'inAppClick');
    expect(inAppClick.simulate('change').length).toBe(1);
    inAppClick.simulate('change');
    await act(() => promise);
  });
});
