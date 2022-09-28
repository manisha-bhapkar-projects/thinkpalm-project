import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';

import EmployeeLifeCycle from '../EmployeeLifeCycle';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})
const defaultprops = {
    attractId: "60ed6f3ef328be4c174c9fd3",
    attract:[{
        supertopicName: "Non Descrimination"
    },{supertopicName: "Hiring"}],
    developId: "60ed6e98a9c41823130d4582",
    develop:[{supertopicName: "Non Descrimination"},{supertopicName: "Hiring"},{supertopicName: "Applicable legal detials"}],
    offBoardId: "60ed6c77d7240479d85230e2",
    offBoard:[{supertopicName: "Non Descrimination"},{supertopicName: "Hiring"},{supertopicName: "Applicable legal detials"},{supertopicName: "Dismissal Template"}],
    onBoardId: "60ed774b3487d944f2776002",
    onBoard:[{supertopicName: "Non Descrimination"},{supertopicName: "Hiring"},{supertopicName: "Applicable legal detials"},{supertopicName: "Dismissal Template"},{supertopicName: "Employee Handbook template"}],
   onClickLifecycle:jest.fn()
}
jest.mock('axios');

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><EmployeeLifeCycle {...defaultprops} /></Router></Provider>);
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("EmployeeLifeCytcle Component", () => {
    let wrapper;
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    
    beforeEach(() => {
        wrapper = setup(historyMock, defaultprops);
      
        
    });
  
    test('render EmployeeLifeCytcle without error', () => {
      
     
        
        const employee = findByTestAttr(wrapper, 'employee')
        expect(employee.length).toBe(1)
        const attract = findByTestAttr(wrapper, 'attract')
        expect(attract.first().simulate('click').length).toBe(1)
        const offBoard = findByTestAttr(wrapper, 'offBoard')
        expect(offBoard.first().simulate('click').length).toBe(1)
        const develop = findByTestAttr(wrapper, 'develop')
        expect(develop.first().simulate('click').length).toBe(1)
        const onBoard = findByTestAttr(wrapper, 'onBoard')
        expect(onBoard.first().simulate('click').length).toBe(1)
        const handleSee = findByTestAttr(wrapper, 'handleSee')
        expect(handleSee.simulate('click').length).toBe(1)
        const attract1 = findByTestAttr(wrapper, 'attract1')
        expect(attract1.first().simulate('click').length).toBe(1)
        const offBoard1 = findByTestAttr(wrapper, 'offBoard1')
        expect(offBoard1.first().simulate('click').length).toBe(1)
        const develop1 = findByTestAttr(wrapper, 'develop1')
        expect(develop1.first().simulate('click').length).toBe(1)
        const onBoard1 = findByTestAttr(wrapper, 'onBoard1')
        expect(onBoard1.first().simulate('click').length).toBe(1)


        
    })
})