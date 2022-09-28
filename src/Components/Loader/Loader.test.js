import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import Loader from './index'

const setup = (props) => {
   
    return shallow(<Loader/>);
}

describe("Loader Component",()=>{
    let wrapper;
  
    beforeEach(() => {
        wrapper = setup();
    });
    test('render loader component without error',()=>{
        const loaderDiv=findByTestAttr(wrapper,'loader')
        expect(loaderDiv.length).toBe(1)
    })
})