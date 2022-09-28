import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../test/testUtils';
import InYourCart from '../InYourCart'
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store=mockStore({HRTemplate: {
  
}})
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

const setup = () => {
    return mount(<Provider store={store}><InYourCart /></Provider>);
}
describe("InYourCart Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render InYourCart without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'your-cart')
        expect(indexDiv.length).toBe(1)
    })
})