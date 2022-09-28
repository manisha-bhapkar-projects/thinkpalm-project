import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import UserRegistrationSidebar from './UserRegistrationSidebar';
import TimelineComponent from "../TimelineComponent/TimelineComponent";


const setup = () => {
    return shallow(<UserRegistrationSidebar isFlag />);
}

describe("UserSideBar Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });

    test('Render userSideBar Component  Without Error',()=>{
        const usersideBar=findByTestAttr(wrapper,'userreg-sidebar')
        expect(usersideBar.find(TimelineComponent)).toBeDefined()
    })
})