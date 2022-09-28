import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';

import Expertimage from '../Expertimage';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})
const defaultprops = {
    countryId: "162",
    countryName: "USA",
    card_data:[{
        countryId: null,
        superTopicSnapshotContent: [],
        supertopicContent: "<p>An Expert&nbsp;</p>",
        supertopicContentId: "60ed63016d3a46315361a4b3",
        supertopicId: "60ed5eafc721af6b886254d3",
        supertopicName: "Sudheesh MS",
        topics:[{
            countryId: null,
            subTopics: [],
            topicContent: "b248e9f3-bb5d-4bc4-ac19-8645944b71ed",
            topicContentId: "60f6d750f5d7a108c2699ab9",
            topicId: "60f6d735aa6366120d5a51a2",
            topicName: "Expert Pic-Sudheesh MS",
            topicSnapshotContent: [],
        }]
    }]
}
jest.mock('axios');

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><Expertimage {...defaultprops} /></Router></Provider>);
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("Expertimage Component", () => {
    let wrapper;
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    
    beforeEach(() => {
        wrapper = setup(historyMock, defaultprops);
      
        
    });
  
    test('render Expertimage without error', () => {
      
     
        
        const Expertimage = findByTestAttr(wrapper, 'Expertimage')
        expect(Expertimage.length).toBe(1)
      
        
    })
})