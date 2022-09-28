import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import PopularContentCarousel from './PopularContentCarousel';


const defaultProps={
    content:[{id:1,topic:[{id:1,superContent:"test"}]},{id:2,topic:[{id:1,superContent:"test"}]},{id:3,topic:[{id:1,superContent:"test"}]}]
}

const setup = () => {
    return shallow(<PopularContentCarousel {...defaultProps} />);
}

describe("Content Carousel Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('render Carousel  without error',()=>{
        const popularContent=findByTestAttr(wrapper,'popularContent')
        expect(popularContent.length).toBe(1)
    })
    test('render content without error',()=>{
        const content=findByTestAttr(wrapper,'slider')
        expect(content.length).toEqual(1)
    })


})