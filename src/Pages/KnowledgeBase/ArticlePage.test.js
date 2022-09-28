import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../test/testUtils';
import ArticlePage from './ArticlePage'
import thunk from 'redux-thunk'
import React from 'react';
import { Router } from 'react-router-dom'
import { render, cleanup, waitFor, screen } from '@testing-library/react';

const mockStore = configureStore([thunk]);
let store=mockStore({country: {
    articleContent:[{topics:[{alert: null,
        categoryId: 0,
        contentType: 1,
        contentTypeName: "Text",
        countryId: null,
        countryName: null,
        createdAt: "2021-09-10T15:48:03.181Z",
        createdBy: null,
        createdByName: "Geon",
        parentContentIds: ["60ed65a495ff856438097258"],
        publishedDate: "2021-09-10T15:48:03.181Z",
        regionId: 1,
        regionName: "Global",
        stateId: null,
        stateName: null,
        tags: [{tagid: "60ed84f715c8b666f2147ba2", name: "Author - Name"}],
        topicContent: "<p>People come to the HR profession for a variety of reasons and from a number of different backgrounds. From CEOs and board directors to generalists and students, every HR professional not only has walked a unique career path but also has a unique perspective on HR.</p>",
        topicContentId: "60ed65a495ff85643809725a",
        topicId: "60ed5a76ce7c231e1e2b6c97",
        topicName: "Dean Jones",
        updatedAt: "2021-09-10T15:48:03.181Z",
        updatedBy: null,
        updatedByName: null,
        subTopics:[
            {tags: [{tagid: "60ed6950fb4b545d47172787", name: "Author - Pic"}]},
            {tags: [{tagid: "60ed6976fe669633642d3902", name: "Author - LinkedIn"}]}
        ]
        },{alert: null,
            categoryId: 0,
            contentType: 1,
            contentTypeName: "Text",
            countryId: null,
            countryName: null,
            createdAt: "2021-09-10T15:48:03.181Z",
            createdBy: null,
            createdByName: "Geon",
            parentContentIds: ["60ed65a495ff856438097258"],
            publishedDate: "2021-09-10T15:48:03.181Z",
            regionId: 1,
            regionName: "Global",
            stateId: null,
            stateName: null,
            tags: [{tagid: "60ed84f715c8b666f2147ba2", name: "Cover-Image"}],
            topicContent: "<p>People come to the HR profession for a variety of reasons and from a number of different backgrounds. From CEOs and board directors to generalists and students, every HR professional not only has walked a unique career path but also has a unique perspective on HR.</p>",
            topicContentId: "60ed65a495ff85643809725a",
            topicId: "60ed5a76ce7c231e1e2b6c97",
            topicName: "Dean Jones",
            updatedAt: "2021-09-10T15:48:03.181Z",
            updatedBy: null,
            updatedByName: null,
            subTopics:[
                {tags: [{tagid: "60ed6950fb4b545d47172787", name: "Author - Pic"}]},
                {tags: [{tagid: "60ed6976fe669633642d3902", name: "Author - LinkedIn"}]}
            ]
            }]}]
}})
afterEach(cleanup);
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><ArticlePage /></Router></Provider>);
}
describe("article-page Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {state:{SuperTopicName:"khaleel"}}, listen: jest.fn(),useParams: jest.fn().mockReturnValue({ country:"india" }) };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test('render article-page without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'article-page')
        expect(indexDiv.length).toBe(1)
    })
    test('handle breadcrumb click',()=>{
        const bredcrumbClick = findByTestAttr(wrapper,'bredcrumbClick')
        expect(bredcrumbClick.simulate('click').length).toBe(1)
        
    })
})