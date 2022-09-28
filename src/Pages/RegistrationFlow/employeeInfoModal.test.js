import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import { getUserProfile, storeCountryData,getKeyClockToken_Data } from "../../utils/storage";
import EmployeeInfoModal from './employeeInfoModal';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})
const defaultprops = {
    employeesInfoList:{
        activationStatus: null,
            address: null,
            company:{
            availableLicenses: -2,
            companyName: "Newaccqa",
            id: 1428,
            industryId: 4,
            industryName: "Education",
            isPrimaryUserAdded: true,
            noOfLicenses: 4,
            },           
            createdAt: "2021-09-10T10:37:08.370041",
            createdBy: "00000000-0000-0000-0000-000000000000",
            firstName: "sad",
            id: "08ccd406-280d-49e8-90fc-27d5c2d2c84e",
            imageUrl: "17c1aa56-c30a-46bb-b08f-493c138aa737",
            isAccountOwner: true,
            isActive: true,
            isAdUser: false,
            isAdmin: false,
            isDeleted: false,
            isPrimaryUser: false,
            jobTitle: null,
            lastName: "dsa",
            preferredName: "test",
            roleName: "Allrole",
            subscription: null,
            updatedAt: "2021-10-21T13:34:42.08308",
            updatedBy: "0de738fb-8a6a-4962-90c8-8d1ae7eabbc6",
            userId: "f1f44b27-5f58-412d-a6a1-91be1bf986be",
            employeeTypes:[{
                companyId: 1428,
                countryId: 5,
                employeeTypeId: "0397930e-fb1a-48c9-a4b3-cf4cd78a53e9",
                id: "08d9818b-59d6-4271-86ce-de5c454e290c",
                salariedCount: 0,
                isCheck:false,
            },{
                companyId: 1428,
                countryId: 5,
                employeeTypeId: "118e2140-643a-4827-abc5-5af911891c93",
                hourlyCount: 9,
                id: "08d9818b-59d6-429e-84d5-91572ab063ef",
                salariedCount: 9
            },
            {
                companyId: 1428,
                countryId: 5,
                employeeTypeId: "118e2140-643a-4827-abc5-5af911891c93",
                id: "08d9818b-59d6-429e-84d5-91572ab063ef",
            }]
                },
                isOpen:true,
                onSaveUserInfo:jest.fn(),
                setEmployeeInfoDetails:jest.fn(),
                onCancelClickListener:jest.fn()
}

jest.mock('axios');

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><EmployeeInfoModal {...defaultprops} /></Router></Provider>);
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("employeeInformation Component", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    
    beforeEach(() => {
            wrapper = setup(historyMock, defaultprops);
        
    });
  
    test('render employeeInformation without error', () => {
        const employeeInfoMoal = findByTestAttr(wrapper, 'employeeInfoMoal')
        expect(employeeInfoMoal.length).toBe(3)
        const salariedLocalMinus = findByTestAttr(wrapper, 'salariedLocalMinus')
        expect(salariedLocalMinus.first().simulate('click').length).toBe(1)
        const salariedLocalAdd = findByTestAttr(wrapper, 'salariedLocalAdd')
        expect(salariedLocalAdd.first().simulate('click').length).toBe(1)
        const salaried = findByTestAttr(wrapper, 'salaried')
        expect(salaried.first().simulate('change',{target:{value:11}}).length).toBe(1)

        const hourlyLocalMinus = findByTestAttr(wrapper, 'hourlyLocalMinus')
        expect(hourlyLocalMinus.first().simulate('click').length).toBe(1)
        const hourlyLocalAdd = findByTestAttr(wrapper, 'hourlyLocalAdd')
        expect(hourlyLocalAdd.first().simulate('click').length).toBe(1)
        const hourly = findByTestAttr(wrapper, 'hourly')
        expect(hourly.first().simulate('change',{target:{value:11}}).length).toBe(1)


        const save = findByTestAttr(wrapper, 'save')
        expect(save.simulate('click').length).toBe(1)
        const countryCheck = findByTestAttr(wrapper, 'countryCheck')
        expect(countryCheck.first().simulate('change').length).toBe(1)
        const cancel = findByTestAttr(wrapper, 'cancel')
        expect(cancel.simulate('click').length).toBe(1)
    })
})