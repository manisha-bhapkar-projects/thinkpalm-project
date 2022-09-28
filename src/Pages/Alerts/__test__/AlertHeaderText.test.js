import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from "../../../test/testUtils"
import { Router } from 'react-router';
import React from 'react';
import thunk from 'redux-thunk'
import { act } from 'react-dom/test-utils';
import AlertHeaderText from '../AlertHeaderText';
jest.mock('axios');
const middlewares = [thunk]
const mockStore = configureStore(middlewares);
let store = mockStore({
  purchaseExpertReducer: {
}
})

const defaultprops = {
  setUserData:{},
  getUserProfile: jest.fn(),
  alertsBanner: "demo.jpg",
  firstTitle:"",
  secondTitle:"",
  thirdTitle:"",
  fourthTitle:""
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
const setup = (historyMock, defaultprops) => {
    return mount(<Provider store={store}><Router history={historyMock}><AlertHeaderText {...defaultprops} /></Router></Provider>);
}


describe("Alert Header Component", () => {
    let wrapper;
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
    const mockUseEffect = () => {
        useEffect.mockImplementationOnce(f => f())
    };
    beforeEach(() => {
        useEffect = jest.spyOn(React, "useEffect")
        wrapper = setup(historyMock, defaultprops);
        mockUseEffect()
        mockUseEffect()
    });
    test('render alert header without error', async () => {
        const promise = Promise.resolve();
        const indexDiv = findByTestAttr(wrapper, 'alertHeader')
        expect(indexDiv.length).toBe(1)
        // await act(() => promise)
    });
    test('handle breadcrumb click', async()=>{
      const promise = Promise.resolve();
      const bredcrumbClick = findByTestAttr(wrapper,'bredcrumbClick')
      expect(bredcrumbClick.simulate('click').length).toBe(1)
      bredcrumbClick.simulate('click')
      await act(() => promise)
    });
 
})



