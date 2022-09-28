import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Card from './Card'
import { CardLoader } from './Card'
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    country: {
        countryList: [],
        expertData: { 'Argentina': [{ id: '1' }, { id: '2' }] },
        expertLoading: { "Argentina": false },
        blogData: { 'Argentina': [{ id: '1' }, { id: '2' }] },
        blogLoading: { "Argentina": false },
        alertLoading: { 'Argentina': false },
        alertData: { Argentina: [{ id: '1', data: 'test' }, { id: '2', data: 'test' }] },
        loading: false
    }
})
const defaultprops = {
    blogCount: 2,
    country: { id: 0, country_Name: "Argentina" },
    name: 'Argentina',
    viewType: "card"
}
jest.mock('axios');
const setup = (historyMock, defaultprops) => {
    return mount(<Provider store={store}><Router history={historyMock}><Card {...defaultprops} /></Router></Provider>);
}
const setup1 = () => {
    return mount(<Provider store={store}><CardLoader {...defaultprops} /></Provider>);
}

describe("Card Component", () => {
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
    test('render Card without error', () => {
        const cardDiv = findByTestAttr(wrapper, 'card')
        expect(cardDiv.length).toBe(1)
    })
    test('render Alert without error', () => {
        const alertDiv = findByTestAttr(wrapper, 'alert')
        expect(alertDiv.length).toBe(1)
    })

    test('render toolTip without error', () => {
        expect(wrapper.find(OverlayTrigger)).toHaveLength(2)
    })
    
    test('simulate Card Click without error', () => {
        const cardClick = findByTestAttr(wrapper, 'cardclick')
        const { onClick } = cardClick.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual('/details/0');
    })
    test("simulate table view on click without error", () => {
        let wrapper1;
        wrapper1 = setup(historyMock, { ...defaultprops, viewType: "table" })
        const tableDiv = findByTestAttr(wrapper1, 'table')
        expect(tableDiv.length).toBe(1)
    })

})



describe("CardLoader Component", () => {
    let wrapper1
    beforeEach(() => {
        wrapper1 = setup1();
    });
    test('render CardLoader without error', () => {
        const cardLoader = findByTestAttr(wrapper1, 'loader')
        expect(cardLoader.length).toBe(1)
    })


})