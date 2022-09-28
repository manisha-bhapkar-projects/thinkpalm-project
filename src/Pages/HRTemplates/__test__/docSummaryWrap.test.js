import React from 'react';
import { shallow, mount } from 'enzyme';
import { findByTestAttr, checkProps } from "../../../test/testUtils"
import { Provider } from 'react-redux';


import DocSummaryWrap from '../docSummaryWrap';

const defaultProps = {
    orderPreview: { items: [] },
    numberFormat: jest.fn(),
    deleteCart: jest.fn(),
    handlePreviousPage: jest.fn(),
    context: ""

}
const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props };
    return shallow(
        <DocSummaryWrap {...setupProps} />
    );
}

describe("DocSummaryWrap Component", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test("render DocSummaryWrap without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'doc-summary')
        expect(mainDiv.length).toBe(1)
    })
})
describe("DocSummaryWrap Component with props", () => {
    let wrapper;
    let props = {
        orderPreview: {
            grossTotal: 200,
            tax: 0,
            items: [{
                addedRate: 200,
                cartItemId: "4490e7a3-2692-11ec-b345-f426dde2d481",
                product: {
                    document: {
                        document: {
                            title: "Dismissal 1 - Aaaa_premji Testupdate"
                        },
                        countryName: "Aaaa_premji Testupdate"
                    },

                    languageName: "English"
                }
            }]
        },
        numberFormat: jest.fn(),
        deleteCart: jest.fn(),
        handlePreviousPage: jest.fn(),
        context: "withoutTax"

    }
    beforeEach(() => {
        wrapper = setup(props);
    });
    test("render DocSummaryWrap without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'order')
        expect(mainDiv.length).toBe(1)
    })
    test("render docSummaryWrap with orderPreviewtax without error", () => {
        let wrapper1 = setup({
            ...props, context: "", orderPreview: {
                ...props.orderPreview, grossTotal: "", tax: 2
            }
        })
        const mainDiv = findByTestAttr(wrapper1, 'order')
        expect(mainDiv.length).toBe(1)
    })
    test("handle deletecard btn click", () => {
        const btnDiv = findByTestAttr(wrapper, 'carttbut')
        expect(btnDiv.simulate('click').length).toBe(1)
    })

})