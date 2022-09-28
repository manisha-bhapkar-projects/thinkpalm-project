import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import ImageLoader from './ImageLoader'


const setup = () => {
    return shallow(<ImageLoader src="test" />);
}

describe("SideBar Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });

    test('Render ImageLoader Component  Without Error',()=>{
        const imageLoader=findByTestAttr(wrapper,'imageLoader')
        expect(imageLoader.length).toBe(1)
    })


})


