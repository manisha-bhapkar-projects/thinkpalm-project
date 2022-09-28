
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import AddEditTemplate from '../AddEditTemplate'
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn().mockReturnValue({
        pathname: '/test',
        search: '',
        hash: '',
        state: null,
        key: '5nvxpbdafa',
    }),
    useHistory: jest.fn().mockReturnValue({ push: jest.fn(), location: {}, listen: jest.fn() }),
    useParams: () => { return { id: "143f01e0-7b1f-4f63-9f79-4a5716038b96", status: true } },
}));


jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

jest.mock('../../../utils/axiosConfig', () => ({
    post: () => {
        return new Promise((reject, resolve) => resolve({ response: { status: undefined, data: '' } }));
    },
}));




afterEach(cleanup);

const mockStore = configureStore([thunk]);
let store = mockStore({
    HRTemplate: {
        templatesListLoading: false,
        getTemplateInfoLoading: false,
        getTemplateInfo: {
            "id": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
            "title": "new doc 1",
            "document": {
                "id": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
                "title": "new doc 1",
                "description": "test update",
                "categoryId": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                "subtitle": null,
                "previewImageUrl": null,
                "language": 2,
                "price": 11,
                "uploadId": "f4eea8fd-ee39-46a1-b525-1db1a1779efb",
                "latestVersion": "6d1d6fc1-97e3-4476-b728-ba566e3a6c2c",
                "isActive": false,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-04-08T00:00:00",
                "updatedAt": "2021-07-23T11:18:21.387089",
                "createdBy": "00000000-0000-0000-0000-000000000000",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploads": [
                {
                    "id": "1096d068-d746-4f36-99cd-1749551e21ea",
                    "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                    "language": 1,
                    "languageName": "English",
                    "uploadId": "dcd75de3-c1fe-479d-bc56-62ea8dac5312",
                    "latestVersion": "ff132129-5e4d-41d9-8306-4e968f092faa",
                    "latestDocument": {
                        "id": "ff132129-5e4d-41d9-8306-4e968f092faa",
                        "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                        "documentUploadsId": "1096d068-d746-4f36-99cd-1749551e21ea",
                        "version": "1.2",
                        "blobVersion": "2021-08-19T11:53:39.2790939Z",
                        "documentUrl": "/DOCUMENTS/663f6445-8356-406a-af82-ee73cda45624_file 1.doc",
                        "numberOfPages": 2,
                        "expiresOn": "0001-01-01T00:00:00",
                        "isActive": true,
                        "isDeleted": false
                    },
                    "isActive": true,
                    "isDeleted": false,
                    "upload": {
                        "id": "dcd75de3-c1fe-479d-bc56-62ea8dac5312",
                        "filePathUri": "/DOCUMENTS/663f6445-8356-406a-af82-ee73cda45624_file 1.doc",
                        "originalFileName": "file 1.doc",
                        "blobVersion": "2021-08-19T11:53:39.2790939Z",
                        "isActive": true,
                        "isDeleted": false,
                        "previewFile": "DOCPREVIEW/663f6445-8356-406a-af82-ee73cda45624_file 1.png"
                    },
                    "versions": [
                        {
                            "id": "1c2d49b5-b2f1-4787-82b2-40ba38864dcf",
                            "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                            "documentUploadsId": "1096d068-d746-4f36-99cd-1749551e21ea",
                            "version": "1.1",
                            "blobVersion": "2021-08-19T11:26:37.4469405Z",
                            "documentUrl": "/DOCUMENTS/1b85469e-90bd-4f9e-9a01-0b85681a3585_file 1.doc",
                            "numberOfPages": 2,
                            "expiresOn": "0001-01-01T00:00:00",
                            "isActive": false,
                            "isDeleted": false
                        },
                        {
                            "id": "93b82bdb-2876-46cd-bf1e-c295cb4cf95e",
                            "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                            "documentUploadsId": "1096d068-d746-4f36-99cd-1749551e21ea",
                            "version": "1.0",
                            "blobVersion": "2021-08-17T13:31:41.3743102Z",
                            "documentUrl": "/DOCUMENTS/8ce2023b-1584-4fd8-9e6f-55909f8cffac_file-sample_100kB.doc",
                            "numberOfPages": 0,
                            "expiresOn": "0001-01-01T00:00:00",
                            "isActive": false,
                            "isDeleted": false
                        },
                        {
                            "id": "ff132129-5e4d-41d9-8306-4e968f092faa",
                            "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                            "documentUploadsId": "1096d068-d746-4f36-99cd-1749551e21ea",
                            "version": "1.2",
                            "blobVersion": "2021-08-19T11:53:39.2790939Z",
                            "documentUrl": "/DOCUMENTS/663f6445-8356-406a-af82-ee73cda45624_file 1.doc",
                            "numberOfPages": 2,
                            "expiresOn": "0001-01-01T00:00:00",
                            "isActive": true,
                            "isDeleted": false
                        }
                    ]
                },
                {
                    "id": "80a6fc25-1f00-4ebd-ab3d-1b5f8424c009",
                    "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                    "language": 4,
                    "languageName": "Tamil",
                    "uploadId": "9c2cb36f-5ff6-4dba-889f-d81142654d57",
                    "latestVersion": "2af0a7a4-a2ee-458c-ae9f-b39205c4356d",
                    "latestDocument": {
                        "id": "2af0a7a4-a2ee-458c-ae9f-b39205c4356d",
                        "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                        "documentUploadsId": "80a6fc25-1f00-4ebd-ab3d-1b5f8424c009",
                        "version": "2.2",
                        "blobVersion": "2021-08-19T11:53:40.3088187Z",
                        "documentUrl": "/DOCUMENTS/afc4f65f-13c6-482f-b81e-be796e4e8d5c_file 2.doc",
                        "numberOfPages": 2,
                        "expiresOn": "0001-01-01T00:00:00",
                        "isActive": true,
                        "isDeleted": false,
                    },
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2021-08-19T11:53:41.217948",
                    "updatedAt": "2021-08-19T11:53:41.217948",
                    "createdBy": "df2c93d0-0271-4f25-a0a0-09aeccfa4e99",
                    "updatedBy": "df2c93d0-0271-4f25-a0a0-09aeccfa4e99",
                    "upload": {
                        "id": "9c2cb36f-5ff6-4dba-889f-d81142654d57",
                        "filePathUri": "/DOCUMENTS/afc4f65f-13c6-482f-b81e-be796e4e8d5c_file 2.doc",
                        "originalFileName": "file 2.doc",
                        "blobVersion": "2021-08-19T11:53:40.3088187Z",
                        "isActive": true,
                        "isDeleted": false
                    },
                    "versions": [
                        {
                            "id": "2af0a7a4-a2ee-458c-ae9f-b39205c4356d",
                            "documentId": "0bee26ec-e200-498a-bf3c-a1705cec5a74",
                            "documentUploadsId": "80a6fc25-1f00-4ebd-ab3d-1b5f8424c009",
                            "version": "2.2",
                            "blobVersion": "2021-08-19T11:53:40.3088187Z",
                            "documentUrl": "/DOCUMENTS/afc4f65f-13c6-482f-b81e-be796e4e8d5c_file 2.doc",
                            "numberOfPages": 2,
                            "expiresOn": "0001-01-01T00:00:00",
                            "isActive": true,
                            "isDeleted": false
                        }
                    ]
                }
            ],
            "location": {
                "id": "b75fe9a2-1f23-4f11-af1f-f4a331139395",
                "documentId": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
                "regionId": 0,
                "countryId": 2,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-04-08T00:00:00",
                "updatedAt": "2021-07-23T11:18:21.387086",
                "createdBy": "00000000-0000-0000-0000-000000000000",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "versions": [
                {
                    "id": "6d1d6fc1-97e3-4476-b728-ba566e3a6c2c",
                    "documentId": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
                    "version": "1.0",
                    "blobVersion": "2021-07-23T11:18:20.0838701Z",
                    "documentUrl": "/DOCUMENTS/db4c258e-afad-455c-8ec8-9dac75e1fdab_file-sample_100kB.doc",
                    "numberOfPages": 0,
                    "expiresOn": "0001-01-01T00:00:00",
                    "isActive": false,
                    "isDeleted": false,
                    "createdAt": "0001-01-01T00:00:00",
                    "updatedAt": "0001-01-01T00:00:00",
                    "createdBy": "00000000-0000-0000-0000-000000000000",
                    "updatedBy": "00000000-0000-0000-0000-000000000000"
                }
            ],
            "upload": {
                "id": "f4eea8fd-ee39-46a1-b525-1db1a1779efb",
                "filePathUri": "/DOCUMENTS/5b920320-551d-4aaa-936e-aefe8910ff75_sample.doc",
                "originalFileName": "sample.doc",
                "blobVersion": "{VersionId :2021-03-22T11:12:47.2816469Z}",
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-03-22T11:08:37.250558",
                "updatedAt": "2021-03-22T11:08:37.250558",
                "createdBy": "69fa57e0-2908-4354-953c-05b22d2cbe62",
                "updatedBy": "8955cb35-15a9-4ba8-a51a-b0faf6221486",
                "previewFile": null
            },
            "documentBundle": [],
            "category": {
                "id": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                "categoryName": "Dismissal",
                "description": "Dismissal",
                "parentCategoryId": null,
                "orderId": 1,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-06-30T19:21:00.226875",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "94d47e3d-4e75-4c75-b0d7-0f1f7074d4c1",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "regionName": "",
            "stateName": "",
            "countryName": "Albania",
            "languageName": "Language1OUZ"
        },
        templatesList: [
            {
                "id": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
                "title": "new doc 1",
                "document": {
                    "id": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
                    "title": "new doc 1",
                    "description": "test update",
                    "categoryId": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                    "subtitle": null,
                    "previewImageUrl": null,
                    "language": 2,
                    "price": 11,
                    "uploadId": "f4eea8fd-ee39-46a1-b525-1db1a1779efb",
                    "latestVersion": "6d1d6fc1-97e3-4476-b728-ba566e3a6c2c",
                    "isActive": false,
                    "isBundle": false,
                    "isDeleted": false,
                    "createdAt": "2021-04-08T00:00:00",
                    "updatedAt": "2021-07-23T11:18:21.387089",
                    "createdBy": "00000000-0000-0000-0000-000000000000",
                    "updatedBy": "00000000-0000-0000-0000-000000000000"
                },
                "location": {
                    "id": "b75fe9a2-1f23-4f11-af1f-f4a331139395",
                    "documentId": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
                    "regionId": 0,
                    "countryId": 2,
                    "stateId": null,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2021-04-08T00:00:00",
                    "updatedAt": "2021-07-23T11:18:21.387086",
                    "createdBy": "00000000-0000-0000-0000-000000000000",
                    "updatedBy": "00000000-0000-0000-0000-000000000000"
                },
                "versions": [
                    {
                        "id": "6d1d6fc1-97e3-4476-b728-ba566e3a6c2c",
                        "documentId": "143f01e0-7b1f-4f63-9f79-4a5716038b96",
                        "version": "1.0",
                        "blobVersion": "2021-07-23T11:18:20.0838701Z",
                        "documentUrl": "/DOCUMENTS/db4c258e-afad-455c-8ec8-9dac75e1fdab_file-sample_100kB.doc",
                        "numberOfPages": 0,
                        "expiresOn": "0001-01-01T00:00:00",
                        "isActive": false,
                        "isDeleted": false,
                        "createdAt": "0001-01-01T00:00:00",
                        "updatedAt": "0001-01-01T00:00:00",
                        "createdBy": "00000000-0000-0000-0000-000000000000",
                        "updatedBy": "00000000-0000-0000-0000-000000000000"
                    }
                ],
                "upload": {
                    "id": "f4eea8fd-ee39-46a1-b525-1db1a1779efb",
                    "filePathUri": "/DOCUMENTS/5b920320-551d-4aaa-936e-aefe8910ff75_sample.doc",
                    "originalFileName": "sample.doc",
                    "blobVersion": "{VersionId :2021-03-22T11:12:47.2816469Z}",
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2021-03-22T11:08:37.250558",
                    "updatedAt": "2021-03-22T11:08:37.250558",
                    "createdBy": "69fa57e0-2908-4354-953c-05b22d2cbe62",
                    "updatedBy": "8955cb35-15a9-4ba8-a51a-b0faf6221486",
                    "previewFile": null
                },
                "documentBundle": [],
                "category": {
                    "id": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                    "categoryName": "Dismissal",
                    "description": "Dismissal",
                    "parentCategoryId": null,
                    "orderId": 1,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2021-06-30T19:21:00.226875",
                    "updatedAt": "0001-01-01T00:00:00",
                    "createdBy": "94d47e3d-4e75-4c75-b0d7-0f1f7074d4c1",
                    "updatedBy": "00000000-0000-0000-0000-000000000000"
                },
                "regionName": "",
                "stateName": "",
                "countryName": "Albania",
                "languageName": "Language1OUZ"
            },
            {
                "id": "23ec9540-b9eb-414c-8978-f3fe42a75b63",
                "title": "test_qa3_retest_ed",
                "document": {
                    "id": "23ec9540-b9eb-414c-8978-f3fe42a75b63",
                    "title": "test_qa3_retest_ed",
                    "description": "testqa3_retest edited",
                    "categoryId": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                    "subtitle": "ads",
                    "previewImageUrl": "asdd",
                    "language": 1,
                    "price": 1,
                    "uploadId": "d7a5b27f-ee35-4e52-b825-4b61ca7e059d",
                    "latestVersion": "9d32588e-7121-41b2-bd2f-9a88711470dd",
                    "isActive": true,
                    "isBundle": false,
                    "isDeleted": false,
                    "createdAt": "2021-04-08T00:00:00",
                    "updatedAt": "2021-03-09T05:18:18.459487",
                    "createdBy": "00000000-0000-0000-0000-000000000000",
                    "updatedBy": "edacdddc-3b14-40be-8d78-26f8993dbc6f"
                },
                "location": {
                    "id": "bdc9cd2a-fcac-4b39-a1d2-87c68ba25880",
                    "documentId": "23ec9540-b9eb-414c-8978-f3fe42a75b63",
                    "regionId": 1,
                    "countryId": 2,
                    "stateId": 1,
                    "isActive": false,
                    "isDeleted": false,
                    "createdAt": "2021-04-08T00:00:00",
                    "updatedAt": "2021-03-09T05:18:18.459486",
                    "createdBy": "00000000-0000-0000-0000-000000000000",
                    "updatedBy": "00000000-0000-0000-0000-000000000000"
                },
                "versions": [
                    {
                        "id": "706196f8-2304-48fb-a0ea-dc18e3054640",
                        "documentId": "23ec9540-b9eb-414c-8978-f3fe42a75b63",
                        "version": "1.0",
                        "blobVersion": "{VersionId :2021-03-08T10:26:27.8749744Z}",
                        "documentUrl": "1581e140-0398-4e8b-9d1f-35de9d9af06e_sample.xlsx",
                        "numberOfPages": 1,
                        "expiresOn": "0001-01-01T00:00:00",
                        "isActive": false,
                        "isDeleted": false,
                        "createdAt": "2021-04-08T00:00:00",
                        "updatedAt": "0001-01-01T00:00:00",
                        "createdBy": "00000000-0000-0000-0000-000000000000",
                        "updatedBy": "00000000-0000-0000-0000-000000000000"
                    }
                ],
                "upload": {
                    "id": "d7a5b27f-ee35-4e52-b825-4b61ca7e059d",
                    "filePathUri": "1581e140-0398-4e8b-9d1f-35de9d9af06e_sample.xlsx",
                    "originalFileName": "sample.xlsx",
                    "blobVersion": "{VersionId :2021-03-08T10:26:27.8749744Z}",
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2021-03-08T10:25:14.382889",
                    "updatedAt": "2021-03-08T10:25:14.382916",
                    "createdBy": "a4196885-08ba-4f10-95ac-f0aec1500961",
                    "updatedBy": "fe7861ae-74c5-4dfe-8084-ab0d27d7b6ed",
                    "previewFile": null
                },
                "documentBundle": [],
                "category": {
                    "id": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                    "categoryName": "Dismissal",
                    "description": "Dismissal",
                    "parentCategoryId": null,
                    "orderId": 1,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2021-06-30T19:21:00.226875",
                    "updatedAt": "0001-01-01T00:00:00",
                    "createdBy": "94d47e3d-4e75-4c75-b0d7-0f1f7074d4c1",
                    "updatedBy": "00000000-0000-0000-0000-000000000000"
                },
                "regionName": "Global",
                "stateName": null,
                "countryName": "Albania",
                "languageName": "gg"
            }],
        languageList: [{
            "id": 28,
            "language_Name": "English",
            "language_Code": "hZz",
            "order_Id": 300,
            "is_Deleted": false,
            "is_Active": true,
            "created_At": "2021-04-08T10:15:52.975488",
            "updated_At": "2021-04-08T10:15:54.134081"
        },
        {
            "id": 109,
            "language_Name": "Local",
            "language_Code": "Local",
            "order_Id": 300,
            "is_Deleted": false,
            "is_Active": true,
            "created_At": "2021-05-14T05:36:51.898648",
            "updated_At": "2021-05-14T05:36:54.814587"
        },
        {
            "id": 237,
            "language_Name": "English",
            "language_Code": null,
            "order_Id": 0,
            "is_Deleted": false,
            "is_Active": true,
            "created_At": "2021-07-22T09:17:39.247282",
            "updated_At": "0001-01-01T00:00:00"
        }],
        categoriesList: [
            {
                "id": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                "categoryName": "Dismissal",
                "description": "Dismissal",
                "parentCategoryId": null,
                "orderId": 1,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-06-30T19:21:00.226875",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "94d47e3d-4e75-4c75-b0d7-0f1f7074d4c1",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "d5eac524-1bed-4dbd-a811-37c679ffa04a",
                "categoryName": "Employee Agreement",
                "description": "Employee Agreement",
                "parentCategoryId": null,
                "orderId": 300,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-07-19T08:43:49.23261",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "5a99975a-14ab-49ab-a2ea-e8c56b63c52e",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "162c5660-dcd1-41f0-97c3-a3a05b305c66",
                "categoryName": "Employee Handbook",
                "description": "Employee Handbook",
                "parentCategoryId": null,
                "orderId": 300,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-07-23T05:13:54.023938",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "786fda1a-6ce8-46fc-a31d-1f8b288c184b",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            }
        ],
        countryList: [{
            "id": 447,
            "country_Name": "aaaa",
            "country_Code": null,
            "order_Id": 0,
            "region_Id": null,
            "flag_Upload_Id": "",
            "header_Image_Id": "",
            "is_Deleted": false,
            "is_Active": true,
            "created_At": "2021-07-14T13:23:45.159275",
            "updated_At": "0001-01-01T00:00:00",
            "defaultRegion": null
        },
        {
            "id": 280,
            "country_Name": "Aaaa_premji Testupdate",
            "country_Code": null,
            "order_Id": 0,
            "region_Id": null,
            "flag_Upload_Id": "f2102c0b-b3b4-444a-9049-211fd8ec054e",
            "header_Image_Id": "c78c7c72-4f3c-49fc-9a44-e28c7c97412e",
            "is_Deleted": false,
            "is_Active": true,
            "created_At": "2021-06-21T13:51:10.174641",
            "updated_At": "2021-06-23T07:50:57.232658",
            "defaultRegion": {
                "id": 1,
                "regionName": "Global",
                "regionCode": null
            }
        },
        {
            "id": 1,
            "country_Name": "Afghanistan",
            "country_Code": "AFG",
            "order_Id": 0,
            "region_Id": "1,2",
            "flag_Upload_Id": "d17fd09e-b74c-4f58-b0c8-7d04d19282c2",
            "header_Image_Id": "f0741f8f-eb58-47fa-941a-c309ba0d1251",
            "is_Deleted": false,
            "is_Active": true,
            "created_At": "2021-05-19T11:47:01",
            "updated_At": "2021-07-05T13:24:35.953217",
            "defaultRegion": {
                "id": 1,
                "regionName": "Global",
                "regionCode": null
            }
        }],
        templatesListCount: 120,
        _updateDocumentStatus: true,
        addToArchivesLoading: false,
        addToArchivesStatus: false,
        addNewLanguageLoading: false,
        addNewLanguageStatus: true,
        updateDocumentStatusLoading: true
    },
    dispatch: jest.fn()
});

const defaultProps = {
    className: "",
    insight: true,
    testCase: true,
    notify: () => { },
    reducer: {
        countryId: 1,
        countryName: 'Test country',
    }
};

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

describe("AddEditTemplate Page Component", () => {

    it('render Add Template page without error', async () => {
        const { rerender, getByTestId, asFragment } = render(<Provider store={store}><AddEditTemplate {...defaultProps} isAdd={true} /></Provider>);
        const listNode = await waitFor(() => getByTestId('AddEditTemplate-result-page'));
        expect(listNode.children).toHaveLength(1);
        rerender(<Provider store={store}><AddEditTemplate {...defaultProps} isView={true} isAdd={true} /></Provider>);

    });

    test('simulate add page buttons and inputs without error', async () => {
        const promise = Promise.resolve();
        let _defaultProps = { ...defaultProps, theme: 'red', isAdd: true }
        const { getByTestId, asFragment } = render(<Provider store={store}><AddEditTemplate history={historyMock} {..._defaultProps} isAdd={true} /></Provider>)
        const saveTemplate = getByTestId('save-Template');
        userEvent.click(saveTemplate);
        const addLngBtn = getByTestId('add-language-popup');
        userEvent.click(addLngBtn);
        const addLngInput = getByTestId('add-language-input');
        userEvent.type(addLngInput, "test");
        const addLngSaveBtn = getByTestId('add-language-btn');
        const closePopup = getByTestId('close-popup');
        const priceInput = getByTestId('price-input');
        userEvent.click(addLngSaveBtn);
        userEvent.type(addLngInput, "");
        userEvent.type(priceInput, "2000");
        userEvent.click(closePopup);
        const addTypeBtn = getByTestId('open-type-popup');
        userEvent.click(addTypeBtn);
        const addTypeInput = getByTestId('add-template-input');
        userEvent.type(addTypeInput, "test");
        const saveTypeBtn = getByTestId('add-language-btn');
        userEvent.click(saveTypeBtn);
        await act(() => promise);
    });

    test('render View Template page without error', async () => {
        const promise = Promise.resolve();
        const { getByTestId, asFragment } = render(<Provider store={store}><AddEditTemplate history={historyMock} isView={true} {...defaultProps} /></Provider>)
        await act(() => promise);
    });

    test('simulate Edit page buttons and inputs without error', async () => {
        const promise = Promise.resolve();
        let _defaultProps = { ...defaultProps, theme: 'red', isAdd: true }
        const { getByTestId, asFragment } = render(<Provider store={store}><AddEditTemplate history={historyMock} {..._defaultProps} isEdit={true} /></Provider>)

        const saveTemplate = getByTestId('save-Template');
        userEvent.click(saveTemplate);

        await act(() => promise);
    });


});