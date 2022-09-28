import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../test/testUtils';
import Router from "react-router-dom";
import { Router as Router1 } from 'react-router';
import KnowledgeHome from '../knowledgeHome'
import thunk from 'redux-thunk'
import React from 'react';
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockStore = configureStore([thunk]);
const store=mockStore({ knowledgeBase: {

    featureArticleLoading:false,
    tagList:[], 
    featureArticleList:[{
        countryId: null,
        countryName: null,
        createdBy: null,
        publishedDate: "2021-10-26T07:39:25.014Z",
        regionId: 1,
        regionName: "Global",
        supertopicContent: "<p><strong>Josh</strong> emphasized that as another major&nbsp;<strong>HR trend</strong> for&nbsp;<strong>2021</strong>. “Everything that's happened in business to make the company more competitive has impacted the people agenda,” says&nbsp;<strong>Josh</strong>, predicting that this human-centric spirit will become far more mainstream for businesses going forward.</p><p>“One way to think about the next year or two is shifting from a business-centered view of your company, where it’s all about the business strategy and the business goals and the business metrics and the business results to the human side of that.”</p><p>The same applies for challenges and problems that arise in every business.</p><p>“Where our revenue is low, our profits are low, we have an error, we lost an account, we lost a client, we’re not making enough money, there’s always people problems underneath it,” Josh says.</p>",
        supertopicContentId: "60ed65a495ff85643809724a",
        supertopicId: "60ed50a99243311c35271c22",
        supertopicName: "Josh Bersin's Recruiting and HR Trends in 2021",
        tags:[
            {tagid: '60eec08e1b8189784d3efc84', name: 'Afghanistan'},
            {tagid: '60ed61eaa13335406b0ecfb2', name: 'USA'},
            {tagid: '60ed70ff02cc6350252c30f2', name: 'Featured Articles'},
            {tagid: '60ed71168d5fa13e9e177832', name: 'Popular Content'},
        ],
        topics:[
            {
                topicContent: "<p>Josh points out that about a decade ago, one of the most popular topics in HR was to focus on the internal part of work as human performance.</p>",
                topicContentId: "60ed65a495ff85643809724c",
                topicId: "60ed596d7eefb07a2756f2f3",
                topicName: "Joseph Alex",
                subTopics:[{
                    createdBy: null,
                    publishedDate: "2021-10-26T07:39:25.067Z",
                    subTopicContent: "d41e2381-4a11-43c7-a61e-566987b68aa4",
                    subTopicContentId: "60ed65a495ff85643809724f",
                    subTopicId: "60ed5953332f8152dc7a3602",
                    subTopicName: "Joseph Alex Pic",
                    tags:[
                        {
                            name: "Author - Pic",
                            tagid: "60ed6950fb4b545d47172787"
                        },
                        {tagid: '60ed6976fe669633642d3902', name: 'Author - LinkedIn'}
                    ]

                }],
                tags:[{
                    name: "Author - Name",
                    tagid: "60ed84f715c8b666f2147ba2"
                },{tagid: '60ed6976fe669633642d3902', name: 'Author - LinkedIn'}]
            }
        ]
    }], 
    featureArticleFailed:undefined
}})
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useLocation: () => ({
        pathname: ""
      })
   }));
   jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
const setup = (historyMock) => {
    return mount(<Provider store={store}><Router1 history={historyMock}  ><KnowledgeHome /></Router1></Provider>);
}
describe("UnFavoriteCountries Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
   
    beforeEach(() => {
       
        wrapper = setup(historyMock);
    });
    test('render UnFavoriteCountries without error',()=>{
      
        const indexDiv = findByTestAttr(wrapper,'knowledgeHome')
        expect(indexDiv.length).toBe(1)
        const FAQ = findByTestAttr(wrapper, 'FAQ')
        const { onClick } = FAQ.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/frequently-asked");
      
       
    })
    test('simulate Click without error', () => {
        const article = findByTestAttr(wrapper, 'article')
        const { onClick } = article.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual({"pathname": "/article-page/Josh Bersin's Recruiting and HR Trends in 2021", "state": {"comingFromKB": true, "supertopicName": "Josh Bersin's Recruiting and HR Trends in 2021"}});
        const support = findByTestAttr(wrapper,'support')
        expect(support.simulate('click').length).toBe(1)
        const advisory = findByTestAttr(wrapper,'advisory')
        expect(advisory.simulate('click').length).toBe(1)
        const feature = findByTestAttr(wrapper,'feature')
        expect(feature.simulate('click').length).toBe(1)
       
    })

})