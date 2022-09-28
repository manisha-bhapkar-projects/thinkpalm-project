import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../test/testUtils';
import UserProfile from '../UserProfile/index';
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store=mockStore({myAccountReducer: {
  
}})


const setup = () => {
    return mount(<Provider store={store}><UserProfile /></Provider>);
}
describe("UserProfile Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render UserProfile without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'userProfile-page')
        expect(indexDiv.length).toBe(1)
    })

})