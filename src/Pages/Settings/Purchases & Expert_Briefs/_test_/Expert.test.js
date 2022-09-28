import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import Expert_Briefs from '../Expert_Briefs';
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store = mockStore({
    purchaseExpertReducer: {
        expertList: {
            "data": [
                {
                    "id": "d825416a-c19c-4a68-8650-7939eb9b0b4a",
                    "referenceNo": "A00156",
                    "expertName": "Gopal",
                    "expertContentId": "11eb-9864-c025a51c2077",
                    "requestedUserId": "f1f44b27-5f58-412d-a6a1-91be1bf986be",
                    "requestedUser": {
                        "userId": "f1f44b27-5f58-412d-a6a1-91be1bf986be",
                        "firstName": "sad",
                        "lastName": "dsa",
                        "fullName": "sad dsa",
                        "emailId": null
                    },
                    "countryId": 2321,
                    "countryName": "indiayuZ",
                    "timeUsed": null,
                    "statusId": 5,
                    "status": "Submitted",
                    "statusDisplayOrder": "A",
                    "industryId": 1,
                    "industry": {
                        "id": 1,
                        "industryName": "Finance"
                    },
                    "hasAgreement": true,
                    "agreementUploadId": "86be0011-dae5-41c9-b502-fe144348d091",
                    "agreementUploadFileName": null,
                    "areaToClarify": "clarification should be described",
                    "needKickOffCall": true,
                    "hasEmployeesInCountry": true,
                    "reqUserCompany": {
                        "id": 1428,
                        "name": "Newaccqa"
                    },
                    "assignee": null,
                    "isActive": true,
                    "isDeleted": false,
                    "requestDate": "2021-10-13T04:37:35.637841",
                    "updatedAt": "2021-10-13T04:37:35.637895",
                    "createdBy": "f1f44b27-5f58-412d-a6a1-91be1bf986be",
                    "updatedBy": "f1f44b27-5f58-412d-a6a1-91be1bf986be"
                },
            ],
            "totalCount": 76,
            "pageSize": 10,
            "currentPage": 1,
            "firstPage": 1,
            "lastPage": 8
        }
    }
})
jest.mock('axios');

const setup = () => {
    return mount(<Provider store={store}><Expert_Briefs /></Provider>);
}
describe("Expert_Briefs Component", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render Expert_Briefs without error', () => {
        const indexDiv = findByTestAttr(wrapper, 'ExpertBriefs')
        expect(indexDiv.length).toBe(1)
    })
    test('click download btn without error', () => {
        const Responses = findByTestAttr(wrapper, 'Responses')
        expect(Responses.simulate('click').length).toBe(1)
    })

})