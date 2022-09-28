import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import ConfiirmationModal from '../ConfirmationModal';
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router';

const mockStore = configureStore([thunk]);
let store=mockStore({purchaseExpertReducer: {
  
}})
const props={
    isOpen:true,
    onCancelClickListner:jest.fn(),
    param:{
        id:"562728",
        refNo:"#A100"
    }
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><ConfiirmationModal {...props}/></Router></Provider>);
}
describe("Modal Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test('render Modal without error',()=>{
        const confirmModal = findByTestAttr(wrapper,'confirmModal')
        const cancelRequest = findByTestAttr(wrapper,'cancelRequest')
       
        expect(confirmModal.length).toBe(3)
        expect(cancelRequest.first().simulate('click').length).toBe(1)
    })
   

})