import { mount, shallow } from 'enzyme';
import {  screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../../test/testUtils';
import FavouriteCountryEditModal from "../FavouriteCountryEditModal"
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';

import Modal from "react-bootstrap/Modal";
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore()


const setup = (props) => {

    return mount(<Provider store={store} ><FavouriteCountryEditModal {...props} /></Provider>);
}
jest.mock('axios');
describe("Default favedit Modal Popup", () => {
    let wrapper;
    let props={
        isOpen:true,
        onCancelClickListner:jest.fn(),
        rowData:{
            countryId: 1,
            countryName: "Afghanistan",
            createdAt: "2021-10-20T06:43:09",
            employeeTypes:[ 
            {employeeTypeName: 'Permanent(Full-time)Local', employeeTypeId: '0397930e-fb1a-48c9-a4b3-cf4cd78a53e9', salariedCount: 5, hourlyCount: 5},
            {employeeTypeName: 'Permanent(Full-time)Expat', employeeTypeId: '118e2140-643a-4827-abc5-5af911891c93', salariedCount: 5, hourlyCount: 5},
            {employeeTypeName: 'Permanent(Part-time)Local', employeeTypeId: '1841c098-d8f3-46b3-b779-f2af14bf6312', salariedCount: 5, hourlyCount: 5},
            {employeeTypeName: 'Permanent(Part-time)Expat', employeeTypeId: 'ea8ec746-4ca7-4143-b37d-4c5795254e9e', salariedCount: 5, hourlyCount: 5},
            {employeeTypeName: 'Temporary/Interns', employeeTypeId: 'f2e27fb3-0e23-44a7-91f4-91ee7c58a7b4', salariedCount: 0, hourlyCount: 5},
            {employeeTypeName: 'Consultants', employeeTypeId: 'f556d16a-cf04-44ba-bef0-de6d4ce89f23', salariedCount: 0, hourlyCount: 5},
            {employeeTypeName: 'Contractors', employeeTypeId: 'fea4f240-47c0-43fc-83d7-60ce3e277721', salariedCount: 0, hourlyCount: 4},
            ],
           
            flag_Upload_Id: "d17fd09e-b74c-4f58-b0c8-7d04d19282c2",
            header_Image_Id: "f0741f8f-eb58-47fa-941a-c309ba0d1251",
            id: "08d99394-e107-4e68-83f4-0893bdac8ebe",
            isNewlyAdded: false}
    }
    
    beforeEach(() => {
        wrapper = setup(props)
    })

    test("Render FavEdit Modal Popup without error", () => {
             const ExpertModal = findByTestAttr(wrapper, 'Expert-Modal');
             expect(ExpertModal.length).toBe(3)
             const check = findByTestAttr(wrapper, 'check');
             expect(check.first().simulate("click").length).toBe(1)
             check.first().simulate("click")
             const change = findByTestAttr(wrapper, 'change');
             expect(change.first().simulate('change',{target:{value:"123"}}).length).toBe(1)
                 const hourlyAdd=findByTestAttr(wrapper,"hourlyLocalAdd")
                 const  hourlyMinus=findByTestAttr(wrapper,"hourlyLocalMinus")
                expect(hourlyAdd.first().simulate('click').length).toBe(1)
                expect(hourlyMinus.first().simulate('click').length).toBe(1)
                const change2 = findByTestAttr(wrapper, 'change2');
                expect(change2.first().simulate('change',{target:{value:"123"}}).length).toBe(1)
                const salariedAdd=findByTestAttr(wrapper,"salariedLocalAdd")
                const  salariedMinus=findByTestAttr(wrapper,"salariedLocalMinus")
                 expect(salariedAdd.first().simulate('click').length).toBe(1)
                  expect(salariedMinus.first().simulate('click').length).toBe(1)
                  const  submit=findByTestAttr(wrapper,"submit")
                  expect(submit.simulate('click').length).toBe(1)
                  const  cancel=findByTestAttr(wrapper,"cancel")
                  expect(cancel.simulate('click').length).toBe(1)
    })
    
     test("handle react dropdown  onchange function ", () => {
        let wrapper1;
        let props1={
            isOpen:true,
            onCancelClickListner:jest.fn(),
            rowData:{
                countryId: 1,
                countryName: "Afghanistan",
                createdAt: "2021-10-20T06:43:09",
                employeeTypes:[ 
                {employeeTypeName: 'Permanent(Full-time)Local', employeeTypeId: '0397930e-fb1a-48c9-a4b3-cf4cd78a53e9', salariedCount: 5, hourlyCount: 5},
                {employeeTypeName: 'Permanent(Full-time)Expat', employeeTypeId: '118e2140-643a-4827-abc5-5af911891c93', salariedCount: 5, hourlyCount: 5},
                {employeeTypeName: 'Permanent(Part-time)Local', employeeTypeId: '1841c098-d8f3-46b3-b779-f2af14bf6312', salariedCount: 5, hourlyCount: 5},
                {employeeTypeName: 'Permanent(Part-time)Expat', employeeTypeId: 'ea8ec746-4ca7-4143-b37d-4c5795254e9e', salariedCount: 5, hourlyCount: 5},
                {employeeTypeName: 'Temporary/Interns', employeeTypeId: 'f2e27fb3-0e23-44a7-91f4-91ee7c58a7b4', salariedCount: 0, hourlyCount: 5},
                {employeeTypeName: 'Consultants', employeeTypeId: 'f556d16a-cf04-44ba-bef0-de6d4ce89f23', salariedCount: 0, hourlyCount: 5},
                {employeeTypeName: 'Contractors', employeeTypeId: 'fea4f240-47c0-43fc-83d7-60ce3e277721', salariedCount: 0, hourlyCount: 4},
                ],
               
                flag_Upload_Id: "d17fd09e-b74c-4f58-b0c8-7d04d19282c2",
                header_Image_Id: "f0741f8f-eb58-47fa-941a-c309ba0d1251",
                id: "08d99394-e107-4e68-83f4-0893bdac8ebe",
                isNewlyAdded: false}
        }
        wrapper1=setup(props)
         const ExpertModal = findByTestAttr(wrapper1, 'Expert-Modal');
     expect(ExpertModal.length).toBe(3)
        
     })
    // test("handle radio input",()=>{
    //     const radioYes=findByTestAttr(wrapper,"radioYes")
    //     const radioNo=findByTestAttr(wrapper,"radioNo")
    //     expect(radioYes.simulate('change').length).toBe(1)
    //     expect(radioNo.simulate('change').length).toBe(1)
    // })
    // test("handle employee checkbox   ", () => {
    //     const expert1 = findByTestAttr(wrapper, 'employeeCheck');
    //     expect(expert1.simulate('change').length).toBe(1)
    //     const emp = findByTestAttr(wrapper,"emp")
    //     expect(emp.length).toBe(1)
    // })
    // test("handle fullTime addEmployee Count",()=>{
    //     const salariedAdd=findByTestAttr(wrapper,"salariedLocalAdd")
    //     const  salariedMinus=findByTestAttr(wrapper,"salariedLocalMinus")
    //     const hourlyAdd=findByTestAttr(wrapper,"hourlyLocalAdd")
    //     const  hourlyMinus=findByTestAttr(wrapper,"hourlyLocalMinus")
    //     const salariedAddExpat=findByTestAttr(wrapper,"salariedExpatAdd")
    //     const  salariedMinusExpat=findByTestAttr(wrapper,"salariedExpatMinus")
    //     const hourlyAddExpat=findByTestAttr(wrapper,"hourlyExpatAdd")
    //     const  hourlyMinusExpat=findByTestAttr(wrapper,"hourlyExpatMinus")
    //     expect(salariedAdd.simulate('click').length).toBe(1)
    //     expect(salariedMinus.simulate('click').length).toBe(1)
    //     expect(hourlyAdd.simulate('click').length).toBe(1)
    //     expect(hourlyMinus.simulate('click').length).toBe(1)
    //     expect(salariedAddExpat.simulate('click').length).toBe(1)
    //     expect(salariedMinusExpat.simulate('click').length).toBe(1)
    //     expect(hourlyAddExpat.simulate('click').length).toBe(1)
    //     expect(hourlyMinusExpat.simulate('click').length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-full-time-local"}']`).at(0).simulate("change").length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-full-time-local"}']`).at(1).simulate("change").length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-full-time-expat"}']`).at(0).simulate("change").length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-full-time-expat"}']`).at(1).simulate("change").length).toBe(1)
    // })
    // test("handle partTime addEmployee Count",()=>{
    //     const salariedAddPart=findByTestAttr(wrapper,"salariedLocalPartAdd")
    //     const  salariedMinusPart=findByTestAttr(wrapper,"salariedLocalPartMinus")
    //     const hourlyAddPart=findByTestAttr(wrapper,"hourlyLocalPartAdd")
    //     const  hourlyMinusPart=findByTestAttr(wrapper,"hourlyLocalPartMinus")
    //     const salariedAddExpatPart=findByTestAttr(wrapper,"salariedExpatPartAdd")
    //     const  salariedMinusExpatPart=findByTestAttr(wrapper,"salariedExpatPartMinus")
    //     const hourlyAddExpatPart=findByTestAttr(wrapper,"hourlyExpatPartAdd")
    //     const  hourlyMinusExpatPart=findByTestAttr(wrapper,"hourlyExpatPartMinus")
    //     expect(salariedAddPart.simulate('click').length).toBe(1)
    //     expect(salariedMinusPart.simulate('click').length).toBe(1)
    //     expect(salariedAddExpatPart.simulate('click').length).toBe(1)
    //     expect(salariedMinusExpatPart.simulate('click').length).toBe(1)
    //     expect(hourlyAddPart.simulate('click').length).toBe(1)
    //     expect(hourlyMinusPart.simulate('click').length).toBe(1)
    //     expect(hourlyAddExpatPart.simulate('click').length).toBe(1)
    //     expect(hourlyMinusExpatPart.simulate('click').length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-part-time-local"}']`).at(0).simulate("change").length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-part-time-local"}']`).at(1).simulate("change").length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-part-time-expat"}']`).at(0).simulate("change").length).toBe(1)
    //     expect(wrapper.find(`[name='${"permanent-part-time-expat"}']`).at(1).simulate("change").length).toBe(1)
    // })
    // test("handle temporary addEmployee Count",()=>{
    //     const  temporaryAdd=findByTestAttr(wrapper,"temporaryAdd")
    //     const temporaryMinus=findByTestAttr(wrapper,"temporaryMinus")
    //     expect(temporaryAdd.simulate('click').length).toBe(1)
    //     expect(temporaryMinus.simulate('click').length).toBe(1)
    //     expect(wrapper.find(`[name='${"temporary-or-interns"}']`).simulate("change").length).toBe(1)
         
    // })
    // test("handle consultant addEmployee Count",()=>{
    //     const consultantMinus=findByTestAttr(wrapper,"consultantMinus")
    //     const  consultantAdd=findByTestAttr(wrapper,"consultantAdd")
    //     expect(consultantAdd.simulate('click').length).toBe(1)
    //     expect(consultantMinus.simulate('click').length).toBe(1)
    //     expect(wrapper.find(`[name='${"consultants"}']`).simulate("change").length).toBe(1)
         
    // })
    // test("handle contractor addEmployee Count",()=>{
    //     const contractorMinus=findByTestAttr(wrapper,"contractorMinus")
    //     const  contractorAdd=findByTestAttr(wrapper,"contractorAdd")
    //     expect(contractorAdd.simulate('click').length).toBe(1)
    //     expect(contractorMinus.simulate('click').length).toBe(1) 
    //     expect(wrapper.find(`[name='${"contractors"}']`).simulate("change").length).toBe(1)
         
    // })
   
})