import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import HRTemplateFilterDropdown from './HRTemplateFilterDropdown'

const setup = (props) => {
   
    return shallow(<HRTemplateFilterDropdown {...props}/>);
}

describe("accountFilter Component",()=>{
    let wrapper;
    let defaultprops={
        userFilter:{},
       data:[],
       resetFilter:jest.fn(),
       handleClickSelect:jest.fn(),
       selectedType:[]
    }
    beforeEach(() => {
        wrapper = setup(defaultprops);
    });
    test('render accountFilter component without error',()=>{
        const hrtemp=findByTestAttr(wrapper,'hrtemp')
        expect(hrtemp.length).toBe(1)
        expect(hrtemp.simulate('click').length).toBe(1)
    })
})
describe("accountFilter Component with props",()=>{
    let wrapper;
    let defaultprops={
        userFilter:{},
       data:[{id:1,categoryName:"test"}],
       resetFilter:jest.fn(),
       handleClickSelect:jest.fn(),
       selectedType:[]
    }
    beforeEach(() => {
        wrapper = setup(defaultprops);
    });
    test('render accountFilter component without error with props',()=>{
        const hrtemp=findByTestAttr(wrapper,'hrtemp')
        expect(hrtemp.simulate('click').length).toBe(1)
        const hrCheck=findByTestAttr(wrapper,'hrCheck')
        expect(hrCheck.simulate('change').length).toBe(1)
    })
})