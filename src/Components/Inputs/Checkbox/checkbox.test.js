import { mount, shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import Input from './index'

const defaultProps={

}
const setup = (props) => {
    const setupProps={...defaultProps,...props}
    return mount(<Input {...setupProps}/>);
}

describe("CheckBox Component with default props",()=>{
    let wrapper;
   let props={checked:false,type:"tertiary",children:undefined}
    beforeEach(() => {
        wrapper = setup(props);
    });

    test('Render CheckBox Component  Without Error',()=>{
        const label=findByTestAttr(wrapper,'label')
        expect(label.length).toBe(1)
    })
    test("handle onClick without error",()=>{
        expect(wrapper.find('label').simulate('click').length).toBe(1)
    })
    test("handle onClick input without error",()=>{
        expect(wrapper.find('input').simulate('change').length).toBe(1)
    })

})

describe("CheckBox Component with  props",()=>{
  

    test('Render CheckBox Component  Without Error',()=>{
        let wrapper;
        let props={children:[1,2,3],checked:true,type:"secondary"}
        
             wrapper = setup(props);
      
        const label=findByTestAttr(wrapper,'label')
        expect(label.length).toBe(1)
    })
    test('Render CheckBox Components  Without Error',()=>{
        let wrapper1;
        let props={children:[1,2,3],checked:-1,type:"tertiary",onChange:jest.fn()}
        
             wrapper1 = setup(props);
   
        const label1=findByTestAttr(wrapper1,'label')
        expect(label1.length).toBe(1)
        expect(wrapper1.find('input').simulate('change').length).toBe(1)
    })
    test('Render  Component  Without Error',()=>{
        let wrapper;
        let props={children:[],checked:undefined,type:""}
        
             wrapper = setup(props);
      
        const label2=findByTestAttr(wrapper,'label')
        expect(label2.length).toBe(1)
        expect(wrapper.find('input').simulate('change').length).toBe(1)
    })

})