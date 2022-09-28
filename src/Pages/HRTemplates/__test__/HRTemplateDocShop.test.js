import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr } from '../../../test/testUtils';
import HRTemplate from '../HRTemplateDocShop';
import thunk from 'redux-thunk'
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom'
import CustomePagination from './../../../Components/CustomePagination/CustomePagination';


const mockStore = configureStore([thunk]);
const store1 = mockStore({
    favoriteCountriesReducer: {
        countryList: [{
            country_Code: "ANC",
            country_Name: "test",
            created_At: "2021-08-06T11:14:35.162375",
            defaultRegion: { id: 54, regionName: 'Americas', regionCode: '' },
            flag_Upload_Id: "",
            header_Image_Id: "",
            id: 813,
            is_Active: true,
            is_Deleted: false,
            order_Id: 0,
            region_Id: "54",
            updated_At: "2021-08-31T06:42:59.442828",
            videoLink: "https://youtu.be/8Od_820WZ0E"
        }]
    }
})
const store = mockStore({
    HRTemplate: {
        documentList: {
            data: [{ id: "1572709d-9cff-47ae-b53a-680890c007bb" }]
        },
        languageList: [],
        categoryList: [],
        userDocumentList: [{
            addedAt: "2021-10-06T12:15:52",
            addedBy: "7c636f1f-503a-4fb8-8d19-3130bb9d36d8",
            addedRate: 200,
            cartItemId: "25d267c4-269f-11ec-b345-f426dde2d481",
            discount: 0,
            discountId: "00000000-0000-0000-0000-000000000000",
            productId: "60173d4f-5cbf-4de9-843e-77df27c6a6ff",
            purchaseStage: "AddedToCart",
            quantity: 1,
            total: 200

        }],
        purListLoading: false,
        docListLoading: false
    },

})
jest.mock('axios');
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

const setup = (store, historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><HRTemplate /></Router></Provider>);
}

describe("hrtemplate-page Component", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };

    beforeEach(() => {
        wrapper = setup(store, historyMock);
    });

    test('render hrtemplate-page without error', () => {
        const documentList = findByTestAttr(wrapper, 'hrtemplate-page')
        expect(documentList.length).toBe(1)
    })
    test('render hrtemplate-page language list without error', () => {
        const languageList = findByTestAttr(wrapper, 'languageList')
        expect(languageList.length).toBe(1)
    })
    test('render hrtemplate-page without categoryList error', () => {
        const categoryList = findByTestAttr(wrapper, 'categoryList')
        expect(categoryList.length).toBe(1)
    })
    test('render hrtemplate-page without banner error', () => {
        const banner = findByTestAttr(wrapper, 'banner')
        expect(banner.length).toBe(1)
    })
})

describe("simulate click on in cart btn", () => {
    let wrapper;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };

    beforeEach(() => {
        wrapper = setup(store, historyMock);
    });
    test('click incart without error', () => {
        const buttonClick = findByTestAttr(wrapper, 'banner-cart')
        const { onClick } = buttonClick.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/your-cart");

    })
    test("gotoReview without error", () => {
        const buttonClick = findByTestAttr(wrapper, 'review-page')
        const { onClick } = buttonClick.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/your-cart");
    })
    test("call clearFilter without error", () => {
        const clearFilter = findByTestAttr(wrapper, "clearFilter");
        expect(clearFilter.simulate('click').length).toBe(1);

    })

    test('click view-my-purchases withour error', () => {
        const buttonClick = findByTestAttr(wrapper, 'view-my-purchases')
        const { onClick } = buttonClick.props();
        act(() => {
            onClick();
        });
        expect(historyMock.push.mock.calls[0][0]).toEqual("/settings/purchases-expert-briefs");
    })
})

