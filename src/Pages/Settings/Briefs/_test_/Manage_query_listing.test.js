import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from "../../../../test/testUtils"
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk'
import ManageBriefs from '../Manage_Briefs_listing';

jest.mock('axios');
const middlewares = [thunk]
const mockStore = configureStore(middlewares);
let store = mockStore({
  purchaseExpertReducer: {
    manageBriefList:[
        {
            agreementUploadFileName: "doc.txt",
            agreementUploadId: "00000000-0000-0000-0000-000000000000",
            areaToClarify: "qa",
            assignee: {
                        emailId: "sba.gmail.com",
                        firstName: "ExpAPIFN",
                        fullName: "ExpAPIFN ExpApiLN",
                        lastName: "ExpApiLN",
                        userId: "dac73b3d-69c4-4287-9644-646019009808"
                      },
            countryId: 1,
            countryName: "Afghanistan",
            createdBy: "36ccf396-241a-463f-bd0e-1ecfd4359852",
            expertContentId: "60ed63016d3a46315361a4b3",
            expertName: "Sudheesh MS",
            hasAgreement: false,
            hasEmployeesInCountry: true,
            id: "02cfa898-897b-4282-b0ea-bfd2d5d5ec09",
            industry: {
                    id: 7, 
                    industryName: "HR and Staffing"
                    },
            industryId: 7,
            isActive: true,
            isDeleted: false,
            needKickOffCall: false,
            referenceNo: "A00303",
            reqUserCompany: {
                                id: 2935, 
                                name: "AccountQA20"
                            },
            requestDate: "2021-10-29T10:24:57.900805",
            requestedUser: {
                                emailId: "abc.gmail.com",
                                firstName: "nayana m",
                                fullName: "nayana m QA",
                                lastName: "QA",
                                userId: "36ccf396-241a-463f-bd0e-1ecfd4359852"
                            },
            requestedUserId: "36ccf396-241a-463f-bd0e-1ecfd4359852",
            status: "In Progress",
            statusDisplayOrder: "B",
            statusId: 2,
            timeUsed: {
                        usedHour: 0, 
                        usedminutes: 0
                      },
            updatedAt: "2021-10-29T10:52:17.378468",
            updatedBy: "f1f44b27-5f58-412d-a6a1-91be1bf986be"
        }
    ]
}
})

const defaultprops = {
    pageNumber: 1,
    sortField: "updateddate",
    sortOrder: true,
    setSortField: "updateddate",
    setSortOrder: true,
    filter:true,
    breadcrumb: true,
    userData: {},
    manageBriefsListing: true,
    setSearchValue: "",
    searchValue:'',
    onTextChange: jest.fn(),
    FilterAPIRequest: jest.fn(),
    downloadLoading: false,
    isSorting: false

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
    return mount(<Provider store={store}><Router history={historyMock}><ManageBriefs {...defaultprops} /></Router></Provider>);
}


describe("Manage Briefs List Component", () => {
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
    test('render Manage Briefs List without error', () => {
        const indexDiv = findByTestAttr(wrapper, 'manage-brief-listing')
        expect(indexDiv.length).toBe(1)
    })
    test('render search-results-wrap without error', () => {
        const indexDiv = findByTestAttr(wrapper, 'search-results-wrap')
        expect(indexDiv.length).toBe(1)
    })
   
    
})



