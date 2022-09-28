import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import FrequentlyAsked from '../FrequentlyAsked';
import {
    BrowserRouter as Router
  } from "react-router-dom";
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
import { findByTestAttr } from '../../../test/testUtils';

jest.mock('axios');

afterEach(cleanup);
jest.mock('@react-keycloak/web', () => ({
  useKeycloak: () => {
      return {
          keycloak: false,
          initialize: false
      }
  },
}));
const mockStore = configureStore([thunk]);
let store = mockStore({
    knowledgeBase: {
        articleDetails: {},
        quickLinks: [],
        featureArticleList: [],
        tagList: ["Global", "Popular Content"],
        faqList: [{
            "templateName": "Knowledge Base - FAQ",
            "supertopicId": "60d56624b4af185d497e50d2",
            
            "supertopicName": "Overview",
            "supertopicContent": "<p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p><br></p><p><br></p>",
            "publishedDate": "2021-06-25T10:16:23.303Z",
            "tags": [],
            "topics": [
              {
               
                "topicContentId": "60d56d60035e9449b96049b5",
                "topicName": "How it works?",
                "topicContent": "<p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p>",
                "publishedDate": "2021-06-25T10:16:23.316Z",
                "createdBy": null,
                "tags": [],
                "subTopics": []
              }
            ]
          },{
            "templateName": "Knowledge Base - FAQ",
            "supertopicId": "60cb56589e9e885d2f08e158",
            "supertopicContentId": "60cb5801103b850d1d2d732f",
            "supertopicName": "How can we help you?",
            "supertopicContent": "<h2>How can we help you?&nbsp; Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</h2><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p>",
            "publishedDate": "2021-06-25T10:16:23.251Z",
            "createdBy": "60a4b6662d6a1a3420753312",
            "tags": [],
            "topics": [
              {
                "topicId": "60cb5681e4f36d272151f38a",
                "topicContentId": "60cb5801103b850d1d2d7331",
                "topicName": "Fix a problem",
                "topicContent": "<h2>&nbsp; &nbsp;Watch videosExpandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</h2><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p><p>Expandopedia is the ultimate business intelligence platform, designed to simplify your global expansion. We help businesses reach their global potential by using technology to give them a world of expansion expertise in just a few clicks.</p>",
                "publishedDate": "2021-06-25T10:16:23.265Z",
                "createdBy": "60a4b6662d6a1a3420753312",
                "tags": [],
                "subTopics": []
              }
            ]
          }],
        insightsList: [],
    },
    dispatch: jest.fn()
});

const defaultprops = {
    className: "",
    insight: true,
    testCase: true,
    searchTextValue: "Test",
    getFeaturedArticles: () => { },
    getAllFAQ: () => { },
    getSearchResult: () => { },
    updateSearchText: () => { },
    reducer: {
        countryId: 1,
        countryName: 'Test country',
    }
};
const setup = () => {
    return mount(<Router><Provider store={store}><FrequentlyAsked {...defaultprops} /></Provider></Router>);
}
const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

describe("FrequentlyAsked Page Component", () => {

    it('render FAQ page without error', async () => {
        const { rerender, getByTestId, asFragment } = render(<Router><Provider store={store}><FrequentlyAsked {...defaultprops} /></Provider></Router>);
        const listNode = await waitFor(() => getByTestId('faq-result-page'));
        expect(listNode.children).toHaveLength(2);
        rerender(<Router><Provider store={store}><FrequentlyAsked {...defaultprops} /></Provider></Router>);
        // expect(asFragment()).toMatchSnapshot();
    })

    test('simulate scroll to parent click without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Router><Provider store={store}><FrequentlyAsked {...defaultprops} /></Provider></Router>)
        const tagBtn = getByTestId('scroll-parent');
        userEvent.click(tagBtn);
        await act(() => promise);
    });

    test('simulate scroll to child click without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Router><Provider store={store}><FrequentlyAsked {...defaultprops} /></Provider></Router>)
        const tagBtn = getByTestId('scroll-child');
        userEvent.click(tagBtn);
        await act(() => promise);
    });

    test('simulate search bar onChange without error', async () => {
        let wrapper=setup()
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Router><Provider store={store}><FrequentlyAsked {...defaultprops} /></Provider></Router>)
        const searchBox = getByTestId('search-box');
        userEvent.type(searchBox, "test");
        await act(() => promise);
        const namesec = findByTestAttr(wrapper,"namesec")
         namesec.first().simulate('click',{value:"777777"})
         const namesec1 = findByTestAttr(wrapper,"namesec1")
         namesec1.first().simulate('click',{value:"777777"})
         const namesec2 = findByTestAttr(wrapper,"namesec2")
         namesec2.first().simulate('click',{value:"777777"})
         const namesec3 = findByTestAttr(wrapper,"namesec3")
         namesec3.first().simulate('click',{value:"777777"})
    });

});
