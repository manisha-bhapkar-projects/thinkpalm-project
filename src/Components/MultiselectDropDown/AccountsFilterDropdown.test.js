import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import AccountFilterDropdown from './AccountsFilterDropdown'

const setup = (props) => {
   
    return shallow(<AccountFilterDropdown {...props}/>);
}

describe("accountFilter Component",()=>{
    let wrapper;
    let defaultprops={
        accountFilter:{},
        subscriptionList:[],
        setAccountFilter:jest.fn()
    }
    beforeEach(() => {
        wrapper = setup(defaultprops);
    });
    test('render accountFilter component without error',()=>{
        const accountFilter=findByTestAttr(wrapper,'accountFilter')
        expect(accountFilter.length).toBe(1)
    })
})
describe("accountFilter Component with Props",()=>{
    let wrapper;
    let defaultprops={
        accountFilter:{test1:"testdata","test2":"testdata1",showUsersStatusBy:[],subscriptions:[]},
        subscriptionList:[{id:1,name:"test"},{id:2,name:"test2"}],
        setAccountFilter:jest.fn()
    }
    beforeEach(() => {
        wrapper = setup(defaultprops);
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
        expect(checkbox.first().simulate('change',{"target":{"value":"hello"}}).length).toBe(1)
        const checkbox1=findByTestAttr(wrapper,'checkbox1')
        expect(checkbox1.first().simulate('change',{"target":{"value":"hello"}}).length).toBe(1)
    })
   
})