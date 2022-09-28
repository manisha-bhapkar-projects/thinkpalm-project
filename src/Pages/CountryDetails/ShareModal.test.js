import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import ShareModal from "./ShareModal"
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
const mockStore = configureStore();
let store = mockStore({})
const setup = () => {

    return mount(<Provider store={store} ><ShareModal /></Provider>);
}

describe(" Default Share Modal Popup", () => {
    let wrapper;
    
    
    beforeEach(() => {
        wrapper = setup()
    })

    test("Render Share Modal Popup without error", () => {
        const share = findByTestAttr(wrapper, 'shareModal');
        expect(share.length).toBe(1)
    })
})