import React from 'react';
import { shallow, mount } from 'enzyme';
import { findByTestAttr, checkProps } from "../../../test/testUtils"
import { Provider } from 'react-redux';


import AddMoreHoursLeftWrapper from '../addMoreHoursLeftWrapper';


const setup = (props = {}) => {
    return shallow(
        <AddMoreHoursLeftWrapper {...props} />
    );
}

describe("addmoreHourWrapper Component", () => {
    let wrapper;
    let props = {
      orderPreview: {},
      numberFormat: jest.fn(),
      handleHours: jest.fn(),
      hourList: [],
      selectedHours: {},
      orderReviewed: false,
      requiredHours: 1.17,
      balanceHour: 8.83,
      selectedHourError: "please enter",
    };
    beforeEach(() => {
        wrapper = setup(props);
    });
    test("render DocSummaryWrap without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'addhour-summary')
        expect(mainDiv.length).toBe(1)
    })
})
describe("addmoreHourWrapper Component with props", () => {
    let wrapper;
    let wrapper1;
    let props={ 
    orderPreview:{
        cartID: "b9f6f807-3318-11ec-9c4f-2f357ccf9b98",
        cartStatus: "Active",
         createdAt: "2021-10-22T09:16:38",
         createdBy: "f1f44b27-5f58-412d-a6a1-91be1bf986be",
         items:[{
            addedAt: "2021-10-22T09:26:24",
            addedBy: "f1f44b27-5f58-412d-a6a1-91be1bf986be",
            addedRate: 5250,
            cartItemId: "172ccbb9-331a-11ec-9c4f-2f357ccf9b98",
            discount: 0,
            discountId: "00000000-0000-0000-0000-000000000000",
            docProduct: null,
            itemTax: 0,
            product:{
                amount: 5250,
                category: "expert-hour",
                createdAt: "2021-10-11T13:23:55",
                createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
                description: "15 Hours",
                displayOrder: 2,
                id: "58fc425a-2a60-11ec-9561-c025a51c2077",
                isActive: true,
                isDeleted: false,
                productName: "15 Hours",
                quantity: 15,
                unitRate: 350,
                updatedAt: "2021-10-11T13:23:55",
                updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
                visibility: true,
            },
            productId: "58fc425a-2a60-11ec-9561-c025a51c2077",
            productType: "expert-hour",
            quantity: 1,
            total: 5250,
         }],
         productPriceTotal: 5250,
        shippingCharges: 0,
        tempInvoiceNumber: "20211022-003",
        totalDiscount: 0,
        totalQuantity: 1,
        updatedAt: "2021-10-22T09:26:24",
        updatedBy: "f1f44b27-5f58-412d-a6a1-91be1bf986be",
        },
    numberFormat:jest.fn(),
    handleHours:jest.fn(),
    hourList:[{
            amount: 3500,
            category: "expert-hour",
            createdAt: "2021-10-11T13:23:55",
            createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
            description: "Top-up to 10 Hours",
            displayOrder: 1,
            id: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
            isActive: true,
            isDeleted: false,
            label: "Top-up to 10 Hours",
            productName: "Top-up to 10 Hours",
            quantity: 10,
            unitRate: 350,
            updatedAt: "2021-10-11T13:23:55",
            updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
            value: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
            visibility: true,
    },{
        amount: 5500,
        category: "expert-hour",
        createdAt: "2021-10-11T13:23:55",
        createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        description: "Top-up to 10 Hours",
        displayOrder: 2,
        id: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        isActive: true,
        isDeleted: false,
        label: "Top-up to 10 Hours",
        productName: "Top-up to 10 Hours",
        quantity: 15,
        unitRate: 350,
        updatedAt: "2021-10-11T13:23:55",
        updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        value: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        visibility: true,
}],
    selectedHours:{amount: 5500,
        category: "expert-hour",
        createdAt: "2021-10-11T13:23:55",
        createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        description: "Top-up to 10 Hours",
        displayOrder: 2,
        id: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        isActive: true,
        isDeleted: false,
        label: "Top-up to 10 Hours",
        productName: "Top-up to 10 Hours",
        quantity: 15,
        unitRate: 350,
        updatedAt: "2021-10-11T13:23:55",
        updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        value: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        visibility: true,},
    orderReviewed:true,
    requiredHours:1.17,
    balanceHour:8.83,
    selectedHourError:""}

    let props1={
         
    orderPreview:{
        cartID: "b9f6f807-3318-11ec-9c4f-2f357ccf9b98",
        cartStatus: "Active",
         createdAt: "2021-10-22T09:16:38",
         createdBy: "f1f44b27-5f58-412d-a6a1-91be1bf986be",
         grossTotal: 5250,
         items:[{
            addedAt: "2021-10-22T09:26:24",
            addedBy: "f1f44b27-5f58-412d-a6a1-91be1bf986be",
            addedRate: 5250,
            cartItemId: "172ccbb9-331a-11ec-9c4f-2f357ccf9b98",
            discount: 0,
            discountId: "00000000-0000-0000-0000-000000000000",
            docProduct: null,
            itemTax: 0,
            product:{
                amount: 5250,
                category: "expert-hour",
                createdAt: "2021-10-11T13:23:55",
                createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
                description: "15 Hours",
                displayOrder: 2,
                id: "58fc425a-2a60-11ec-9561-c025a51c2077",
                isActive: true,
                isDeleted: false,
                productName: "15 Hours",
                quantity: 15,
                unitRate: 350,
                updatedAt: "2021-10-11T13:23:55",
                updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
                visibility: true,
            },
            productId: "58fc425a-2a60-11ec-9561-c025a51c2077",
            productType: "expert-hour",
            quantity: 1,
            total: 5250,
         }],
         productPriceTotal: 5250,
        shippingCharges: 0,
        tax: 10,
        tempInvoiceNumber: "20211022-003",
        totalDiscount: 0,
        totalQuantity: 1,
        updatedAt: "2021-10-22T09:26:24",
        updatedBy: "f1f44b27-5f58-412d-a6a1-91be1bf986be",
        },
    numberFormat:jest.fn(),
    handleHours:jest.fn(),
    hourList:[{
            amount: 3500,
            category: "expert-hour",
            createdAt: "2021-10-11T13:23:55",
            createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
            description: "Top-up to 10 Hours",
            displayOrder: 1,
            id: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
            isActive: true,
            isDeleted: false,
            label: "Top-up to 10 Hours",
            productName: "Top-up to 10 Hours",
            quantity: 10,
            unitRate: 350,
            updatedAt: "2021-10-11T13:23:55",
            updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
            value: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
            visibility: true,
    },{
        amount: 5500,
        category: "expert-hour",
        createdAt: "2021-10-11T13:23:55",
        createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        description: "Top-up to 10 Hours",
        displayOrder: 2,
        id: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        isActive: true,
        isDeleted: false,
        label: "Top-up to 10 Hours",
        productName: "Top-up to 10 Hours",
        quantity: 15,
        unitRate: 350,
        updatedAt: "2021-10-11T13:23:55",
        updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        value: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        visibility: true,
}],
    selectedHours:{amount: 5500,
        category: "expert-hour",
        createdAt: "2021-10-11T13:23:55",
        createdBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        description: "Top-up to 10 Hours",
        displayOrder: 2,
        id: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        isActive: true,
        isDeleted: false,
        label: "Top-up to 10 Hours",
        productName: "Top-up to 10 Hours",
        quantity: 15,
        unitRate: 350,
        updatedAt: "2021-10-11T13:23:55",
        updatedBy: "51af09e9-2a68-11ec-9561-c025a51c2077",
        value: "f23fbfe7-2a5f-11ec-9561-c025a51c2077",
        visibility: true,},
    orderReviewed:true,
    requiredHours:1.17,
    balanceHour:8.83,
    selectedHourError:""}
    beforeEach(() => {
        wrapper = setup(props);
        wrapper1 =setup(props1)
    });
    test("render DocSummaryWrap without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'addhour-summary')
        expect(mainDiv.length).toBe(1)
        const mainDiv1 = findByTestAttr(wrapper1, 'addhour-summary')
        expect(mainDiv1.length).toBe(1)
        const dropdown = findByTestAttr(wrapper, 'dropdown')
        expect(dropdown.simulate('change').length).toBe(1)
    })
})
