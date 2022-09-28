import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom'
import { findByTestAttr, checkProps } from '../../test/testUtils';
import InsightsAndAnalysis from './InsightsAndAnalysis.jsx'
import userEvent from "@testing-library/user-event"
import React from 'react';
import thunk from 'redux-thunk';
import { Checkbox } from "primereact/checkbox";
import { act } from 'react-dom/test-utils';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from "../../keycloak";

const mockStore = configureStore([thunk]);

const setup = (store, historyMock) => {

    return mount(<ReactKeycloakProvider authClient={keycloak}><Provider store={store}><Router history={historyMock}><InsightsAndAnalysis /></Router></Provider></ReactKeycloakProvider>);
}

describe("Default Insight and Analysis page", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };
    let store = mockStore({
        country: {
            allArticles: { data: [] },

        }
    })
    beforeEach(() => {
        wrapper = setup(store, historyMock)
    })

    test("Render Insight and Analysis page without error", () => {
        const insight = findByTestAttr(wrapper, 'insight');
        expect(insight.length).toBe(1)
    })
})

describe("Insight and Analysis page", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn(),
 };
    let store;
    beforeEach(() => {
        store = mockStore({
            country: {
                allArticles: {
                    data: [{
                        id: 1, topics: [{
                            tags: [{
                                name: "Author - Name",
                                tagid: "60d319c756ff5339fb686522"
                            }]
                        , 
                            subTopics: [{
                                tags: [{
                                    name: "Author - Pic",
                                    tagid: "60d06e77aff95075f02b4f0b"
                                }]
                            }], subTopicContent: "picid1"
                        }]
                    }, {
                        id: 2, topic: [{
                            tags: [{
                                name: "Author - Name",
                                tagid: "60d319c756ff5339fb686522"
                            }]
                        , 
                            subTopics: [{
                                tags: [{
                                    name: "Author - Pic",
                                    tagid: "60d06e77aff95075f02b4f0"
                                }]
                            }], subTopicContent: "picid2"
                        }]
                    }]
                }
            }
        })
        wrapper = setup(store, historyMock)
    })

    test("Render Articles without error", () => {
        const article = findByTestAttr(wrapper, 'article');
        expect(article.length).toBe(2)
    })
    test("Render the function when click on tags without error", () => {
        const tagClick = findByTestAttr(wrapper, 'tagClick');
        expect(tagClick.first().simulate('click').length).toBe(1)
    })
    test("Render function when click on Recent without error", () => {
        const recentClick = findByTestAttr(wrapper, 'recentClick');
        expect(recentClick.simulate('click').length).toBe(1)
    })
    test("Render function when click on Popular without error", () => {
        const popularClick = findByTestAttr(wrapper, 'popularClick');
        expect(popularClick.simulate('click').length).toBe(1)
    })
    test("Render function when click on AllCountry without error", () => {
        const allCountryChange = findByTestAttr(wrapper, 'allCountryChange');
        expect(allCountryChange.simulate('click').length).toBe(1)
        expect(allCountryChange.simulate('click').length).toBe(1)
    })
    test("Render function when click on AllContent without error", () => {
        const allContentChange = findByTestAttr(wrapper, 'allContentChange');
        expect(allContentChange.simulate('click')).toEqual({})
        expect(allContentChange.simulate('click')).toEqual({})
    })
   
    test("Render function when click on textChange without error", () => {
        const textChange = findByTestAttr(wrapper, 'textChange');
        expect(textChange.simulate('change',{"target":{"value":"hello"}}).length).toBe(1)
        const searchValue = findByTestAttr(wrapper, 'searchValue');
        expect(searchValue.simulate('click').length).toBe(1)
        textChange.simulate('change',{"target":{"value":""}})

    })
    test("Render function when click on contentChange without error", () => {
        const allContentChange = findByTestAttr(wrapper, 'allContentChange');
        const contentChange = findByTestAttr(wrapper, 'contentChange');
        allContentChange.simulate('click')
        expect(contentChange.simulate('click')).toEqual({})
        expect(contentChange.simulate('click')).toEqual({})
    })
    test("Render function when click on regionChange without error", () => {
        const regionChange = findByTestAttr(wrapper, 'regionChange');
        expect(regionChange.simulate('click')).toEqual({})
        expect(regionChange.simulate('click')).toEqual({})
    })

})

describe("Readmore click action", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };
    let store;
    beforeEach(() => {
        store = mockStore({ country: { allArticles: { data: [{ id: 1, data: 'test', supertopicName: "test" }] } } })
        wrapper = setup(store, historyMock)
    })
    test('simulate Card Click without error', () => {
        const buttonClick = findByTestAttr(wrapper, 'buttonClick')
        const { onClick } = buttonClick.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual({ "pathname": "/article-page", "state": { "supertopicName": "test" } });
    })
    
})



