import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk'
import ManageQuery from '../Manage_Qurey';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { act } from 'react-dom/test-utils';

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
  purchaseExpertReducer: {
    manageQueryData: {
      "agreementUploadId": "00000000-0000-0000-0000-000000000000",
      "countryId": 10,
      "countryName": null,
      "createdAt": "2021-10-08T07:32:29.797482",
      "createdBy": "482b5887-48fc-4f08-b8ec-ca659e6cf135",
      "expertUser": {
        "emailId": 'testmail@test.com',
        "fullName": 'Tester',
        "name": 'Tester',
        "isEditable": false,
      },
      "expertUserId": null,
      "hasAgreement": true,
      "id": "22734539-c3d4-4241-a7b6-ac1919b351fe",
      "industryId": 7,
      "isActive": true,
      "isDeleted": false,
      "needKickOffCall": false,
      "noteForInternalView": null,
      "queryEstimate": {
        "balanceHour": 0,
        "balanceMinutes": 0,
        "createdAt": "0001-01-01T00:00:00",
        "createdBy": "00000000-0000-0000-0000-000000000000",
        "hours": 2,
        "id": "c78d7c74-37cc-40cb-9b65-b36bf7ff269d",
        "isActive": true,
        "isDeleted": false,
        "isEstimationMilSent": false,
        "minutes": 10,
        "noteForUser": "estimation is done",
        "queryId": "45f381c5-bd21-4d24-82fb-f9b1fc9f4b05",
        "status": "Estimate Approved by user",
        "statusId": 1,
        "updatedAt": "2021-10-19T12:08:00.509758",
        "updatedBy": "51097bfe-549a-4fd3-b180-a51978c5fd7f",
        "updatedByUserName": "Remisha t",
        "usedHour": 2,
        "usedminutes": 0,
        "userCancellationNote": ""
      },
      "queryStatus": null,
      "queryStatusId": 1,
      "referenceNumber": "A00132",
      "reqUserCompanyId": 2607,
      "requestedUser": null,
      "requestedUserId": "482b5887-48fc-4f08-b8ec-ca659e6cf135",
      "timeTrackers": [
        {
          "id": "76d5001b-5ee6-4893-a293-605529f1e2f0",
          "queryId": "31e44840-8401-443d-a94f-819be94d2bbe",
          "activity": "Data test",
          "hours": 12,
          "minutes": 12,
          "isBillableExcluded": false,
          "isActive": false,
          "isDeleted": false,
          "createdAt": "2021-10-19T10:48:46.769034",
          "updatedAt": "2021-10-19T10:48:46.769034",
          "createdBy": "f1f44b27-5f58-412d-a6a1-91be1bf986be",
          "updatedBy": "f1f44b27-5f58-412d-a6a1-91be1bf986be",
          "updatedByName": "sad dsa"
        }
      ],
      "timetrackerTotaltime": {
        "totalHours": 0,
        "totalMinutes": 0,
        "totalBillableHours": 0,
        "totalBillableMinutes": 0
      },
      "totalBillableHours": 0,
      "totalBillableMinutes": 0,
      "totalHours": 0,
      "totalMinutes": 0,
      "updatedAt": "2021-10-08T07:32:29.797483",
      "updatedBy": "482b5887-48fc-4f08-b8ec-ca659e6cf135",
      "uploads": [{
        "originalFileName": 'test.png',
        "id": 1
      }]
    },
    assignExpertPending: false,
    expertEmailList:[
      {
        emailId: "gopal.nBbd@thinkpalm.com",
        userId: "7a618ed4-d5f9-438f-9c66-be1d02648658",
        userName: "updated first name ExpApiLN"
      },
      {
        emailId: "gopal.nBbd@thinkpalm.com",
        userId: "7a618ed4-d5f9-438f-9c66-be1d02648658",
        userName: "updated first name ExpApiLN"
      },

    ]
  },
  myAccountReducer: {
    imageURL: {
      "originalFileName": 'test.png',
      "id": 1
    }
  },
  searchResultReducer: {
    autoSuggestResults: [{ id: 1, data: "test", contentName: "country page" }, { id: 2, data: "test", contentName: "country page" }]
  }
})

