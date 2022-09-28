import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import HeaderText from './HeaderText';

const setup = (defaultProps) => {
    return shallow(<HeaderText {...defaultProps} />);
}
const defaultProps = {
    hideTitle: true

}

describe("TimeLine Component", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup(defaultProps);
    });
    test('render pulse without error', () => {
        const headerDiv = findByTestAttr(wrapper, 'headerText')
        expect(headerDiv.length).toBe(1)
    });
    test("hide header name", () => {
        const myCountryDiv = findByTestAttr(wrapper, 'my-country')
        expect(myCountryDiv.length).toBe(0)
    })
    test("show header name", () => {
        let wrapper1;
        const props = {
            hideTitle: false
        }
        wrapper1 = setup(props);
        const myCountryDiv = findByTestAttr(wrapper1, 'my-country')
        expect(myCountryDiv.length).toBe(1)
    })

})