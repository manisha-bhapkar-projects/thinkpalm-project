import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import Layout from './Layout'

const setup = (props) => {
   
    return shallow(<Layout {...props}/>);
}

describe("Layout Component",()=>{
    let wrapper;
    let props={settings:{isUserRegistration:true,sidebarSettings: {
        active: "home"
    }},
  
}
    beforeEach(() => {
        wrapper = setup(props);
    });

    test('Render Layout Component  Without Error',()=>{
        const layout=findByTestAttr(wrapper,'layout')
        expect(layout.length).toBe(1)
    })
    test('Render userRegistartion component',()=>{
        expect(wrapper.find('UserRegistrationSidebar')).toHaveLength(1)
    })
    test('Render children Without Error',()=>{
        const childrenDiv=findByTestAttr(wrapper,'children')
        expect(childrenDiv.length).toBe(1)
    })
})

describe("render sidebar without error",()=>{
    let wrapper;
    const props={}
    
    beforeEach(() => {
        wrapper = setup(props);
    });

    test('Render SideBar component',()=>{
        expect(wrapper.find('Sidebar')).toHaveLength(1)
    })
    
})