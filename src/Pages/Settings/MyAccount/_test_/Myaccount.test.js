import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../../test/testFavouritecountries';
import SearchHeaderText from "../../../../Components/SearchHeaderText/SearchHeaderText";
import TextFieldComponent from "../../../../Components/TextFieldComponent/TextFieldComponent";
import MyAccount from '../index'
import thunk from 'redux-thunk'
import React from 'react';
jest.mock('axios');


const mockStore = configureStore([thunk]);
let props={
    notify:jest.fn()
}
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useLocation: () => ({
        pathname: ""
      })
   }));
   jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));
const setup = (store) => {
    return mount(<Provider store={store}><MyAccount {...props}/></Provider>);
}
describe("my-account Component",()=>{
    let wrapper;
    beforeEach(() => {
        let store=mockStore({myAccountReducer: {
            profilePicDeleted:200,
            profileUpdateError:{length:1},
            profileUpdate:200
        }})
        wrapper = setup(store);
    });
    test('render my-account without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'my-account')
        expect(indexDiv.length).toBe(1)
        const profileChange = findByTestAttr(wrapper,'profileChange')
        expect(profileChange.simulate('change').length).toBe(1)
        const profile = findByTestAttr(wrapper,'profile')
        expect(profile.simulate('click').length).toBe(1)
        wrapper.find(TextFieldComponent).first().props().onChange({target:{value:"i"}})
        wrapper.find(SearchHeaderText).props().onClick({target:{value:"i"}})
    })
})

describe("myaccount Component",()=>{
    let wrapper;
    let store1=mockStore({myAccountReducer: {
        userDetails: { email:"bhapkar@gmail.com",
           jobTitle:"developer" , cName:"Thinkpalm", industryName:"Finance", userProfile:{imageUrl:"demo.svg",
           fname: "Manisha", lname:"Bhapkar", prefferedName:"Manu",}},
           imageURL:{id:"dev.pmg"},
           profilePicError:{length:1}
 
}})
    beforeEach(() => {
        
        wrapper = setup(store1);
    });
    test('render my-account without error',()=>{
        const indexDiv = findByTestAttr(wrapper,'my-account')
        expect(indexDiv.length).toBe(1)
        const profile = findByTestAttr(wrapper,'profile')
        expect(profile.simulate('click').length).toBe(1)
    })

})




