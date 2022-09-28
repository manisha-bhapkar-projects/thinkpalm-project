import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';

import ChartBullet from '../ChartBullet';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { toNumber, round } from "lodash";
am4core.useTheme(am4themes_animated);
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})

jest.mock('axios');

const setup = (historyMock,props) => {
    return mount(<Provider store={store}><Router history={historyMock}><ChartBullet {...props} /></Router></Provider>);
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("Chart Component", () => {
    let wrapper;
    let wrapper1;
    let wrapper2;
    let wrapper3;
    let wrapper4;
    let wrapper5;
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    let props={
        chartData:{
            average: 582390766330.59,
            category: "Country GDP in USD\n(logarithmic)",
            isLogChart: "true",
            maxValue: 21433226000000,
            median: 34102913582.42,
            value: 21400000000000,
        },
        divId: 0
    }
    beforeEach(() => {
        wrapper = setup(historyMock, props);
      
        
    });
  
    test('render Chart without error', () => { 
        const ChartBullet = findByTestAttr(wrapper, 'ChartBullet')
        expect(ChartBullet.length).toBe(1) 
    })
    test('render Chart with div 1', () => { 
        wrapper1=setup(historyMock,{
            chartData:{
                average: 47414.06311,
                category: "GDP in USD\n(per person employed)",
                isKdollar: "true",
                isLogChart: "false",
                maxValue: 238946.37,
                median: 35542.37512,
                value: 127378.2301,
        },divId:1
        })
        const ChartBullet = findByTestAttr(wrapper1, 'ChartBullet')
        expect(ChartBullet.length).toBe(1) 
    })
    test('render Chart with div 2', () => { 
        wrapper1=setup(historyMock,{
            chartData:{
                    average: 8.174193096,
                    category: "Unemployment %",
                    isLogChart: "false",
                    isPercent: "true",
                    maxValue: 28.73999977,
                    median: 6.875868488,
                    value: 8.31000042,
                },
        divId:2
        })
        const ChartBullet = findByTestAttr(wrapper1, 'ChartBullet')
        expect(ChartBullet.length).toBe(1) 
    })
    test('render Chart with div 3', () => { 
        wrapper1=setup(historyMock,{
            chartData:{
                    average: 38813.83794,
                    category: "Productivity Industry\nEmployee in USD",
                    isKdollar: "true",
                    isLogChart: "false",
                    maxValue: 295289.84,
                    median: 16516.37219,
                    value: 107026.9073
            },
        divId:3
        })
        const ChartBullet = findByTestAttr(wrapper1, 'ChartBullet')
        expect(ChartBullet.length).toBe(1) 
    })
    test('render Chart with div 4', () => { 
        wrapper1=setup(historyMock,{
            chartData:
            {
                average: 27625.2475,
                category: "Productivity Services\nEmployee in USD",
                isKdollar: "true",
                isLogChart: "false",
                maxValue: 202577.89,
                median: 14361.38941,
                value: 108240.4266,
            },
        divId:4
        })
        const ChartBullet = findByTestAttr(wrapper1, 'ChartBullet')
        expect(ChartBullet.length).toBe(1) 
    })
    test('render Chart with div 5', () => { 
        wrapper1=setup(historyMock,{
            chartData:
                {
                    average: 17123.68247,
                    category: "Productivity Agriculture\nEmployee in USD",
                    isEmp: "true",
                    isKdollar: "true",
                    isLogChart: "false",
                    maxValue: 130928.19,
                    median: 14361.38941,
                    value: 84870.61677,
                },
                divId:5
        })
        const ChartBullet = findByTestAttr(wrapper1, 'ChartBullet')
        expect(ChartBullet.length).toBe(1) 
    })
})