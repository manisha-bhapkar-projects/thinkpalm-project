import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import SupportButton from './index'

const setup = () => {
   
    return shallow(<SupportButton />);
}

describe("accountFilter Component",()=>{
    let wrapper;
    
    beforeEach(() => {
        wrapper = setup();
    });
    test('render accountFilter component without error',()=>{
        const supportButton=findByTestAttr(wrapper,'supportButton')
        expect(supportButton.length).toBe(0)
    })
})