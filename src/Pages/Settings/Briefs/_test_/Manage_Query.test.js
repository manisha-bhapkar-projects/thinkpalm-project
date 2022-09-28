import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { findByTestAttr } from "../../../../test/testUtils"
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk'
import ManageQuery from '../Manage_Qurey';
import { act } from 'react-dom/test-utils';
jest.mock('axios');
const middlewares = [thunk]
const mockStore = configureStore(middlewares);
let store = mockStore({
  purchaseExpertReducer: {
    manageQueryData: {
      "agreementUploadId": "00000000-0000-0000-0000-000000000000",
      "countryId": 10,
      "countryName": null,
      "createdAt": "2021-10-08T07:32:29.797482",
      "createdBy": "482b5887-48fc-4f08-b8ec-ca659e6cf135",
      "expertUser": null,
      "expertUserId": null,
      "hasAgreement": true,
      "id": "22734539-c3d4-4241-a7b6-ac1919b351fe",
      "industryId": 7,
      "isActive": true,
      "isDeleted": false,
      "needKickOffCall": false,
      "noteForInternalView": null,
      "queryEstimate": null,
      "queryStatus": null,
      "queryStatusId": 1,
      "referenceNumber": "A00132",
      "reqUserCompanyId": 2607,
      "requestedUser": null,
      "requestedUserId": "482b5887-48fc-4f08-b8ec-ca659e6cf135",
      "timeTrackers": null,
      "timetrackerTotaltime":
      {
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
      "uploads": []
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
  timeTrackerValues: [{
    activity: '',
    hours: '',
    minutes: '',
    isBillableExcluded: false,
    isEditable: true,
  }],
  notify: () => { },
}
jest.mock('@react-keycloak/web', () => ({
  useKeycloak: () => {
    return {
      keycloak: false,
      initialize: false
    }
  },
}));
const setup = (historyMock, defaultprops) => {
  return mount(<Provider store={store}><Router history={historyMock}><ManageQuery {...defaultprops} /></Router></Provider>);
}


describe("Manage Query List Component", () => {
  let wrapper;
  let useEffect;
  const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
  const mockUseEffect = () => {
    useEffect.mockImplementationOnce(f => f())
  };
  beforeEach(() => {
    useEffect = jest.spyOn(React, "useEffect")
    wrapper = setup(historyMock, defaultprops);
    mockUseEffect()
    mockUseEffect()
  });

  it('render Manage Query List without error', async () => {
    const promise = Promise.resolve();
    const indexDiv = findByTestAttr(wrapper, 'manage-query')
    expect(indexDiv.length).toBe(1)
    await act(() => promise)

  });
  it('handle save timetracker button click', async () => {
    const promise = Promise.resolve();
    const saveButton = findByTestAttr(wrapper, 'saveTimetracker')
    expect(saveButton.simulate('click').length).toBe(1)
    saveButton.simulate('click')
    const timeTeackerDiv = findByTestAttr(wrapper, 'timeTrackerEntry')
    expect(timeTeackerDiv.length).toBe(1)
    await act(() => promise)

  });

  it('handle assign an expert button click', async () => {
    const promise = Promise.resolve();
    const assignButton = findByTestAttr(wrapper, 'assign-btn')
    expect(assignButton.simulate('click').length).toBe(1)
    assignButton.simulate('click')
    const assignDiv = findByTestAttr(wrapper, 'assignDiv')
    expect(assignDiv.length).toBe(1)
    await act(() => promise)
  });

  it('handle save estimate button click', async () => {
    const promise = Promise.resolve();
    const estimateButton = findByTestAttr(wrapper, 'save-estimate-btn')



    expect(estimateButton.simulate('click').length).toBe(1)
    estimateButton.simulate('click')
    const estimateDiv = findByTestAttr(wrapper, 'estimate-div')
    expect(estimateDiv.length).toBe(1)
    await act(() => promise)
  });



  it('handle upload button click', async () => {
    const promise = Promise.resolve();
    const uploadButton = findByTestAttr(wrapper, 'upload')
    expect(uploadButton.simulate('click').length).toBe(1)
    uploadButton.simulate('click')
    const uploadDiv = findByTestAttr(wrapper, 'uploadDiv')
    expect(uploadDiv.length).toBe(1)
    await act(() => promise)
  });

  it('handle addNoteBtn button click', async () => {
    const promise = Promise.resolve();
    const addNoteBtn = findByTestAttr(wrapper, 'addNoteBtn')
    expect(addNoteBtn.simulate('click').length).toBe(1)
    addNoteBtn.simulate('click')
    const addNoteDiv = findByTestAttr(wrapper, 'addNoteDiv')
    expect(addNoteDiv.length).toBe(1)
    await act(() => promise)
  });

  // it('handle add-instance button click', async () => {
  //   const promise = Promise.resolve();
  //   const addInstance = findByTestAttr(wrapper, 'add-instance')
  //   expect(addInstance.simulate('click').length).toBe(1)
  //   addInstance.simulate('click')
  //   const addInstanceDiv = findByTestAttr(wrapper, 'addInstanceDiv')
  //   expect(addInstanceDiv.length).toBe(1)
  //   await act(() => promise)
  // });

})



