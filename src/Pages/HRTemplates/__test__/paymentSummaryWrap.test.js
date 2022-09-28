import React from 'react';
import { shallow, mount } from 'enzyme';
import { findByTestAttr, checkProps } from "../../../test/testUtils"
import PaymentSummaryWrap from './../paymentSummaryWrap';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const defaultProps = {
    credit: false,
    handleCardDetails: jest.fn(),
    userData: {},
    nameError: "",
    cardError: "",
    handleChange: jest.fn(),
    expDateerror: "",
    cvvError: "",
    addressError: "",
    countryError: "",
    stateError: "",
    zipError: "",
    handleCardForFutureUse: jest.fn(),
    handleSave: jest.fn(),
    paymentLoading: false,
    savedCardPayment: jest.fn(),
    card: false,
    slicedCardNumber: "",
    orderReviewed: false,
    openCardDetailsBox: false,
    setOpenCardDetailsBox: jest.fn(),
    cardType: "",
    savedCardDetails: {},
    selectedcardInfo: false,
    deleteSavedCard: jest.fn(),
    countries: [],
    handleCountryCardDetails: jest.fn(),
    allStates: [],
    initializeCallErrors: jest.fn()
}
const mockStore = configureStore([thunk]);
let store = mockStore({});

const setup = (props = {}, historyMock) => {
    const setupProps = { ...defaultProps, ...props };
    return mount(
        <Provider store={store}><Router history={historyMock}><PaymentSummaryWrap {...setupProps} /></Router></Provider>

    );
}

describe("DocSummaryWrap Component", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };

    beforeEach(() => {
        wrapper = setup({}, historyMock);
    });
    test("render payment summary wrap without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'payment-summary-wrap')
        expect(mainDiv.length).toBe(1)
    })
})
describe("DocSummaryWrap Component with props", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };

    beforeEach(() => {
        wrapper = setup({ ...defaultProps, slicedCardNumber: "2222", orderReviewed: true, cardType: "Visa" }, historyMock);
    });
    test("render payment-card without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'payment-card')
        expect(mainDiv.length).toBe(1)
    })
    test("render payment-card with selected cardinfo  without error", () => {
        let wrapper1 = setup({ ...defaultProps, selectedcardInfo: true, orderReviewed: true }, historyMock);
        const mainDiv = findByTestAttr(wrapper1, 'payment-card')
        expect(mainDiv.length).toBe(1)
    })
    test("render saved-card without error", () => {
        let wrapper = setup({
            ...defaultProps, savedCardDetails: {
                value: {
                    profile: {
                        paymentProfiles: [
                            {
                                id: 1,
                                payment: {
                                    item: {
                                        cardType: "Visa"
                                    }
                                }

                            }
                        ]
                    }
                }
            }
        },
            historyMock);
        const mainDiv = findByTestAttr(wrapper, 'saved-card-payment-method')
        expect(mainDiv.length).toBe(1)
    })
    test("render saved-card with visa without error", () => {
        let wrapper = setup({
            ...defaultProps, savedCardDetails: {
                value: {
                    profile: {
                        paymentProfiles: [
                            {
                                id: 1,
                                payment: {
                                    item: {
                                        cardType: "visa",
                                        cardNumber: "333333333333333333333"
                                    }
                                }

                            }
                        ]
                    }
                }
            },
        },
            historyMock
        );
        const mainDiv = findByTestAttr(wrapper, 'saved-card-visa')
        expect(mainDiv.length).toBe(1)

    })
    test("handle deletecard btn click", () => {
        let wrapper = setup({
            ...defaultProps, savedCardDetails: {
                value: {
                    profile: {
                        paymentProfiles: [
                            {
                                id: 1,
                                payment: {
                                    item: {
                                        cardType: "visa",
                                        cardNumber: "333333333333333333333"
                                    }
                                }

                            }
                        ]
                    }
                }
            },
            savedCardPayment: jest.fn(),
            deleteSavedCard: jest.fn(),

        },
            historyMock
        );
        const btnDiv = findByTestAttr(wrapper, 'save-card-click')
        expect(btnDiv.simulate('click').length).toBe(1)
        const deleteBtn = findByTestAttr(wrapper, 'delete-btn-click')
        expect(deleteBtn.simulate('click').length).toBe(1)
    })
    test("handle delete", () => {
        let wrapper = setup({
            ...defaultProps, savedCardDetails: {
                value: {
                    profile: {
                        paymentProfiles: [
                            {
                                id: 1,
                                payment: {
                                    item: {
                                        cardType: "visa",
                                        cardNumber: "333333333333333333333"
                                    }
                                }

                            }
                        ]
                    }
                }
            },
            savedCardPayment: jest.fn(),
            deleteSavedCard: jest.fn(),

        },
            historyMock
        );
        const buttonClick = findByTestAttr(wrapper, 'back-to-shop-btn')
        const { onClick } = buttonClick.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/doc-shop");

    })
    test("handle add new payment wrapper without error", () => {
        let wrapper = setup({
            ...defaultProps, savedCardDetails: {
                value: {
                    profile: {
                        paymentProfiles: [
                            {
                                id: 1,
                                payment: {
                                    item: {
                                        cardType: "visa",
                                        cardNumber: "333333333333333333333"
                                    }
                                }

                            }
                        ]
                    }
                }
            },
        },
            historyMock
        );
        const addNewPaymentWrapper = findByTestAttr(wrapper, 'add-new-payment-wrapper')
        expect(addNewPaymentWrapper.length).toBe(1)
        const openBox = findByTestAttr(wrapper, 'add-new-payment-wrapper')
        expect(openBox.simulate('click').length).toBe(1)

    })

    test("render new-payment-container without error", () => {
        let wrapper = setup({
            ...defaultProps,
            openCardDetailsBox: true,
            countries: [{ "id": "1", "country_Name": "TEST" }],
            allStates: [{ "id": "1", "country_Name": "TEST" }]
        },
            historyMock
        );
        const mainDiv = findByTestAttr(wrapper, 'new-payment-wrapper')
        expect(mainDiv.length).toBe(1)
    })
    test("save without error", () => {
        let wrapper = setup({
            ...defaultProps,
            openCardDetailsBox: true,
            userData: {
                zipCode: "",
                country: "",
                state: ""
            }
        },
            historyMock
        );
        const mainDiv = findByTestAttr(wrapper, 'save')
        // expect(mainDiv.length).toBe(1)
        expect(mainDiv.simulate('click').length).toBe(1)

    })
})
