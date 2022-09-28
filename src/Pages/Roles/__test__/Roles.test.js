
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup } from '@testing-library/react';
import { Router} from "react-router-dom";
import React from 'react';
import Createroles from '../Createrole'
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import { mount } from 'enzyme';
import { findByTestAttr } from '../../../test/testUtils';


  jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

afterEach(cleanup);
jest.mock('../../../utils/axiosConfig', () => ({

    get: () => {

        return new Promise((reject, resolve) => resolve({ response: { status: true, data: "" } }));

    },
    post:()=>{
        return new Promise((reject, resolve) => resolve({ response: { status: true, data: {id:"888"} } }))
    }

}));
const middlewares = [thunk]

const mockStore = configureStore(middlewares);

const initState = {
    dispatch: jest.fn()
};
let store = mockStore(initState);
const setup = (store,historyMock) => {

    return mount(<Provider store={store}><Router history={historyMock}><Createroles {...defaultProps} /></Router></Provider>);
}
const defaultProps = {
        updateLastLoginAction : () => {},
        getFeatDataAction:  () => {},
        getUserGroupsAction:  () => {},
        postUserRoleAction: () => {},
}
describe("Roles Page Component", () => {
    let wrapper1;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}
    beforeEach(() => {
        wrapper1 = setup(store,historyMock)
    })

    it('Create Roles to be defined', async () => {
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}

        let wrapper = render(<Provider store={store}><Router history={historyMock}><Createroles  /></Router></Provider>);
        expect(wrapper).toBeDefined();
    })
   

    test('Create Button should be in the DOM', () => { 
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}
        let { getByText} = render(<Provider store={store}><Router history={historyMock}><Createroles  /></Router></Provider>);
        const node = getByText('Create');
        expect(node.tagName).toBe('BUTTON');
    })

    test('Cancel Button should be in the DOM', () => { 
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}

        let { getByText} = render(<Provider store={store}><Router history={historyMock}><Createroles  /></Router></Provider>);
        const node = getByText('Cancel');
        expect(node.tagName).toBe('BUTTON');
    })

    test('Form should have Role Name', () => { 
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}

        let { getByLabelText} = render(<Provider store={store}><Router history={historyMock}><Createroles  /></Router></Provider>);
        const rolename = getByLabelText('Role Name', 'input__usernam');
        expect(rolename).toBeTruthy();

    })

    test('Form should have Assign Groups', () => { 
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}

        let { getByLabelText} = render(<Provider store={store}><Router history={historyMock}><Createroles  /></Router></Provider>);
        const group = getByLabelText('Assign to User Group*','input__usergroup');
        expect(group).toBeTruthy();

    })

    test('Form should have Role Description', () => { 
        let { getByText} = render(<Provider store={store}><Router history={historyMock}><Createroles  /></Router></Provider>);
        const description = getByText('Role Description*');
        expect(description).toBeTruthy();

    })

    test('Role name input displaying exact value', () => { 
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}

        let {  getByLabelText} = render(<Provider store={store}><Router history={historyMock}><Createroles  /></Router></Provider>);
        const roleName = getByLabelText('Role Name', 'input__usernam'); 
        userEvent.type(roleName,"ADMIN")   
        expect(roleName.value).toBe('ADMIN');
    })
    test('createRole page handle usergroup', () => { 
       const userGroup=findByTestAttr(wrapper1,"userGroup")
       const createRole=findByTestAttr(wrapper1,"createRole")
       const roles=findByTestAttr(wrapper1,"roles")
       const arrow=findByTestAttr(wrapper1,"arrow")
       const create=findByTestAttr(wrapper1,"create")
       const cancel=findByTestAttr(wrapper1,"cancel")
       const textarea=findByTestAttr(wrapper1,"textarea")
       expect(userGroup.simulate('click').length).toBe(1)
       expect(roles.simulate('click').length).toBe(1)
       expect(create.simulate('click').length).toBe(1)
       expect(cancel.simulate('click').length).toBe(1)
       expect(arrow.simulate('click').length).toBe(1)
       expect(textarea.simulate('click').length).toBe(1)
       expect(createRole.length).toBe(1)
      

    })
   
});
