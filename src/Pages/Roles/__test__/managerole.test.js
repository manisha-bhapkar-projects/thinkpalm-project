import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import Manageroles from '../Managerole'
import React from 'react';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';

const mockStore = configureStore([thunk]);

const setup = (store,historyMock) => {

    return mount(<Provider store={store}><Router history={historyMock}><Manageroles /></Router></Provider>);
}
jest.mock('../../../utils/axiosConfig', () => ({

    get: () => {

        return new Promise((reject, resolve) => resolve({ response: { status: true, data: "" } }));

    },
    post:()=>{
        return new Promise((reject, resolve) => resolve({ response: { status: true, data: {id:"888"} } }))
    }

}));
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("Default manageroles page", () => {
    let wrapper;
    let store = mockStore({
       
    })
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),}

    beforeEach(() => {
        wrapper = setup(store,historyMock)
    })

    test("Render manageroles page without error", () => {
        const manageroles = findByTestAttr(wrapper, 'manageroles');
        const roleClick = findByTestAttr(wrapper, 'roleClick');
        

        expect(manageroles.length).toBe(1)
        expect(roleClick.simulate('click').length).toBe(1)
    })
})
