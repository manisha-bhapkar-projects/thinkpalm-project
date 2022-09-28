import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
 
import TextFieldComponent from "./TextFieldComponent"
const defaultProps={
    id:'req',
    label:'true',
    error:false,
    helperText:"testing",
    icon:true,
    helperTextClassName:"testClass"
}
const setup = (props={}) => {
    const setupProps = { ...defaultProps, ...props };
    return shallow(<TextFieldComponent {...setupProps} />);
}

describe("Text Component",()=>{
    let wrapper;
        beforeEach(() => {
            wrapper = setup();
        });
    test("render without error",()=>{
        const inputField=findByTestAttr(wrapper,'input-field')
        expect(inputField.length).toBe(1)
        console.log(inputField)
        const inputLabel=findByTestAttr(wrapper,'input-label')
        expect(inputLabel.length).toBe(1)
    })
    test("render no label when label prop is null",()=>{
        const wrapper1=setup({ label: "" })
        const inputLabel=findByTestAttr(wrapper1,'input-label')
        expect(inputLabel.length).toBe(0)
    })
    test("render no error when error prop is false",()=>{
        const wrapper1=setup({ error:true })
        const small=findByTestAttr(wrapper1,'small')
        expect(small.length).toBe(1)
        expect(small.hasClass('testClass errormsg')).toBeTruthy()
    })
    test("render null when icon is false",()=>{
        const wrapper1=setup({ icon:false })
        const iconDiv=findByTestAttr(wrapper1,'iconDiv')
        expect(iconDiv.length).toBe(0)  
    })
})
