import { mount, shallow } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { findByTestAttr } from "../../../test/testUtils";
import Payment from "../docShopPayment";
import PaymentSummaryWrap from './../paymentSummaryWrap';
import thunk from "redux-thunk";
import React from "react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";

const mockStore = configureStore([thunk]);

const store = mockStore({
  HRTemplate: {
    state: [],
    deleteCartSuccess:false,
    savedCard: {
      key: "",
      value: {
        profile: {
          customerProfileId: "501763306",
          description: "sad dsa",
          email: "accountowner1@inboxbear.com",
          merchantCustomerId: null,
          paymentProfiles: [
            {
              billTo: {
                address: "USA",
                city: null,
                company: null,
                country: "Algeria",
                email: null,
                faxNumber: null,
                firstName: null,
                lastName: null,
                phoneNumber: null,
                state: null,
                zip: "90001",
              },
              customerPaymentProfileId: "503474531",
              customerProfileId: null,
              defaultPaymentProfile: false,
              driversLicense: null,
              payment: {
                item: {
                  cardArt: null,
                  cardNumber: "XXXX8888",
                  cardType: "Visa",
                  expirationDate: "XXXX",
                  isPaymentTokenSpecified: false,
                  issuerNumber: null,
                },
              },
            },
          ],
        },
      },
    },
  },
});
jest.mock("axios");
jest.mock("@react-keycloak/web", () => ({
  useKeycloak: () => {
    return {
      keycloak: false,
      initialize: false,
    };
  },
}));

const setup = (store, historyMock,props) => {
  return mount(
    <Provider store={store}>
      <Router history={historyMock}>
        <Payment /> 
      </Router>
    </Provider>
  );
};
const setup1 = (props) => {
    
    return shallow(
        <PaymentSummaryWrap {...props}/>
    );
}
describe("hrtemplate-page Component", () => {
  let wrapper;
  let wrapper1;
  const historyMock = {
    push: jest.fn(),
    location: {},
    listen: jest.fn(),
    createHref: jest.fn(),
  };
  let props={
    savedCardDetails: {
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
    deleteSavedCard: jest.fn(),
  }
  beforeEach(() => {
    wrapper = setup(store, historyMock,props);
    wrapper1=setup1(props)
  });

  test("render hrtemplate-page without error", () => {
    let mockFn = jest.fn();
  //  wrapper.find(PaymentSummaryWrap).props().deleteSavedCard();
   console.log(wrapper.instance())
   wrapper.find(PaymentSummaryWrap).props().deleteSavedCard()
  // expect(mockFn).toHaveBeenCalled();
    const documentList = findByTestAttr(wrapper, "payment-page");
    expect(documentList.length).toBe(1);
    
    
  });
});
