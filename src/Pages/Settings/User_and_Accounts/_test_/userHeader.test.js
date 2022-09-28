import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import UserHeader from '../header';
import thunk from 'redux-thunk'
import React from 'react';

import { permissionMapping } from '../../../../utils/utils';
import { Router } from 'react-router';
jest.mock('axios')
const mockStore = configureStore([thunk]);

jest.mock('../../../../utils/utils', () => ({
    
    permissionMapping:jest.fn(),
    getKeyClockToken_Data:jest.fn(),
    getUserProfile:jest.fn()
  })
 );

const setup = (props,store) => {
    return mount(<Provider store={store}><UserHeader {...props}/></Provider>);
}
describe("header user Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
    let props={
        userListAll:{data:[
            {id: 899, companyName: "---==--=-=-=-=-=-=-=[[]]'';;", companyCode: '989', industryId: 8, isPrimaryUserAdded: false},
             {id: 878, companyName: 'A a a a Prem', companyCode: 'Prem 123', industryId: 1, isPrimaryUserAdded: true,},
            {id: 879, companyName: 'a a a Test Prem 2', companyCode: '123', industryId: 1, isPrimaryUserAdded: true,},
        ]},
        userRoles:[{id: '0026f0fb-272a-4287-9b2b-9d3f9280a182', roleName: 'updatedRolexev', description: 'updated Description', isActive: true, isDeleted: false},
        {id: '0035537e-cb12-4b26-945f-fae132803bc6', roleName: 'updatedRoleIdI', description: 'updated Description', isActive: true, isDeleted: false},
        {id: '00a5fa5b-f1e3-4b3f-ac02-34fdda35ed06', roleName: 'QAHHc', description: 'QA Role from Automation', isActive: true, isDeleted: false},
     {id: '011278bc-109d-42db-a654-e91b855dc76c', roleName: 'QAhAl', description: 'QA Role from Automation', isActive: true, isDeleted: false},],
     history:{
         action: "PUSH",
    push:jest.fn(),
     length: 15,
     location: {pathname: '/settings/users', search: '', hash: '', state: undefined},
     },
     subscriptionList:[ {id: '0005a1ac-ccd1-468a-afb5-c896e33abd55', name: 'AutoSubscriptionnfB', description: '', price: 200, promotionPrice: 100},
     {id: '000f34fe-fd79-4613-adc0-84f25a41d3cc', name: 'AutoSubscriptionXnk', description: 'AutoSub Description', price: 200, promotionPrice: 100}],
     setIsFiltering:jest.fn(),
     accountsAPIRequest:jest.fn(),
     setSearchValue:jest.fn(),
     setUserTabs:jest.fn(),
     onTextChange:jest.fn(),
     searchValue:"hello"

    }
    let store=mockStore({superAdminUserReducer: {
        allAccountListLoading:true
    }})
    beforeEach(() => {
      
        wrapper = setup(props,store);
        permissionMapping.mockReturnValue(['view_user_listing_page'])
    });
    test('render header without error',()=>{
        const userHeader = findByTestAttr(wrapper,'userHeader')
        expect(userHeader.length).toBe(1)
        const click = findByTestAttr(wrapper,'click')
        expect(click.simulate('click').length).toBe(1)
        const user = findByTestAttr(wrapper,'user')
        expect(user.simulate('click').length).toBe(1)
        const search = findByTestAttr(wrapper,'search')
        expect(search.simulate('change',{target:{value:"hello"}}).length).toBe(1)
        const searchCancel = findByTestAttr(wrapper,'searchCancel')
        expect(searchCancel.simulate('click').length).toBe(1)
        const handle = findByTestAttr(wrapper,'handle')
        expect(handle.simulate('click').length).toBe(1)
       
    })
})
describe("header user  branch Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
    let props={
        userListAll:{data:[
            {id: 899, companyName: "---==--=-=-=-=-=-=-=[[]]'';;", companyCode: '989', industryId: 8, isPrimaryUserAdded: false},
             {id: 878, companyName: 'A a a a Prem', companyCode: 'Prem 123', industryId: 1, isPrimaryUserAdded: true,},
            {id: 879, companyName: 'a a a Test Prem 2', companyCode: '123', industryId: 1, isPrimaryUserAdded: true,},
        ]},
        userRoles:[{id: '0026f0fb-272a-4287-9b2b-9d3f9280a182', roleName: 'updatedRolexev', description: 'updated Description', isActive: true, isDeleted: false},
        {id: '0035537e-cb12-4b26-945f-fae132803bc6', roleName: 'updatedRoleIdI', description: 'updated Description', isActive: true, isDeleted: false},
        {id: '00a5fa5b-f1e3-4b3f-ac02-34fdda35ed06', roleName: 'QAHHc', description: 'QA Role from Automation', isActive: true, isDeleted: false},
     {id: '011278bc-109d-42db-a654-e91b855dc76c', roleName: 'QAhAl', description: 'QA Role from Automation', isActive: true, isDeleted: false},],
     history:{
         action: "PUSH",
    push:jest.fn(),
     length: 15,
     location: {pathname: '/settings/users', search: '', hash: '', state: undefined},
     },
     subscriptionList:[ {id: '0005a1ac-ccd1-468a-afb5-c896e33abd55', name: 'AutoSubscriptionnfB', description: '', price: 200, promotionPrice: 100},
     {id: '000f34fe-fd79-4613-adc0-84f25a41d3cc', name: 'AutoSubscriptionXnk', description: 'AutoSub Description', price: 200, promotionPrice: 100}],
     setIsFiltering:jest.fn(),
     accountsAPIRequest:jest.fn(),
     setSearchValue:jest.fn(),
     setUserTabs:jest.fn(),
     onTextChange:jest.fn(),
     searchValue:"hello"

    }
    let store=mockStore({superAdminUserReducer: {
        allAccountListLoading:false
    }})
    beforeEach(() => {
      
        wrapper = setup(props,store);
        permissionMapping.mockReturnValue([" create/edit_any_user","create/edit_accounts"])
    });
    test('render header without error',()=>{
        const userHeader = findByTestAttr(wrapper,'userHeader')
        expect(userHeader.length).toBe(1)
       
       
    })
})
describe("header account Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
    let props={
        accountList:{data:[
            {id: 899, companyName: "---==--=-=-=-=-=-=-=[[]]'';;", companyCode: '989', industryId: 8, isPrimaryUserAdded: false},
             {id: 878, companyName: 'A a a a Prem', companyCode: 'Prem 123', industryId: 1, isPrimaryUserAdded: true,},
            {id: 879, companyName: 'a a a Test Prem 2', companyCode: '123', industryId: 1, isPrimaryUserAdded: true,},
        ]},
        userRoles:[{id: '0026f0fb-272a-4287-9b2b-9d3f9280a182', roleName: 'updatedRolexev', description: 'updated Description', isActive: true, isDeleted: false},
        {id: '0035537e-cb12-4b26-945f-fae132803bc6', roleName: 'updatedRoleIdI', description: 'updated Description', isActive: true, isDeleted: false},
        {id: '00a5fa5b-f1e3-4b3f-ac02-34fdda35ed06', roleName: 'QAHHc', description: 'QA Role from Automation', isActive: true, isDeleted: false},
     {id: '011278bc-109d-42db-a654-e91b855dc76c', roleName: 'QAhAl', description: 'QA Role from Automation', isActive: true, isDeleted: false},],
     history:{
         action: "PUSH",
         push:jest.fn(),
     length: 15,
     location: {pathname: '/settings/users', search: '', hash: '', state: undefined},
     },
     subscriptionList:[ {id: '0005a1ac-ccd1-468a-afb5-c896e33abd55', name: 'AutoSubscriptionnfB', description: '', price: 200, promotionPrice: 100},
     {id: '000f34fe-fd79-4613-adc0-84f25a41d3cc', name: 'AutoSubscriptionXnk', description: 'AutoSub Description', price: 200, promotionPrice: 100}],
     setIsFiltering:jest.fn(),
     accountsAPIRequest:jest.fn(),
     setSearchValue:jest.fn(),
     setUserTabs:jest.fn(),
     onTextChange:jest.fn(),
     searchValue:"hello",
     userTabs:"Accounts"

    }
    let store=mockStore({superAdminUserReducer: {
        allAccountListLoading:false
    }})
    beforeEach(() => {
      
        wrapper = setup(props,store);
        permissionMapping.mockReturnValue(['view_user_listing_page'])
    });
    test('render header without error',()=>{
        const userHeader = findByTestAttr(wrapper,'userHeader')
        expect(userHeader.length).toBe(1)
        const handle = findByTestAttr(wrapper,'handle')
        expect(handle.simulate('click').length).toBe(1)
        
        
       
    })
})