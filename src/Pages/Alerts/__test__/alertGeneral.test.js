import React from 'react';
import { shallow, mount } from 'enzyme';
import { findByTestAttr, checkProps } from "../../../test/testUtils"
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom'
import { getGeneralAlerts } from "../../../Store/reducers/alertsReducer";

import AlertGeneralPage from '../AlertGeneralPage';
import { act } from 'react-dom/test-utils';

const defaultProps = {
    setLoadingAPI: false,
    currentPosition: 0,
}
const mockStore = configureStore([thunk]);
let store = mockStore({});

jest.mock('../../../Store/reducers/alertsReducer', () => ({
    getGeneralAlerts: jest.fn(),
})
);
const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props };
    return mount(
        <Provider store={store}>
            <AlertGeneralPage {...setupProps} />
        </Provider>

    );
}

describe("AlertGeneral Component", () => {
    let wrapper;
    beforeEach(() => {
        getGeneralAlerts.mockReturnValue({
            data: {
                data: [{
                    alertDescription: "description",
                    alertTitle: "alert title",
                    alertType: 1,
                    countryid: 4,
                    createdAt: "2021-09-21T12:37:58.243358",
                    createdBy: "383620d4-fd40-43c5-bdb0-97b43831ff63",
                    id: "5321e4d6-971f-4d19-991c-8ff98cc90178",
                    isread: false,
                    langaugeid: 1,
                    noofdays: 2,
                    regionid: 2,
                    severity: 1,
                    severityName: "Critical",
                    stateid: 3,
                    updatedAt: "2021-09-21T12:37:58.243358",
                    updatedBy: "383620d4-fd40-43c5-bdb0-97b43831ff63",
                    userid: "1221e4d6-971f-4d19-991c-8ff98cc90178"
                }],
                totalCount: 0
            }
        })

        wrapper = setup();
    });
    test("render alert-general-main-wrapper without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'alert-general-main-wrapper')
        expect(mainDiv.length).toBe(1)
    })
})
describe("AlertGeneral Component with empty alerts", () => {
    let wrapper;
    beforeEach(() => {
        getGeneralAlerts.mockReturnValue({
            data: {
                data: [],
                totalCount: 0
            }
        })

        wrapper = setup();
    });
    test("render alert-general-main-wrapper with empty alerts without error", () => {
        const mainDiv = findByTestAttr(wrapper, 'alert-general-main-wrapper')
        expect(mainDiv.length).toBe(1)
    })
})