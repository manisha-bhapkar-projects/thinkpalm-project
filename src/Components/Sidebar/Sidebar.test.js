import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import Sidebar from './Sidebar';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router';
const mockStore = configureStore();
let store=mockStore({})
const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><Sidebar /></Router></Provider>);
}

describe("SideBar Component",()=>{
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn()};
    beforeEach(() => {
        wrapper = setup(historyMock);
    });

    test('Render SideBar Component  Without Error',()=>{
        const sideBar=findByTestAttr(wrapper,'sidebar')
        expect(sideBar.length).toBe(1)
    })

    test('Render Image Div',()=>{
        const Image=findByTestAttr(wrapper,'image')
        expect(Image.length).toBe(1)
    })

})