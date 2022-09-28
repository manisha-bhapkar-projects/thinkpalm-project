import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import RolesTable from '../RolesTable'
import React from 'react';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

const mockStore = configureStore([thunk]);

const setup = (store,historyMock,props) => {

    return mount(<Provider store={store}><Router history={historyMock}><RolesTable {...props} /></Router></Provider>);
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("Default rolesTable page", () => {
    let wrapper;
    let store = mockStore({
       
    })
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}
    const propData={
        user_roles_data:[{roleName:"test",description:"testdata",userGroupName:"test",usersCount:"test",id:"12"}],
        data_duplicate:jest.fn()
    }
    beforeEach(() => {
        wrapper = setup(store,historyMock,propData)
    })

    test("Render rolesTable page without error", () => {
        const rolesTable = findByTestAttr(wrapper, 'rolesTable');
        const duplicate = findByTestAttr(wrapper, 'duplicate');

        expect(rolesTable.length).toBe(1)
        expect(duplicate.simulate('click').length).toBe(1)
        expect(duplicate.simulate('click').length).toBe(1)
        duplicate.simulate('click')
      
    })
    test('simulate view Click without error', () => {
        const cardClick = findByTestAttr(wrapper, 'view')
        const { onClick } = cardClick.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual('view-role/12');
    })
})
