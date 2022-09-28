import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from "../../../../test/testUtils"
import FavoriteCounries from '../index'
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares);
let store = mockStore({
    favoriteCountriesReducer: {
    "userId":"8e58e971-b839-4897-ba36-ab6a1a06bb1b",
    "employeeCountList":
        [
            {
                "id":"08d96f9c-ad95-4f39-89a0-9758af851ccb",
                "countryID":6,
                "employeeCount":15,
                "employeeTypes":
                [
                    {"id":"08d97115-3611-461c-870a-0d86becf1db5",
                     "companyId":140,
                     "countryId":6,         
                     "employeeTypeId":"0397930e-fb1a-48c9-a4b3-cf4cd78a53e9",
                     "salariedCount":3,
                     "hourlyCount":0
                    },
               
                    {
                        "id":"08d97115-3611-4641-8643-e6c67e713720",
                        "companyId":140,
                        "countryId":6,
                        "employeeTypeId":"118e2140-643a-4827-abc5-5af911891c93",
                        "salariedCount":4,
                        "hourlyCount":1
                    },
                    {
                        "id":"08d97115-3611-4650-8c97-75c2c5b6bd43",
                        "companyId":140,
                        "countryId":6,
                        "employeeTypeId":"1841c098-d8f3-46b3-b779-f2af14bf6312",
                        "salariedCount":3,
                        "hourlyCount":0
                    },
                    {
                        "id":"08d97115-3611-465c-8993-9d3003adf253",
                        "companyId":140,
                        "countryId":6,
                        "employeeTypeId":"ea8ec746-4ca7-4143-b37d-4c5795254e9e",
                        "salariedCount":4,
                        "hourlyCount":0
                    }
                ]
            },


            {
                "id":"08d96f9c-ad95-4f39-89a0-9758af851cfb",
                "countryID":6,
                "employeeCount":15,
                "employeeTypes":
                [
                    {"id":"08d97115-3611-461c-870a-0d86becf1db5",
                     "companyId":140,
                     "countryId":6,         
                     "employeeTypeId":"0397930e-fb1a-48c9-a4b3-cf4cd78a53e9",
                     "salariedCount":3,
                     "hourlyCount":0
                    },
               
                    {
                        "id":"08d97115-3611-4641-8643-e6c67e713720",
                        "companyId":140,
                        "countryId":6,
                        "employeeTypeId":"118e2140-643a-4827-abc5-5af911891c93",
                        "salariedCount":4,
                        "hourlyCount":1
                    },
                    {
                        "id":"08d97115-3611-4650-8c97-75c2c5b6bd43",
                        "companyId":140,
                        "countryId":6,
                        "employeeTypeId":"1841c098-d8f3-46b3-b779-f2af14bf6312",
                        "salariedCount":3,
                        "hourlyCount":0
                    },
                    {
                        "id":"08d97115-3611-465c-8993-9d3003adf253",
                        "companyId":140,
                        "countryId":6,
                        "employeeTypeId":"ea8ec746-4ca7-4143-b37d-4c5795254e9e",
                        "salariedCount":4,
                        "hourlyCount":0
                    }
                ]
            },
        ]
  
    
}
})
jest.mock('axios');
const defaultprops = {
    pageNumber: 1,
    sortField: "updateddate",
    sortOrder: true,
    setPageNumber: jest.fn(),
    setSortField: jest.fn(),
    setSortOrder: jest.fn(),


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
    return mount(<Provider store={store}><Router history={historyMock}><FavoriteCounries {...defaultprops} /></Router></Provider>);
}


describe("Users List Component", () => {
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
    test('render FavoriteCounries List without error', () => {
        const indexDiv = findByTestAttr(wrapper, 'favorite-countries')
        expect(indexDiv.length).toBe(1)
    })
   

})



