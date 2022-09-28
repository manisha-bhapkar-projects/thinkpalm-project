import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import CustomModal from '../CustomModal';
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store=mockStore({HRTemplate: {
  
}})


const setup = (props) => {
    return mount(<Provider store={store}><CustomModal {...props} /></Provider>);
}
describe("OpenModal Component",()=>{
    let wrapper;
    let props={
        status:true
    }
    beforeEach(() => {
        wrapper = setup(props);
    });
    test('render OpenModal without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'openModal-page')
        expect(indexDiv.length).toBe(1)
    })
})