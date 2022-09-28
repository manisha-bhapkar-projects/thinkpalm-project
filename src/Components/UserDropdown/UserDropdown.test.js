import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import UserDropdown from './index';

jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
  }));
const setup = () => {
    return shallow(<UserDropdown />);
}

describe("UserDropdown Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });

    test('Render UserDropDown Component  Without Error',()=>{
        const userDropDown=findByTestAttr(wrapper,'userDropDown')
        expect(userDropDown.length).toBe(1)
        expect(userDropDown.simulate('select',{value:"logout"}).length).toBe(1)
    })
    test('handle item onclick   Without Error',()=>{
        const item=findByTestAttr(wrapper,'item')
        expect(item.simulate('click').length).toBe(1)
        const item2=findByTestAttr(wrapper,'item2')
        expect(item2.simulate('click').length).toBe(1)
    })


})