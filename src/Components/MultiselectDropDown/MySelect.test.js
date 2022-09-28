import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import Myselect from './MySelect'


const setup = () => {
    return shallow(<Myselect/>);
}

describe("SideBar Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });

    test('Render Myselect Component  Without Error',()=>{
        const select=findByTestAttr(wrapper,'select')
        expect(select.length).toBe(1)
    })

})