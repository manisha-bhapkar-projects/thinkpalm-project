import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import AllCountryHeader from '../AllCountryHeader'
import { Router } from 'react-router';
const setup = (props,) => {
   
    return shallow(<AllCountryHeader {...props}/>);
}



describe("AllCountry Header Component",()=>{
    let wrapper;
    const defaultProps = {
        userData:[],

       };
    
    beforeEach(() => {
        wrapper = setup(defaultProps,);
    });
    test('render AllCountryHeader component without error',()=>{
        const headerText=findByTestAttr(wrapper,'headerText')
        expect(headerText.length).toBe(1)
    })
    test('handle compare onclick without error',()=>{
        const compareButton=findByTestAttr(wrapper,'compareButton')
        expect(compareButton.simulate('click').length).toBe(1)
        const popup=findByTestAttr(wrapper,'popup')
        expect(popup.simulate('hide').length).toBe(1)
        let wrapper1=setup({...defaultProps,hideTitle:true})
        const headerText=findByTestAttr(wrapper1,'headerText')
        expect(headerText.length).toBe(1)
    })
})