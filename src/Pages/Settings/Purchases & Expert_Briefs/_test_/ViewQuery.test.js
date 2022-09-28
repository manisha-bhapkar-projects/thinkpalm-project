import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import ViewQuery from '../View_Query';
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router';

const mockStore = configureStore([thunk]);
const store=mockStore({purchaseExpertReducer: {
    queryDetails:[{ "queryDetails" :
    {
        "Id" : "25a69d34-f3aa-11eb-9864-c025a51c2077",
       
        "employeesDetails": [
            {
                "EmployeeType": "permanent-full-time-local",
                "Salaried": "18",
                "Hourly": "10"
            },
            {
                "EmployeeType": "permanent-full-time-expat",
                "Salaried": "56",
                "Hourly": "36"
            },
            {
                "EmployeeType": "permanent-part-time-local",
                "Salaried": "29",
                "Hourly": "19"
            },
            {
                "EmployeeType": "permanent-part-time-expat",
                "Salaried": "50",
                "Hourly": "40"
            },
            {
                "EmployeeType": "temporary-or-interns",
                "Hourly": "30"
            },
            {
                "EmployeeType": "consultants",
                "Hourly": "29"
            },
            {
                "EmployeeType": "contractors",
                "Hourly": "28"
            }
        ]
    },},{
        "Id" : "25a69d34-f3aa-11eb-9864-c025a51c2078",
       
        "employeesDetails": [
            {
                "EmployeeType": "permanent-full-time-local",
                "Salaried": "18",
                "Hourly": "10"
            },
            {
                "EmployeeType": "permanent-full-time-expat",
                "Salaried": "56",
                "Hourly": "36"
            },
            {
                "EmployeeType": "permanent-part-time-local",
                "Salaried": "29",
                "Hourly": "19"
            },
            {
                "EmployeeType": "permanent-part-time-expat",
                "Salaried": "50",
                "Hourly": "40"
            },
            {
                "EmployeeType": "temporary-or-interns",
                "Hourly": "30"
            },
            {
                "EmployeeType": "consultants",
                "Hourly": "29"
            },
            {
                "EmployeeType": "contractors",
                "Hourly": "28"
            }
        ]
    }],
    
}})
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
jest.mock('axios');
const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><ViewQuery/></Router></Provider>);
}
describe("View_Query Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test('render View_Query without error',()=>{
        const viewQuery = findByTestAttr(wrapper,'viewQuery')
        const employee = findByTestAttr(wrapper,'employee')
        expect(employee.length).toBe(0)
    })

})