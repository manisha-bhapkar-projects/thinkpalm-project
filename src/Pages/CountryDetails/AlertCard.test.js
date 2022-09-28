import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import AlertCard from './AlertCard'
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
const mockStore = configureStore();
let store = mockStore()



const setup = (props,historyMock) => {

    return mount(<Provider store={store} ><Router history={historyMock}><AlertCard {...props}/></Router></Provider>);
}

describe(" Default AlertCard ", () => {
    let wrapper;
    const defaultProps={
        card_data:[{id:1,
            isViewed:true,
            severityType:'Minor',
            alertDate:"2021-08-18T03:50:42.726Z",
            contentLevelId:"60ed5b7ed64b3817e27ad83e",
            alertId:"611c836dcad65321bf668cf2",
            alertTitle:"test"}],
        title:"Alerts",
        card_id:"alerts" ,
        notification_color:true,
         icon:"ph-bell",
         icon_name:"" ,
         id:"34567erty456dfg",
         count_i:"162",
         alertsDataLoading:false
    }
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
    beforeEach(() => {
        wrapper = setup(defaultProps,historyMock)
    })

    test("Render alertCard without an error", () => {
       
        const alertPage=findByTestAttr(wrapper,"alerts")
        expect(alertPage.length).toBe(1)
        const insightPage=findByTestAttr(wrapper,"alertPage")
        expect(insightPage.length).toBe(1)
        
    })
    test("alert Click",()=>{
        const mockCallBack = jest.fn();
        const alertClick=findByTestAttr(wrapper,"alertClick")
        const { onClick } = alertClick.props();
        act(() => {
            onClick();
        });
        expect(mockCallBack.mock.calls).toEqual([]);
    })
})
    describe(" Default InsightCard ", () => {
        let wrapper;
        const Props={
            card_data:{data:[{id:1,
                templateType:'Minor',
                publishedDate:"2021-08-18T03:50:42.726Z",
                supertopicName:"test"}]},
            title:"Insights & Analysis",
            card_id:"insights" ,
            notification_color:false,
             icon:"ph-file",
             icon_name:"document-outline",
             countryName:"Argentina" ,
             alertsDataLoading:true
        }
        const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
        beforeEach(() => {
            wrapper = setup(Props,historyMock)
        })
    
        test("Render alertCard without an error", () => {
           
            const insightPage=findByTestAttr(wrapper,"alertPage")
            expect(insightPage.length).toBe(1)
            
        })
        
        test("Render onClick", () => {
            const mockCallBack = jest.fn();
            const showmore=findByTestAttr(wrapper,"show-more")
             showmore.simulate('click');
            
             expect(showmore.length).toBe(1);
            
        })
    
    })
    