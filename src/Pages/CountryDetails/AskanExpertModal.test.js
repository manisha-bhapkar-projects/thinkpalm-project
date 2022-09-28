import { mount, shallow } from 'enzyme';
import {  screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import AskanExpertModal from "./AskanExpertModal"
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';

import Modal from "react-bootstrap/Modal";
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore()


const setup = () => {

    return mount(<Provider store={store} ><AskanExpertModal isOpen={true} successFulSubmit={true} /></Provider>);
}
jest.mock('axios');
describe(" Default Ask an Expert Modal Popup", () => {
    let wrapper;
    
    
    beforeEach(() => {
        wrapper = setup()
    })

    test("Render Ask an Expert Modal Popup without error", () => {
       
        expect(wrapper.find(Modal)).toHaveLength(1)
        expect(wrapper.find(Modal.Header)).toHaveLength(1)
        
    })
    
    test("handle react dropdown  onchange function ", () => {
        const country = findByTestAttr(wrapper, 'countryDrop');
        const industry = findByTestAttr(wrapper, 'industryDrop');
        expect(country.simulate('change').length).toBe(1)
        expect(industry.simulate('change').length).toBe(1)
        
    })
    test("handle radio input",()=>{
        const radioYes=findByTestAttr(wrapper,"radioYes")
        const radioNo=findByTestAttr(wrapper,"radioNo")
        expect(radioYes.simulate('change').length).toBe(1)
        expect(radioNo.simulate('change').length).toBe(1)
    })
    test("handle employee checkbox   ", () => {
        const expert1 = findByTestAttr(wrapper, 'employeeCheck');
        expect(expert1.simulate('change').length).toBe(1)
        const emp = findByTestAttr(wrapper,"emp")
        expect(emp.length).toBe(1)
    })
    test("handle fullTime addEmployee Count",()=>{
        const salariedAdd=findByTestAttr(wrapper,"salariedLocalAdd")
        const  salariedMinus=findByTestAttr(wrapper,"salariedLocalMinus")
        const hourlyAdd=findByTestAttr(wrapper,"hourlyLocalAdd")
        const  hourlyMinus=findByTestAttr(wrapper,"hourlyLocalMinus")
        const salariedAddExpat=findByTestAttr(wrapper,"salariedExpatAdd")
        const  salariedMinusExpat=findByTestAttr(wrapper,"salariedExpatMinus")
        const hourlyAddExpat=findByTestAttr(wrapper,"hourlyExpatAdd")
        const  hourlyMinusExpat=findByTestAttr(wrapper,"hourlyExpatMinus")
        expect(salariedAdd.simulate('click').length).toBe(1)
        expect(salariedMinus.simulate('click').length).toBe(1)
        expect(hourlyAdd.simulate('click').length).toBe(1)
        expect(hourlyMinus.simulate('click').length).toBe(1)
        expect(salariedAddExpat.simulate('click').length).toBe(1)
        expect(salariedMinusExpat.simulate('click').length).toBe(1)
        expect(hourlyAddExpat.simulate('click').length).toBe(1)
        expect(hourlyMinusExpat.simulate('click').length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-full-time-local"}']`).at(0).simulate("change").length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-full-time-local"}']`).at(1).simulate("change").length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-full-time-expat"}']`).at(0).simulate("change").length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-full-time-expat"}']`).at(1).simulate("change").length).toBe(1)
    })
    test("handle partTime addEmployee Count",()=>{
        const salariedAddPart=findByTestAttr(wrapper,"salariedLocalPartAdd")
        const  salariedMinusPart=findByTestAttr(wrapper,"salariedLocalPartMinus")
        const hourlyAddPart=findByTestAttr(wrapper,"hourlyLocalPartAdd")
        const  hourlyMinusPart=findByTestAttr(wrapper,"hourlyLocalPartMinus")
        const salariedAddExpatPart=findByTestAttr(wrapper,"salariedExpatPartAdd")
        const  salariedMinusExpatPart=findByTestAttr(wrapper,"salariedExpatPartMinus")
        const hourlyAddExpatPart=findByTestAttr(wrapper,"hourlyExpatPartAdd")
        const  hourlyMinusExpatPart=findByTestAttr(wrapper,"hourlyExpatPartMinus")
        expect(salariedAddPart.simulate('click').length).toBe(1)
        expect(salariedMinusPart.simulate('click').length).toBe(1)
        expect(salariedAddExpatPart.simulate('click').length).toBe(1)
        expect(salariedMinusExpatPart.simulate('click').length).toBe(1)
        expect(hourlyAddPart.simulate('click').length).toBe(1)
        expect(hourlyMinusPart.simulate('click').length).toBe(1)
        expect(hourlyAddExpatPart.simulate('click').length).toBe(1)
        expect(hourlyMinusExpatPart.simulate('click').length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-part-time-local"}']`).at(0).simulate("change").length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-part-time-local"}']`).at(1).simulate("change").length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-part-time-expat"}']`).at(0).simulate("change").length).toBe(1)
        expect(wrapper.find(`[name='${"permanent-part-time-expat"}']`).at(1).simulate("change").length).toBe(1)
    })
    test("handle temporary addEmployee Count",()=>{
        const  temporaryAdd=findByTestAttr(wrapper,"temporaryAdd")
        const temporaryMinus=findByTestAttr(wrapper,"temporaryMinus")
        expect(temporaryAdd.simulate('click').length).toBe(1)
        expect(temporaryMinus.simulate('click').length).toBe(1)
        expect(wrapper.find(`[name='${"temporary-or-interns"}']`).simulate("change").length).toBe(1)
         
    })
    test("handle consultant addEmployee Count",()=>{
        const consultantMinus=findByTestAttr(wrapper,"consultantMinus")
        const  consultantAdd=findByTestAttr(wrapper,"consultantAdd")
        expect(consultantAdd.simulate('click').length).toBe(1)
        expect(consultantMinus.simulate('click').length).toBe(1)
        expect(wrapper.find(`[name='${"consultants"}']`).simulate("change").length).toBe(1)
         
    })
    test("handle contractor addEmployee Count",()=>{
        const contractorMinus=findByTestAttr(wrapper,"contractorMinus")
        const  contractorAdd=findByTestAttr(wrapper,"contractorAdd")
        expect(contractorAdd.simulate('click').length).toBe(1)
        expect(contractorMinus.simulate('click').length).toBe(1) 
        expect(wrapper.find(`[name='${"contractors"}']`).simulate("change").length).toBe(1)
         
    })
   
})