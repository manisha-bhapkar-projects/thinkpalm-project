import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import OpenModal from '../OpenModal';
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store=mockStore({HRTemplate: {
  
}})


const setup = () => {
    return mount(<Provider store={store}><OpenModal /></Provider>);
}
describe("OpenModal Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render OpenModal without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'openModal-page')
        expect(indexDiv.length).toBe(1)
    })
})