describe("render purchase list without error", () => {
    let wrapper1;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };

    beforeEach(() => {
        wrapper1 = setup(mockStore({
            HRTemplate: {
                purchaseListLoading: false,
                purListLoading: true,
                purchaseList: {
                    data: [{
                        "cartItemId": "21d3e9bf-25ca-11ec-a431-1db63b0566f0",
                        "addedBy": "f1f44b27-5f58-412d-a6a1-91be1bf986be",
                        "addedRate": 100,
                        "productId": "fdc888c5-e581-46b1-84c8-3200b22f8006",
                        "quantity": 1,
                        "addedAt": "2021-10-05T10:51:38",
                        "discountId": "00000000-0000-0000-0000-000000000000",
                        "discount": 0,
                        "total": 100,
                        "transactionDate": "2021-10-05T13:55:08",
                        "documentProduct": {
                            "id": "fdc888c5-e581-46b1-84c8-3200b22f8006",
                            "documentId": "ae1091b5-f6f4-462d-9b49-dbfeb36a5ba0",
                            "language": 314,
                            "languageName": "Tamil",
                            "uploadId": "19efb512-bcd6-49f8-bce2-0df942c66b67",
                            "latestVersion": "1808882c-2552-4b7e-95b2-5a49dd1a9e8e",
                            "latestDocument": {
                                "id": "1808882c-2552-4b7e-95b2-5a49dd1a9e8e",
                                "documentId": "ae1091b5-f6f4-462d-9b49-dbfeb36a5ba0",
                                "documentUploadsId": "fdc888c5-e581-46b1-84c8-3200b22f8006",
                                "version": "1.0",
                                "blobVersion": "2021-09-03T04:40:33.4985748Z",
                                "documentUrl": "/DOCUMENTS/1228d2bf-e395-4533-94ec-41cd4f05c801_file-sample_100kB (2).doc",
                                "numberOfPages": 2,
                                "expiresOn": "0001-01-01T00:00:00",
                                "isActive": true,
                                "isDeleted": false,
                                "createdAt": "2021-09-03T04:40:38.279487",
                                "updatedAt": "2021-09-03T04:40:38.279487",
                                "createdBy": "505a69c0-139d-413a-ae7c-854971ae22db",
                                "updatedBy": "505a69c0-139d-413a-ae7c-854971ae22db"
                            },
                            "isActive": true,
                            "isDeleted": false,
                            "createdAt": "2021-09-03T04:40:38.279487",
                            "updatedAt": "2021-09-03T04:40:38.279487",
                            "createdBy": "505a69c0-139d-413a-ae7c-854971ae22db",
                            "updatedBy": "505a69c0-139d-413a-ae7c-854971ae22db",
                            "upload": {
                                "id": "19efb512-bcd6-49f8-bce2-0df942c66b67",
                                "filePathUri": "/DOCUMENTS/1228d2bf-e395-4533-94ec-41cd4f05c801_file-sample_100kB (2).doc",
                                "originalFileName": "file-sample_100kB (2).doc",
                                "blobVersion": "2021-09-03T04:40:33.4985748Z",
                                "isActive": true,
                                "isDeleted": false,
                                "createdAt": "2021-09-03T04:40:33.92484",
                                "updatedAt": "2021-09-03T04:40:33.92484",
                                "createdBy": "da694dce-07c9-4ec9-8d64-402add749922",
                                "updatedBy": "cdbe6bc1-9f22-4506-bf0f-e5fa03a29c0d",
                                "previewFile": "DOCPREVIEW/1228d2bf-e395-4533-94ec-41cd4f05c801_file-sample_100kB (2).png"
                            },
                            "versions": [
                                {
                                    "id": "1808882c-2552-4b7e-95b2-5a49dd1a9e8e",
                                    "documentId": "ae1091b5-f6f4-462d-9b49-dbfeb36a5ba0",
                                    "documentUploadsId": "fdc888c5-e581-46b1-84c8-3200b22f8006",
                                    "version": "1.0",
                                    "blobVersion": "2021-09-03T04:40:33.4985748Z",
                                    "documentUrl": "/DOCUMENTS/1228d2bf-e395-4533-94ec-41cd4f05c801_file-sample_100kB (2).doc",
                                    "numberOfPages": 2,
                                    "expiresOn": "0001-01-01T00:00:00",
                                    "isActive": true,
                                    "isDeleted": false,
                                    "createdAt": "2021-09-03T04:40:38.279487",
                                    "updatedAt": "2021-09-03T04:40:38.279487",
                                    "createdBy": "505a69c0-139d-413a-ae7c-854971ae22db",
                                    "updatedBy": "505a69c0-139d-413a-ae7c-854971ae22db"
                                }
                            ],
                            "document": {
                                "id": "ae1091b5-f6f4-462d-9b49-dbfeb36a5ba0",
                                "title": "Canada Dismissal - Cameroon",
                                "document": {
                                    "id": "ae1091b5-f6f4-462d-9b49-dbfeb36a5ba0",
                                    "title": "Canada Dismissal - Cameroon",
                                    "description": null,
                                    "categoryId": "ed21d36d-1492-4a95-8c93-58a0e305391c",
                                    "subtitle": "",
                                    "previewImageUrl": null,
                                    "language": 0,
                                    "price": 100,
                                    "uploadId": "00000000-0000-0000-0000-000000000000",
                                    "latestVersion": "00000000-0000-0000-0000-000000000000",
                                    "isActive": true,
                                    "isBundle": false,
                                    "isDeleted": false,
                                    "createdAt": "2021-09-03T04:40:38.279487",
                                    "updatedAt": "2021-09-03T04:41:36.4887",
                                    "createdBy": "505a69c0-139d-413a-ae7c-854971ae22db",
                                    "updatedBy": "7fa9b6a0-e7d3-4cb7-9e24-e9320212beab"
                                },
                                "location": null,
                                "category": {
                                    "id": "ed21d36d-1492-4a95-8c93-58a0e305391c",
                                    "categoryName": "Canada Dismissal",
                                    "description": "",
                                    "parentCategoryId": null,
                                    "orderId": 0,
                                    "isActive": true,
                                    "isDeleted": false,
                                    "createdAt": "2021-08-31T06:36:03.758081",
                                    "updatedAt": "0001-01-01T00:00:00",
                                    "createdBy": "5bdffcef-4b48-4b5b-a28c-93dd905d20c6",
                                    "updatedBy": "00000000-0000-0000-0000-000000000000"
                                },
                                "upload": null,
                                "regionName": "",
                                "stateName": "",
                                "countryName": "Cameroon",
                                "countryId": 29
                            }
                        },
                        "totalCount": 20
                    }]
                },
                templateDetailsLoading: false,
                templateDetails: [
                    {
                        "id": "160a65ab-c0bf-4be7-a78f-d6eab0d1ccc2",
                        "title": "Canada Dismissal - Afghanistan",
                        "document": {
                            "id": "160a65ab-c0bf-4be7-a78f-d6eab0d1ccc2",
                            "title": "Canada Dismissal - Afghanistan",
                            "description": "dg",
                            "categoryId": "ed21d36d-1492-4a95-8c93-58a0e305391c",
                            "subtitle": "",
                            "previewImageUrl": null,
                            "employeeLifecycleStage": "Onboard",
                            "price": 62,
                            "isActive": true,
                            "isBundle": false,
                            "isDeleted": false,
                            "createdAt": "2021-09-13T06:37:45.91361",
                            "updatedAt": "2021-09-13T06:37:45.91361",
                            "createdBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                            "updatedBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                            "documentCount": 1
                        },
                        "location": {
                            "id": "eacc2db7-a869-454d-a950-66cafbf0f890",
                            "documentId": "160a65ab-c0bf-4be7-a78f-d6eab0d1ccc2",
                            "regionId": 0,
                            "countryId": 1,
                            "stateId": null,
                            "isActive": true,
                            "isDeleted": false,
                            "createdAt": "2021-09-13T06:37:45.91361",
                            "updatedAt": "2021-09-13T06:37:45.91361",
                            "createdBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                            "updatedBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e"
                        },
                        "documentBundle": [

                        ],
                        "documentUploads": [
                            {
                                "id": "ee06bb78-d255-4108-a19d-af502ce4d855",
                                "documentId": "160a65ab-c0bf-4be7-a78f-d6eab0d1ccc2",
                                "language": 378,
                                "languageName": "BQv",
                                "uploadId": "afc5300b-4d82-4097-b342-8b05e9ae4c29",
                                "latestVersion": "c9b7f57c-7f62-4417-865a-8a7be5d0a59d",
                                "latestDocument": {
                                    "id": "c9b7f57c-7f62-4417-865a-8a7be5d0a59d",
                                    "documentId": "160a65ab-c0bf-4be7-a78f-d6eab0d1ccc2",
                                    "documentUploadsId": "ee06bb78-d255-4108-a19d-af502ce4d855",
                                    "version": "1.0",
                                    "blobVersion": "2021-09-13T06:37:44.6978970Z",
                                    "documentUrl": "/DOCUMENTS/182e7920-42e6-42de-a95c-64dcce5feaf2_sample.docx",
                                    "numberOfPages": 2,
                                    "expiresOn": "0001-01-01T00:00:00",
                                    "isActive": true,
                                    "isDeleted": false,
                                    "createdAt": "2021-09-13T06:37:45.91361",
                                    "updatedAt": "2021-09-13T06:37:45.91361",
                                    "createdBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                                    "updatedBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e"
                                },
                                "isActive": true,
                                "isDeleted": false,
                                "createdAt": "2021-09-13T06:37:45.91361",
                                "updatedAt": "2021-09-13T06:37:45.91361",
                                "createdBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                                "updatedBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                                "upload": {
                                    "id": "afc5300b-4d82-4097-b342-8b05e9ae4c29",
                                    "filePathUri": "/DOCUMENTS/182e7920-42e6-42de-a95c-64dcce5feaf2_sample.docx",
                                    "originalFileName": "sample.docx",
                                    "blobVersion": "2021-09-13T06:37:44.6978970Z",
                                    "isActive": true,
                                    "isDeleted": false,
                                    "createdAt": "2021-09-13T06:37:45.197559",
                                    "updatedAt": "2021-09-13T06:37:45.19756",
                                    "createdBy": "72375dc3-9d11-43c0-b101-196b5be29ba7",
                                    "updatedBy": "d791f1cc-9a79-49ba-a08e-1225f00d5a8b",
                                    "previewFile": "DOCPREVIEW/182e7920-42e6-42de-a95c-64dcce5feaf2_sample.png"
                                },
                                "versions": [
                                    {
                                        "id": "c9b7f57c-7f62-4417-865a-8a7be5d0a59d",
                                        "documentId": "160a65ab-c0bf-4be7-a78f-d6eab0d1ccc2",
                                        "documentUploadsId": "ee06bb78-d255-4108-a19d-af502ce4d855",
                                        "version": "1.0",
                                        "blobVersion": "2021-09-13T06:37:44.6978970Z",
                                        "documentUrl": "/DOCUMENTS/182e7920-42e6-42de-a95c-64dcce5feaf2_sample.docx",
                                        "numberOfPages": 2,
                                        "expiresOn": "0001-01-01T00:00:00",
                                        "isActive": true,
                                        "isDeleted": false,
                                        "createdAt": "2021-09-13T06:37:45.91361",
                                        "updatedAt": "2021-09-13T06:37:45.91361",
                                        "createdBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                                        "updatedBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e"
                                    }
                                ]
                            }
                        ],
                        "versionHistory": [
                            {
                                "id": "c9b7f57c-7f62-4417-865a-8a7be5d0a59d",
                                "documentId": "160a65ab-c0bf-4be7-a78f-d6eab0d1ccc2",
                                "languageName": "BQv",
                                "documentUploadsId": "ee06bb78-d255-4108-a19d-af502ce4d855",
                                "version": "1.0",
                                "blobVersion": "2021-09-13T06:37:44.6978970Z",
                                "documentUrl": "/DOCUMENTS/182e7920-42e6-42de-a95c-64dcce5feaf2_sample.docx",
                                "numberOfPages": 2,
                                "expiresOn": "0001-01-01T00:00:00",
                                "isActive": true,
                                "isDeleted": false,
                                "createdAt": "2021-09-13T06:37:45.91361",
                                "updatedAt": "2021-09-13T06:37:45.91361",
                                "createdBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e",
                                "updatedBy": "3421deb4-7b87-4b11-aa38-f62acc597c5e"
                            }
                        ],
                        "category": {
                            "id": "ed21d36d-1492-4a95-8c93-58a0e305391c",
                            "categoryName": "Canada Dismissal",
                            "description": "",
                            "parentCategoryId": null,
                            "orderId": 0,
                            "isActive": true,
                            "isDeleted": false,
                            "createdAt": "2021-08-31T06:36:03.758081",
                            "updatedAt": "0001-01-01T00:00:00",
                            "createdBy": "5bdffcef-4b48-4b5b-a28c-93dd905d20c6",
                            "updatedBy": "00000000-0000-0000-0000-000000000000"
                        },
                        "regionName": "",
                        "stateName": "",
                        "countryName": "Afghanistan",
                        "countryId": 0,
                        "languageName": null,
                        "documentCount": 1
                    }
                ],
                docListLoading: true
            }
        }), historyMock);

    });
    test('render purchaseList without banner error', () => {
        const documentList = findByTestAttr(wrapper1, 'hrtemplate-page')
        expect(documentList.length).toBe(1)
    })
    test('render no purchaseList without banner error', () => {
        let wrapper1 = setup(mockStore({
            HRTemplate: {

                templateDetailsLoading: true,

            }
        }), historyMock);
        const documentList = findByTestAttr(wrapper1, 'hrtemplate-page')
        expect(documentList.length).toBe(1)
    })

})

