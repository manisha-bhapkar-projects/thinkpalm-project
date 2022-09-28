import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import VirwRoles from '../Viewroles'
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
import { waitFor } from '@testing-library/react';
import OpenModal from '../OpenModal';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})

jest.mock('../../../utils/axiosConfig', () => ({
    post: () => {
        return new Promise((reject, resolve) => reject({ data:""}));
    },
    get: () => {
        return new Promise((reject, resolve) => reject({ data:{data:[{
            createdAt: "2021-09-10T10:36:00.597501",
            createdBy: "191f906d-4774-4441-95fa-3b223d67ff82",
            description: "role all",
            featureIds: [1, 2, 5, 6, 7, 8, 9, 10, 13, 15, 14, 22, 23, 24, 25, 26, 27, 28, 29, 17, 18, 19, 16, 21, 20, 30, 31, 32, 33, 34, 35, 36, 37, 38, 3, 4, 42, 41, 12, 47, 11, 39, 40],
            id: "42ff1da6-8faf-4be8-a695-52f81a35321d",
            isActive: true,
            isDeleted: false,
            keyCloakRoleId: "18f81426-322c-452e-8fe9-62a91e479547",
            keyCloakRoleName: "allrole",
            pdfAccess: false,
            roleName: "Allrole",
            updatedAt: "2021-10-26T13:10:05.607339",
            updatedBy: "87e0320a-42f7-4a8b-b81a-cb7847a9265a",
            userGroupId: 1,
            userGroupName: "Client License",
            usersCount: 27
        }]}}));
    },
    
}));

const setup = (historyMock,props,paramMock) => {

    return  mount(<Provider store={store}><Router history={historyMock} id={paramMock}><VirwRoles {...props} /></Router></Provider>,{ attachTo: document.getElementById('table-container') });
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("EditRole Component", () => {
    let wrapper;
    let wrapper1
    let wrapper2
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    const paramMock={useParams:jest.fn().mockReturnValue({ id: '1234',country:"india"})}
    const defaultprops = {
        callChangeUserStatusAPIAction:jest.fn()
    }
    beforeEach(() => {
        
        
        wrapper = setup(historyMock, defaultprops,paramMock);
        wrapper1=setup(historyMock, defaultprops,paramMock);
        wrapper2=setup(historyMock, defaultprops,paramMock);
        
    });
  
    test('render EditRole Popup without error',async()=> {
        
        
     
       
        const editRole =  findByTestAttr(wrapper,'viewRole')
       
            expect(editRole.length).toBe(1)
            
            wrapper.find(OpenModal).props().onCancelClickListner()
            wrapper.find(OpenModal).props().deactivateUser()
        
        const editModal =  findByTestAttr(wrapper,'editModal')
       
        expect(editModal.simulate('click').length).toBe(1)
       
        const click =  findByTestAttr(wrapper1,'click')
       
        expect(click.simulate('click').length).toBe(1)
                 
        const roleClick = findByTestAttr(wrapper2,'roleClick')
       
        expect(roleClick.simulate('click').length).toBe(1)
            
            
        
    })
    
})