import { mount, shallow } from 'enzyme';
import { Router } from 'react-router';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import OpenModal from '../OpenModal'


const setup = (defaultProps,historyMock) => {
    return mount(<Router history={historyMock}><OpenModal {...defaultProps} /></Router>);
}

describe("Header Component",()=>{
    let wrapper;
    let defaultProps={
        isOpen:true,
        onCancelClickListner:jest.fn(),
        editFlag:true,
        userStatus:true,
        userName:"hello"
    }
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };

    beforeEach(() => {
        wrapper = setup(defaultProps,historyMock);
    });

    test('Render Header Component  Without Error',()=>{
        const roleModal=findByTestAttr(wrapper,'roleModal')
        expect(roleModal.length).toBe(3)
        const editClick=findByTestAttr(wrapper,'editClick')
        expect(editClick.first().simulate('click').length).toBe(1)
        let wrapper1=setup({...defaultProps,editFlag:false,deactivateUser:jest.fn(),userName:"hello",userStatus:false},historyMock)
        const deactivate=findByTestAttr(wrapper1,'deactivate')
        let wrapper2=setup({...defaultProps,editFlag:false,deactivateUser:jest.fn(),userName:"hello",userStatus:true},historyMock)
        expect(deactivate.first().simulate('click').length).toBe(1)
        const cancel=findByTestAttr(wrapper2,'cancel')
        expect(cancel.first().simulate('click').length).toBe(1)
        
    })

})