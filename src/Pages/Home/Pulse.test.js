import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import Pulse from './Pulse';


const defaultProps={
    activePulseTab:"gdp",
    setActivePulseTab:jest.fn(),
    pulseMapContent:{gdp:[{id: 'AE', value: 98187.90124},
                        {id: 'AF', value: 8246.351581},
                        {id: 'AL', value: 31009.39013}
                          ]},
    activePulseTabLoader:false,
    pulseBoxContent:{}
}
const setup = () => {
    return shallow(<Pulse {...defaultProps}/>);
}
describe("Pulse Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render pulse without error',()=>{
        const pulse=findByTestAttr(wrapper,'Pulse')
        expect(pulse.length).toBe(1)
    })

})
