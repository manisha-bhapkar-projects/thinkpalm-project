import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import { CardLoader, CountryCard } from "../CountryCard";
import { Router } from 'react-router';
const setup = (props) => {
   
    return shallow(<CountryCard {...props}/>);
}
const setup1 = () => {
   
    return shallow(<CardLoader/>);
}



describe("AllCountry Header Component",()=>{
    let wrapper;
    let wrapper1;
    const defaultProps = {
        item:{},
        onNavigateCountryDetailsPage:jest.fn()

       };
    
    beforeEach(() => {
        wrapper = setup(defaultProps,);
        wrapper1=setup1()
    });
    test('render AllCountryHeader component without error',()=>{
        const CardDiv=findByTestAttr(wrapper,'CardDiv')
        expect(CardDiv.length).toBe(1)
        expect(CardDiv.simulate('click').length).toBe(1)
        const Loader=findByTestAttr(wrapper1,'Loader')
        expect(Loader.length).toBe(1)
    
    })

})