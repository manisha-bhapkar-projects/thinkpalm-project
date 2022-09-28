import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../test/testUtils';
import CountrySpecific from '../CountrySpecifics/index'
import thunk from 'redux-thunk'
import React from 'react';

const mockStore = configureStore([thunk]);
let store=mockStore({country: {
    holidayList:[{year:2021,holidays:[{date: '2021-01-01T00:00:00Z', description: "New Year's Day"},
    {date: '2021-01-26T00:00:00Z', description: 'Australia Day'}
    ,{date: '2021-02-08T00:00:00Z', description: 'Royal Hobart Regatta (Tasmania)'}]},
{
    year:2022,holidays:[{date: '2021-01-01T00:00:00Z', description: "New Year's Day"},
    {date: '2021-01-26T00:00:00Z', description: 'Australia Day'},
    {date: '2021-02-08T00:00:00Z', description: 'Royal Hobart Regatta (Tasmania)'}] 
}]
}})
const setup = () => {
    return mount(<Provider store={store}><CountrySpecific /></Provider>);
}
describe("CountrySpecific Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render CountrySpecific without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'country-specific-page')
        expect(indexDiv.length).toBe(1)
    })
})