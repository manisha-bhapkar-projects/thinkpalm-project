import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import Logout from './index'
import thunk from 'redux-thunk'
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './../../keycloak';

const mockStore = configureStore([thunk]);
let store = mockStore({})


const fakeLocalStorage = (function () {
    let store = {};

    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        }
    };
})();



const setup = (historyMock) => {
    return mount(
        <ReactKeycloakProvider
            authClient={keycloak}
        >
            <Provider store={store}>
                <Router history={historyMock}>
                    <Logout />
                </Router>
            </Provider>
        </ReactKeycloakProvider>
    );
}
describe("index Component", () => {
    let wrapper;
    let useEffect;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

    beforeEach(() => {
        wrapper = setup(historyMock);

    });
    test('render index without error', () => {
        const indexDiv = findByTestAttr(wrapper, 'logoutdiv')
        expect(indexDiv.length).toBe(1)
    })
    test('simulate continue to login button Click without error', () => {
        const buttonClick = findByTestAttr(wrapper, 'buttonClick')
        expect(buttonClick.simulate('click').length).toBe(1)
    })


})
describe('storage', () => {
    let wrapper;
    let useEffect;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

    beforeEach(() => {
        wrapper = setup(historyMock);
        Object.defineProperty(window, 'localStorage', {
            value: fakeLocalStorage,
        });
    });
    test('render click without error', () => {
        window.localStorage.setItem('key-clock-token', "abc");
        expect(window.localStorage.getItem("key-clock-token")).toBe("abc")
        const buttonClick = findByTestAttr(wrapper, 'buttonClick')
        expect(buttonClick.simulate('click').length).toBe(1)


    })
})
