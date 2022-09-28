import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../test/testUtils';
import OpenModal from './OpenModal';
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store=mockStore({favoriteCountriesReducer: {
  
}})
jest.mock('axios');

const setup = () => {
    return mount(<Provider store={store}><OpenModal /></Provider>);
}
describe("user-account-openModal-page Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render user-account-openModal-page without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'user-account-openModal-page')
        expect(indexDiv.length).toBe(1)
    })
})