import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import Header from "./Header"


const setup = () => {
    return shallow(<Header />);
}

describe("Header Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });

    test('Render Header Component  Without Error',()=>{
        const header=findByTestAttr(wrapper,'header')
        expect(header.length).toBe(1)
    })

})