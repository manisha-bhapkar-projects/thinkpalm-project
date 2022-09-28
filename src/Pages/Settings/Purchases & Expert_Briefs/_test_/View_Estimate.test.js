import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testUtils';
import ViewEstimate from '../View_Estimate';
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';

const mockStore = configureStore([thunk]);
let store=mockStore({purchaseExpertReducer: {
  
}})
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
jest.mock('../../../../utils/axiosConfig', () => ({

    get: () => {

        return new Promise((reject, resolve) => resolve({ response: { status: true, data: "" } }));

    },
    post:()=>{
        return new Promise((reject, resolve) => resolve({ response: { status: true, data: "" } }))
    }

}));
const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><ViewEstimate/></Router></Provider>);
}
describe("View_Query Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test('render View_Query without error',async()=>{
        const promise = Promise.resolve();
        const viewEstimate = findByTestAttr(wrapper,'viewEstimate')
        expect(viewEstimate.length).toBe(1)
        await act(() => promise)
    })
    test('handle approve button click',async()=>{
        const promise = Promise.resolve();
        const approveButton = findByTestAttr(wrapper,'approved')
        expect(approveButton.simulate('click').length).toBe(1)
        approveButton.simulate('click')
        const approvedDiv = findByTestAttr(wrapper,'approvedDiv')
        expect (approvedDiv.length).toBe(1)
        await act(() => promise)
    })
    test('handle cancel button click',async()=>{
        const promise = Promise.resolve();
        const cancelButton = findByTestAttr(wrapper,'cancel')
        const canceledDiv = findByTestAttr(wrapper,'canceledDiv')
        expect(cancelButton.simulate('click').length).toBe(1)
        cancelButton.simulate('click')
        await act(() => promise)
    })

})