import { mount, shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import FilterDropdown from './FilterDropdown'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
jest.mock('axios');
let store=mockStore({})

const setup = (props) => {
   
    return mount(<Provider store={store}> <FilterDropdown {...props}/></Provider>);
}

describe("accountFilter Component",()=>{
    let wrapper;
    let defaultprops={
        userFilter:{},
        data:[],
        setUserFilter:jest.fn(),
        briefFlag: true,
        flag:true,
        setAssigneeFilter:jest.fn(),
        setStatusFilter:jest.fn(),
        setInitialValues:jest.fn(),
        FilterAPIRequest:jest.fn(),
        toggleId: 1,
        expertEmailList:[
            {
                'emailId': "gopal.nIKu@thinkpalm.com",
                'userId': "fce2febe-166c-4f53-9c3b-6ace6b2880ce",
                'userName': "Gopal Namasivayam",
            }
        ],
       initialValues: {
            StartDate: '',
            EndDate: '',
          }
    }
    beforeEach(() => {
        wrapper = setup(defaultprops);
    });
    test('render accountFilter component without error',()=>{
        const accountFilter=findByTestAttr(wrapper,'accountFilter')
        expect(accountFilter.length).toBe(1)
    });
    test('render briefFilter component without error',()=>{
        const accountFilter=findByTestAttr(wrapper,'accountFilter')
        accountFilter.simulate('click')
        const briefsFilter1 = findByTestAttr(wrapper, 'briefsFilter')
        expect(briefsFilter1.length).toBe(1)
        const assigneeFilter = findByTestAttr(wrapper, 'assigneeFilter')
        expect(assigneeFilter.length).toBe(1)
        const statusFilter = findByTestAttr(wrapper, 'statusFilter')
        expect(statusFilter.length).toBe(1)
        const BriefsResetFilter=findByTestAttr(wrapper,'BriefsResetFilter')
        expect(BriefsResetFilter.simulate('click').length).toBe(1)
        const dateInput=findByTestAttr(wrapper,'dateInput')
        expect(dateInput.simulate('click').length).toBe(1)

     

        // const statusCheckbox=findByTestAttr(wrapper,'statusCheckbox')
        // statusCheckbox.simulate('change') 
        // expect(statusCheckbox.simulate('click',{"target":{"value":"fce2febe-166c-4f53"}}).length).toBe(1)

        // const inputDate=findByTestAttr(wrapper,'inputDate')
        // expect(inputDate.simulate('change',{"target":{"value":"23-4-2001"}}).length).toBe(1)
        // accountFilter.simulate('click')
        
    });
    // test('render briefFilter component without error',()=>{
    //     const accountFilter=findByTestAttr(wrapper,'accountFilter')
    //     accountFilter.simulate('click')
    //     const statusFilter = findByTestAttr(wrapper, 'statusFilter')
    //     expect(statusFilter.simulate('click').length).toBe(1)
    //     statusFilter.simulate('click')
    //     const StatusDiv = findByTestAttr(wrapper, 'StatusDiv')
    //     expect(StatusDiv.length).toBe(1)
    // })
})
describe("accountFilter Component with Props",()=>{
    let wrapper;
    let defaultprops={
        userFilter:{test1:"testdata","test2":"testdata1",showUsersStatusBy:[],roles:[]},
        data:[{id:1,name:"test"}],
        setUserFilter:jest.fn(),
        briefFlag: false,
    }
    beforeEach(() => {
        wrapper = setup(defaultprops);
    });
    test('render rolesFilter component without error',()=>{
        const accountFilter=findByTestAttr(wrapper,'accountFilter')
        accountFilter.simulate('click')
        const rolesFilter = findByTestAttr(wrapper, 'rolesFilter')
        expect(rolesFilter.length).toBe(1)
        const rolesList = findByTestAttr(wrapper, 'rolesList')
        expect(rolesList.length).toBe(1)
        
    });
    test('render accountFilter component without error',()=>{
        const accountFilter=findByTestAttr(wrapper,'accountFilter')
        expect(accountFilter.simulate('click').length).toBe(1)
        const resetFilter=findByTestAttr(wrapper,'resetFilter')
        expect(resetFilter.simulate('click').length).toBe(1)
        accountFilter.simulate('click')
        const input=findByTestAttr(wrapper,'input')
        expect(input.simulate('change',{"target":{"value":"hello"}}).length).toBe(1)
        const checkbox=findByTestAttr(wrapper,'checkbox')
        checkbox.simulate('change')
        expect(checkbox.simulate('click',{"target":{"value":"hello"}}).length).toBe(1)
        const checkbox1=findByTestAttr(wrapper,'checkbox1')
        expect(checkbox1.first().simulate('change',{"target":{"value":"hello"}}).length).toBe(1)
        const checkbox2=findByTestAttr(wrapper,'checkbox2')
        expect(checkbox2.simulate('change',{"target":{"value":"hello"}}).length).toBe(1)
    });


})