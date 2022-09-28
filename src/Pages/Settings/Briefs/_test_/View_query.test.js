import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from "../../../../test/testUtils"
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk'
import { act } from 'react-dom/test-utils';
import ViewQuery from '../View_Query';
jest.mock('axios');
const middlewares = [thunk]
const mockStore = configureStore(middlewares);
let store = mockStore({
  purchaseExpertReducer: {
    viewQueryData : {
        queryDetails: {
            "agreementUploadId": "00000000-0000-0000-0000-000000000000",
            "countryId": 10,
            "countryName": null,
            "createdAt": "2021-10-08T07:32:29.797482",
            "createdBy": "482b5887-48fc-4f08-b8ec-ca659e6cf135",
            employeesDetails : [
                {
                  "employeeType": "Permanent (Full - Time) Local",
                  "employeeTypeId": "00000000-0000-0000-0000-000000000000",
                  "expertQuestionId": "7b7ae62c-3604-4989-b2ec-ca08db9708ad",
                  "hourly": 3,
                  "salaried": 4
                },
                {
                  "employeeType": "Permanent (Full - Time) Local",
                  "employeeTypeId": "00000000-0000-0000-0000-000000000000",
                  "expertQuestionId": "7b7ae62c-3604-4989-b2ec-ca08db9708ad",
                  "hourly": 4,
                  "salaried": 4
                },
      
            ],
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
        }
     
  
    
}
})

const defaultprops = {
    initialValues: {
      estimateHours: '',
      estimateMinutes: '',
      estimateNoteForUser: '',
      noteForInternalView: '',
      userCancellationNote:'',
      isEditable: true,
    },
    timeTrackerValues : [{
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
    return mount(<Provider store={store}><Router history={historyMock}><ViewQuery {...defaultprops} /></Router></Provider>);
}


describe("View Query Component", () => {
    let wrapper;
    let useEffect
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
    test('render View Query without error', async () => {
        const promise = Promise.resolve();
        const indexDiv = findByTestAttr(wrapper, 'view-query')
        expect(indexDiv.length).toBe(1)
        await act(() => promise)
    });
    
    test('handle assignBtn button click', async()=>{
      const promise = Promise.resolve();
      const assignBtn = findByTestAttr(wrapper,'assignBtn')
      expect(assignBtn.simulate('click').length).toBe(1)
      assignBtn.simulate('click')
      const assignDiv = findByTestAttr(wrapper,'assignDiv')
      expect (assignDiv.length).toBe(1)
      await act(() => promise)
    });
})