const setup1 = (props) => {
    return mount(<CustomePagination  {...props} />);
}

describe('call pagination without error', () => {
    let wrapper1;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };
    let props = {
        onPageChangedCalled: jest.fn(),
        pageNumber: 2,
        totalLength: 20,
        limit: 10
    }
    beforeEach(() => {
        wrapper1 = setup1(props, historyMock);

    });
    test('call onPageChangedCalled without error', () => {
        const nextPage = findByTestAttr(wrapper1, 'nextPage')
        expect(nextPage.simulate('click').length).toBe(1);
    })
})

describe('show hrtemplateList without error', () => {
    let wrapper1;
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(), createHref: jest.fn() };

    beforeEach(() => {
        wrapper1 = setup(mockStore({

            HRTemplate: {
                documentList: {
                    data: [{
                        id: "1572709d-9cff-47ae-b53a-680890c007bb",
                        documentUploadId: "783da6ca-d01e-4f59-b03f-ab63e794afda",
                        upload: {
                            id: "6ae0ba55-aae8-41d8-b8ce-a4e63889c4cb"
                        }
                    }]
                },
                languageList: [],
                categoryList: {
                    data: [
                        {
                            categoryName: "Aaa Template",
                            createdAt: "2021-09-21T12:37:03.046904",
                            createdBy: "945a0017-3a81-41c5-bc39-19678d740c0f",
                            description: "",
                            id: "ae2ccb71-ceae-4b99-b901-de6d0f5ca139",
                            isActive: true,
                            isDeleted: false,
                            orderId: 0,
                            parentCategoryId: null,
                            updatedAt: "0001-01-01T00:00:00",
                            updatedBy: "00000000-0000-0000-0000-000000000000"
                        }
                    ]
                },

                userDocumentList: [{
                    addedAt: "2021-10-06T12:15:52",
                    addedBy: "7c636f1f-503a-4fb8-8d19-3130bb9d36d8",
                    addedRate: 200,
                    cartItemId: "25d267c4-269f-11ec-b345-f426dde2d481",
                    discount: 0,
                    discountId: "00000000-0000-0000-0000-000000000000",
                    productId: "783da6ca-d01e-4f59-b03f-ab63e794afda",
                    purchaseStage: "Purchased",
                    quantity: 1,
                    total: 200

                }],
                purListLoading: false,
                docListLoading: false,
                purchaseListLoading: true
            }
        }), historyMock);

    });
    test('render hrtemplateListwithout banner error', () => {
        const card = findByTestAttr(wrapper1, 'template-card')
        expect(card.length).toBe(1)
    })
    test("simulate click for download document", () => {
        const downloadDoc = findByTestAttr(wrapper1, "download-doc");
        expect(downloadDoc.simulate('click').length).toBe(1);
    })
    test("render wrapper for add to cart", () => {
        let wrapper2 = setup(mockStore({
            HRTemplate: {
                documentList: {
                    data: [{
                        id: "1572709d-9cff-47ae-b53a-680890c007bb",
                        documentUploadId: "783da6ca-d01e-4f59-b03f-ab63e794afda",
                        upload: {
                            id: "6ae0ba55-aae8-41d8-b8ce-a4e63889c4cb"
                        }
                    }]
                },
                languageList: [],
                userDocumentList: [{
                    addedAt: "2021-10-06T12:15:52",
                    addedBy: "7c636f1f-503a-4fb8-8d19-3130bb9d36d8",
                    addedRate: 200,
                    cartItemId: "25d267c4-269f-11ec-b345-f426dde2d481",
                    discount: 0,
                    discountId: "00000000-0000-0000-0000-000000000000",
                    productId: "783da6ca-d01e-4f59-b03f-ab63e794afda",
                    purchaseStage: "AddToCart",
                    quantity: 1,
                    total: 200

                }],
                purListLoading: false,
                docListLoading: false,
                purchaseListLoading: true,
                allPurchases: true,
                cartSuccess: 200,
                categoryList: {
                    data: [
                        {
                            categoryName: "Aaa Template",
                            createdAt: "2021-09-21T12:37:03.046904",
                            createdBy: "945a0017-3a81-41c5-bc39-19678d740c0f",
                            description: "",
                            id: "ae2ccb71-ceae-4b99-b901-de6d0f5ca139",
                            isActive: true,
                            isDeleted: false,
                            orderId: 0,
                            parentCategoryId: null,
                            updatedAt: "0001-01-01T00:00:00",
                            updatedBy: "00000000-0000-0000-0000-000000000000"
                        }
                    ]
                },

            },

        }), historyMock);
        const AddToCart = findByTestAttr(wrapper2, "add-to-cart");
        expect(AddToCart.length).toBe(1);
        const preview = findByTestAttr(wrapper2, "preview");
        expect(preview.simulate('click').length).toBe(1);
        const addCart = findByTestAttr(wrapper2, "add-cart");
        expect(addCart.simulate('click').length).toBe(1);
        const categoryCheckBox = findByTestAttr(wrapper2, "category-checkbox");
        expect(categoryCheckBox.simulate('change').length).toBe(1);
        // const countryCheckbox = findByTestAttr(wrapper1, "country-checkbox");
        // expect(countryCheckbox.simulate('change').length).toBe(1);

        // const { onClick } = buttonClick.props();
        // act(() => {
        //     onClick();
        // });
        // expect(historyMock.push.mock.calls[0][0]).toEqual("/your-cart");



    })
    test("test country list withour error", () => {
        let wrapper3 = setup(store1, historyMock)
        const countryCheckbox = findByTestAttr(wrapper3, "country-checkbox");
        expect(countryCheckbox.simulate('change').length).toBe(1);

    })
    test("test onTextChange withour error", () => {
        let wrapper3 = setup(store1, historyMock)
        const textChange = findByTestAttr(wrapper3, "textChange");
        expect(textChange.simulate('change', { target: { value: "test" } }).length).toBe(1);


    })

})
