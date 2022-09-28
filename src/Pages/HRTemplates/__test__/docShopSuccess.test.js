import React from 'react';
import { shallow, mount } from 'enzyme';
import { findByTestAttr, checkProps } from "../../../test/testUtils"
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { act } from 'react-dom/test-utils';


import DocShopSuccess from '../docShopSuccess';

const mockStore = configureStore([thunk]);
const store = mockStore({});

jest.mock('axios');

const defaultProps = {
    notify: jest.fn()
}
const setup = (historyMock) => {
    return mount(
        <Provider store={store}>
            <Router history={historyMock}>
                <DocShopSuccess {...defaultProps} />
            </Router>
        </Provider>
    );
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("DocSuccessWrap Component", () => {
    let wrapper;
    const historyMock = {
        push: jest.fn(), location: {
            state: {
                expertHour: true,
                cardType: "visa"
            }
        }, listen: jest.fn(), createHref: jest.fn()
    };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test("render doc-shop-success-wrap without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'doc-shop-success-wrap')
        expect(mainDiv.length).toBe(1)
    })
})
describe("card type: mastercard render Component", () => {
    let wrapper;
    const historyMock = {
        push: jest.fn(), location: {
            state: {
                expertHour: true,
                cardType: "mastercard"
            }
        }, listen: jest.fn(), createHref: jest.fn()
    };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test("card type: mastercard render without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'doc-shop-success-wrap')
        expect(mainDiv.length).toBe(1)
    })
})
describe("card type: amex render Component", () => {
    let wrapper;
    const historyMock = {
        push: jest.fn(), location: {
            state: {
                expertHour: true,
                cardType: "amex",
                fromCards: true,
                refNo: "ABC",
                id: "122"
            }
        }, listen: jest.fn(), createHref: jest.fn()
    };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test("card type: amex render without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'doc-shop-success-wrap')
        expect(mainDiv.length).toBe(1)
    })
    test("simulate download-btn-click", () => {
        const downloadBtn = findByTestAttr(wrapper, "download-btn-click");
        expect(downloadBtn.simulate('click').length).toBe(1);
    })
    test("simulate home-navigate", () => {
        const downloadBtn = findByTestAttr(wrapper, "home-navigate");
        const { onClick } = downloadBtn.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/");
    })
    test("simulate purchase-expert-briefs", () => {
        const downloadBtn = findByTestAttr(wrapper, "purchase-expert-briefs");
        const { onClick } = downloadBtn.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/settings/purchases-expert-briefs");
    })
    test("simulate  client-view-estimate", () => {
        const downloadBtn = findByTestAttr(wrapper, "client-view-estimate");
        const { onClick } = downloadBtn.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/settings/purchases-expert-briefs/view-estimate/ABC/122");
    })



})

describe("failure errors ", () => {
    let wrapper;
    const historyMock = {
        push: jest.fn(), location: {
            state: {
                failure: true,
                expertHour: true,
                errors: ['error1']
            }
        }, listen: jest.fn(), createHref: jest.fn()
    };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test("failure errors render without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'doc-shop-success-wrap')
        expect(mainDiv.length).toBe(1)
    })
})
describe("failure errors1 ", () => {
    let wrapper;
    const historyMock = {
        push: jest.fn(), location: {
            state: {
                paidItems: [
                    {
                        "cartItemId": "f005cb82-3112-11ec-ac0f-c025a51c2077",
                        "addedBy": "2471dabb-c5bc-4ffa-b04c-8a75358e8905",
                        "addedRate": 350,
                        "docProduct": {
                            upload: {
                                id: 1
                            }
                        },
                        "product": null,
                        "productId": "b2720316-3107-11ec-ac0f-c025a51c2077",
                        "productType": "expert-hour",
                        "quantity": 1,
                        "addedAt": "2021-10-20T00:59:54",
                        "discountId": "00000000-0000-0000-0000-000000000000",
                        "discount": 0,
                        "total": 350,
                        "itemTax": 0
                    }
                ]
            }
        }, listen: jest.fn(), createHref: jest.fn()
    };
    beforeEach(() => {
        wrapper = setup(historyMock);
    });
    test("simulate doc-shop-navigate without error", () => {
        const downloadBtn = findByTestAttr(wrapper, "doc-shop-navigate");
        const { onClick } = downloadBtn.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/doc-shop");
    })
    test("simulate download-document without error", () => {
        const downloadBtn = findByTestAttr(wrapper, "download-document");
        expect(downloadBtn.simulate('click').length).toBe(1);
    })

})