const defaultprops = {
  initialValues: {
    estimateHours: '',
    estimateMinutes: '',
    estimateNoteForUser: '',
    noteForInternalView: '',
    userCancellationNote: '',
    isEditable: true,
  },
  isTestCase: true,
  timeTrackerValues: [{
    activity: '',
    hours: '',
    minutes: '',
    isBillableExcluded: false,
    isEditable: true,
  }],
  notify: () => { },
  isOpen: true,
  onCancelClick: () => { },
  filename: "testing",
  onDelete: () => { },
};


const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
describe("Manage Query List Component", () => {

  it('Manage query page stimulate', async () => {
    const promise = Promise.resolve();
    const { rerender, getByTestId, asFragment } = render(
      <Provider store={store}><ManageQuery history={historyMock} {...defaultprops} /></Provider>
    );

    const listNode = await waitFor(() => getByTestId('manage-query-page'));
    expect(listNode.children).toHaveLength(1);
    rerender(<Provider store={store}><ManageQuery history={historyMock} {...defaultprops} /></Provider>);
    await act(() => promise);
  });

  it('handle Remove uploaded document', async () => {
    const promise = Promise.resolve();
    const { rerender, getByTestId, asFragment } = render(<Provider store={store}><ManageQuery history={historyMock} {...defaultprops} /></Provider>);

    const trackEditBtn = await waitFor(() => getByTestId('editTimetracker'));
    userEvent.click(trackEditBtn);
    const input1 = await waitFor(() => getByTestId('estimateHours'));
    const input2 = await waitFor(() => getByTestId('estimateMinutes'));
    const input3 = await waitFor(() => getByTestId('expiration'));
    const input4 = await waitFor(() => getByTestId('hours'));
    const input5 = await waitFor(() => getByTestId('minutes'));
    const input6 = await waitFor(() => getByTestId('estimateNoteForUser'));
    const checkbox = await waitFor(() => getByTestId('isBillableExcluded'));

    const trackerEditBtn = await waitFor(() => getByTestId('tracker-edit-btn'));
    userEvent.click(trackerEditBtn);
    userEvent.click(checkbox);
    userEvent.type(input1, "1");
    userEvent.type(input2, "2");
    userEvent.type(input3, "3");
    userEvent.type(input4, "4");
    userEvent.type(input5, "5");
    userEvent.type(input6, "test");
    const cancelBtn = await waitFor(() => getByTestId('cancel-btn'));
    const saveBtn = await waitFor(() => getByTestId('save-estimation-btn'));
    userEvent.click(cancelBtn);
    userEvent.click(saveBtn);
    const assignBtn = await waitFor(() => getByTestId('handle-ask-expert'));
    userEvent.click(assignBtn);
    await act(() => promise);
  });

  test('upload file', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const promise = Promise.resolve();
    const { getByTestId } = render(<Provider store={store}><ManageQuery history={historyMock} {...defaultprops} /></Provider>);
    const input = await waitFor(() => getByTestId('document-upload-input'));
    const internalBtn = await waitFor(() => getByTestId('internal-delete-btn'));
    userEvent.upload(input, file)

    expect(input.files[0]).toStrictEqual(file)
    expect(input.files.item(0)).toStrictEqual(file)
    expect(input.files).toHaveLength(1);
    userEvent.click(internalBtn);

    userEvent.upload(input, file)
    expect(input.files[0]).toStrictEqual(file)
    expect(input.files.item(0)).toStrictEqual(file)
    expect(input.files).toHaveLength(1);
    const uploadFileBtn = await waitFor(() => getByTestId('upload-file-btn'));
    userEvent.click(uploadFileBtn);
    const externalBtn = await waitFor(() => getByTestId('external-delete-btn'));
    userEvent.click(externalBtn);
    const onDeleteBtn = await waitFor(() => getByTestId('onDeleteBtn'));
    userEvent.click(onDeleteBtn);
    await act(() => promise);
  })

  it('confirm modal popup', async () => {
    const promise = Promise.resolve();
    const { rerender, getByTestId, asFragment } = render(
      <Provider store={store}>
        <Router history={historyMock}>
          <DeleteConfirmModal {...defaultprops} />
        </Router>
      </Provider>
    );

    await act(() => promise);
  })
})



