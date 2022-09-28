import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/* Icons */
import userActiveIcon from "../../assets/images/user-active.svg";
import userDeActiveIcon from "../../assets/images/user-inactive.svg";
import userEditIcon from "../../assets/images/user-edit.svg";
import userPendingIcon from "../../assets/images/user-pending.svg";
import close from "../../assets/images/search-close.svg";
import closeWhite from "../../assets/images/search-close-white.svg";
import archive from "../../assets/images/archive.png";
import dotIcon from "../../assets/images/dotIcon.svg";

/* Component */
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import HRTemplateFilterDropdown from "../../Components/MultiselectDropDown/HRTemplateFilterDropdown";
import SearchHeaderText from "../../Components/SearchHeaderText/SearchHeaderText";
import CustomeTable from "../../Components/CustomeTable/CustomeTable";

/* Action */
import {
    getAllArchives,
    // getAllLanguages,
    // updateDocumentStatus,
    getAllCategoriesList
} from "../../Store/reducers/HRTemplate";
import { getUserProfile } from "../../utils/storage";
import constants from "../../utils/constants";

const TemplateList = (props) => {
    document.title = "HR Templates";
    const defaultCats = ['Dismissal', 'Employee Agreement', 'Employee Handbook', 'Mutual Termination Agreement'];
    const defaultLanguages = ['English', 'Local'];
    const dispatch = useDispatch();
    const history = useHistory();
    const [selectedRole, setSelectedRole] = useState([]);
    const [hrTableList, setHrTableList] = useState([]);
    const [selectedCats, setSelectedCats] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedLangs, setSelectedLangs] = useState([]);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [deactivateStatus, setDeactivateStatus] = useState({});
    const [templateListParam, setTemplateListParam] = useState({
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        category: [],
        language: [],
    });

    const [userData, setUserData] = useState();
    const [sortOrder, setSortOrder] = useState(true);
    const [sortField, setSortField] = useState("updateddate");
    const [id, setId] = useState("");

    const {
        archiveListLoading,
        archiveList,
        languageList,
        categoriesList,
        templatesListCount,
        _updateDocumentStatus,
        updateDocumentStatusLoading
    } = useSelector((state) => state.HRTemplate);

    // mock data
    const archiveListArray = [
        {
            "id": "a72e1130-18ff-45bf-8c48-c9cfb14f3090",
            "title": "Indian Labour Law AutoKbl",
            "document": {
                "id": "a72e1130-18ff-45bf-8c48-c9cfb14f3090",
                "title": "Indian Labour Law AutoKbl",
                "description": "API Automation ThinkPalm",
                "categoryId": "06929374-4b94-4a8c-8fb8-f2504c543efa",
                "subtitle": "Section1",
                "previewImageUrl": null,
                "employeeLifecycleStage": null,
                "price": 2000.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:21:04.6817",
                "updatedAt": "2021-08-30T06:21:04.6817",
                "createdBy": "7359cc58-288d-4383-a120-c247f6f604c2",
                "updatedBy": "7359cc58-288d-4383-a120-c247f6f604c2",
                "documentCount": 1
            },
            "location": {
                "id": "768d2f1e-6661-44e6-a79a-1c728b33cbe9",
                "documentId": "a72e1130-18ff-45bf-8c48-c9cfb14f3090",
                "regionId": 0,
                "countryId": 1,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:21:04.6817",
                "updatedAt": "2021-08-30T06:21:04.6817",
                "createdBy": "7359cc58-288d-4383-a120-c247f6f604c2",
                "updatedBy": "7359cc58-288d-4383-a120-c247f6f604c2"
            },
            "category": {
                "id": "06929374-4b94-4a8c-8fb8-f2504c543efa",
                "categoryName": "Emp-gopalMoL",
                "description": "Indian Employment",
                "parentCategoryId": null,
                "orderId": 300,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:21:04.505522",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "922a70be-3e3c-49ae-a114-8aa55d6bcebd",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "451eafac-7a21-4942-b383-81a32e34d3f3",
            "version": "1.0",
            "archivedDate": "2021-08-30T06:21:04.505522",
            "regionName": "",
            "stateName": "",
            "countryName": "Afghanistan",
            "countryId": 1,
            "languageName": "Language1Vzr"
        },
        {
            "id": "770808c6-2845-4f12-9833-65b2a7f1bd42",
            "title": "Indian Labour Law AutoOzi",
            "document": {
                "id": "770808c6-2845-4f12-9833-65b2a7f1bd42",
                "title": "Indian Labour Law AutoOzi",
                "description": "API Automation ThinkPalm",
                "categoryId": "60e91874-b543-47b9-ac40-9f33db09aada",
                "subtitle": "Section1",
                "previewImageUrl": null,
                "employeeLifecycleStage": null,
                "price": 2000.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:54.983088",
                "updatedAt": "2021-08-30T06:20:54.983088",
                "createdBy": "3179c082-3a51-4ad0-b4d6-bf8d151ab2c9",
                "updatedBy": "3179c082-3a51-4ad0-b4d6-bf8d151ab2c9",
                "documentCount": 1
            },
            "location": {
                "id": "877e9a43-be50-452c-a9e2-8e067ff789ca",
                "documentId": "770808c6-2845-4f12-9833-65b2a7f1bd42",
                "regionId": 0,
                "countryId": 1,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:54.983088",
                "updatedAt": "2021-08-30T06:20:54.983088",
                "createdBy": "3179c082-3a51-4ad0-b4d6-bf8d151ab2c9",
                "updatedBy": "3179c082-3a51-4ad0-b4d6-bf8d151ab2c9"
            },
            "category": {
                "id": "60e91874-b543-47b9-ac40-9f33db09aada",
                "categoryName": "Emp-gopalQQH",
                "description": "Indian Employment",
                "parentCategoryId": null,
                "orderId": 300,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:54.81062",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "ae6ef1ad-1e6e-41a7-ac8d-e105db5d8b6f",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "561bc363-ab32-4b56-b6a8-d222b24717ec",
            "version": "1.0",
            "regionName": "",
            "stateName": "",
            "countryName": "Afghanistan",
            "countryId": 1,
            "languageName": "Language1Vzr"
        },
        {
            "id": "c1dd1f07-8a0b-45c1-aa0f-9949fb1e35d4",
            "title": "Indian Labour Law Autotgk",
            "document": {
                "id": "c1dd1f07-8a0b-45c1-aa0f-9949fb1e35d4",
                "title": "Indian Labour Law Autotgk",
                "description": "API Automation ThinkPalm",
                "categoryId": "71c54ba9-5f9a-43f8-90fc-3fb85eb615be",
                "subtitle": "Section1",
                "previewImageUrl": null,
                "employeeLifecycleStage": null,
                "price": 2000.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:50.991541",
                "updatedAt": "2021-08-30T06:20:50.991541",
                "createdBy": "6bf1281e-aa5a-4453-ae72-b4b78caf7b51",
                "updatedBy": "6bf1281e-aa5a-4453-ae72-b4b78caf7b51",
                "documentCount": 1
            },
            "location": {
                "id": "7594906d-7707-4925-997f-2b63af06cc68",
                "documentId": "c1dd1f07-8a0b-45c1-aa0f-9949fb1e35d4",
                "regionId": 0,
                "countryId": 1,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:50.991541",
                "updatedAt": "2021-08-30T06:20:50.991541",
                "createdBy": "6bf1281e-aa5a-4453-ae72-b4b78caf7b51",
                "updatedBy": "6bf1281e-aa5a-4453-ae72-b4b78caf7b51"
            },
            "category": {
                "id": "71c54ba9-5f9a-43f8-90fc-3fb85eb615be",
                "categoryName": "Emp-gopalicZ",
                "description": "Indian Employment",
                "parentCategoryId": null,
                "orderId": 300,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:50.781751",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "12c89565-bfb7-42df-a0a1-83493903ea4c",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "014e1039-a4b5-4651-8665-5883592409fb",
            "version": "1.0",
            "regionName": "",
            "stateName": "",
            "countryName": "Afghanistan",
            "countryId": 1,
            "languageName": "Language1Vzr"
        },
        {
            "id": "0e41162a-4531-4532-8043-eb3e7c3a1174",
            "title": "Indian Labour Law AutokOD",
            "document": {
                "id": "0e41162a-4531-4532-8043-eb3e7c3a1174",
                "title": "Indian Labour Law AutokOD",
                "description": "API Automation ThinkPalm",
                "categoryId": "ecd0fea4-6790-49f1-8a15-86735304b05f",
                "subtitle": "Section1",
                "previewImageUrl": null,
                "employeeLifecycleStage": null,
                "price": 2000.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:43.910751",
                "updatedAt": "2021-08-30T06:20:43.910751",
                "createdBy": "1cd03150-14b0-45df-9c49-264772aa3c61",
                "updatedBy": "1cd03150-14b0-45df-9c49-264772aa3c61",
                "documentCount": 1
            },
            "location": {
                "id": "1c7ebe7f-c73e-46e9-a191-89c47eeaaae6",
                "documentId": "0e41162a-4531-4532-8043-eb3e7c3a1174",
                "regionId": 0,
                "countryId": 1,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:43.910751",
                "updatedAt": "2021-08-30T06:20:43.910751",
                "createdBy": "1cd03150-14b0-45df-9c49-264772aa3c61",
                "updatedBy": "1cd03150-14b0-45df-9c49-264772aa3c61"
            },
            "category": {
                "id": "ecd0fea4-6790-49f1-8a15-86735304b05f",
                "categoryName": "Emp-gopalfXf",
                "description": "Indian Employment",
                "parentCategoryId": null,
                "orderId": 300,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-30T06:20:43.6038",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "87c2d4a6-8baa-4ffa-8681-e1a2184b3bec",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "0b0e43d6-b2a9-48cf-b140-781b04670577",
            "version": "1.0",
            "regionName": "",
            "stateName": "",
            "countryName": "Afghanistan",
            "countryId": 1,
            "languageName": "Language1Vzr"
        },
        {
            "id": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
            "title": "Argentina_Leave_Template - Antigua & Barbuda",
            "document": {
                "id": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
                "title": "Argentina_Leave_Template - Antigua & Barbuda",
                "description": "test",
                "categoryId": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "subtitle": "",
                "previewImageUrl": null,
                "employeeLifecycleStage": "Onboard",
                "price": 88.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-27T11:45:48.99281",
                "updatedAt": "2021-08-27T11:52:25.091855",
                "createdBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f",
                "updatedBy": "00000000-0000-0000-0000-000000000000",
                "documentCount": 3
            },
            "location": {
                "id": "49659b46-496e-43f4-85dd-af867e818149",
                "documentId": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
                "regionId": 0,
                "countryId": 7,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T11:45:48.99281",
                "updatedAt": "2021-08-27T11:52:25.091851",
                "createdBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f",
                "updatedBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f"
            },
            "category": {
                "id": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "categoryName": "Argentina_Leave_Template",
                "description": "",
                "parentCategoryId": null,
                "orderId": 0,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T09:08:58.512084",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "a66bf59d-216b-450e-a1c3-e0ccb5374d01",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "f1332944-8515-42af-b698-3fadb5ef3352",
            "version": "3.0",
            "regionName": "",
            "stateName": "",
            "countryName": "Antigua & Barbuda",
            "countryId": 7,
            "languageName": "Urdu"
        },
        {
            "id": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
            "title": "Argentina_Leave_Template - Antigua & Barbuda",
            "document": {
                "id": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
                "title": "Argentina_Leave_Template - Antigua & Barbuda",
                "description": "test",
                "categoryId": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "subtitle": "",
                "previewImageUrl": null,
                "employeeLifecycleStage": "Onboard",
                "price": 88.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-27T11:45:48.99281",
                "updatedAt": "2021-08-27T11:52:25.091855",
                "createdBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f",
                "updatedBy": "00000000-0000-0000-0000-000000000000",
                "documentCount": 3
            },
            "location": {
                "id": "49659b46-496e-43f4-85dd-af867e818149",
                "documentId": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
                "regionId": 0,
                "countryId": 7,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T11:45:48.99281",
                "updatedAt": "2021-08-27T11:52:25.091851",
                "createdBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f",
                "updatedBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f"
            },
            "category": {
                "id": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "categoryName": "Argentina_Leave_Template",
                "description": "",
                "parentCategoryId": null,
                "orderId": 0,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T09:08:58.512084",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "a66bf59d-216b-450e-a1c3-e0ccb5374d01",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "f07d06ba-f640-4c37-841b-c464d1d8e50d",
            "version": "2.0",
            "regionName": "",
            "stateName": "",
            "countryName": "Antigua & Barbuda",
            "countryId": 7,
            "languageName": "malayalam"
        },
        {
            "id": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
            "title": "Argentina_Leave_Template - Antigua & Barbuda",
            "document": {
                "id": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
                "title": "Argentina_Leave_Template - Antigua & Barbuda",
                "description": "test",
                "categoryId": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "subtitle": "",
                "previewImageUrl": null,
                "employeeLifecycleStage": "Onboard",
                "price": 88.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-27T11:45:48.99281",
                "updatedAt": "2021-08-27T11:52:25.091855",
                "createdBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f",
                "updatedBy": "00000000-0000-0000-0000-000000000000",
                "documentCount": 3
            },
            "location": {
                "id": "49659b46-496e-43f4-85dd-af867e818149",
                "documentId": "4df11f7d-8b5c-4de8-9040-6475edb4e258",
                "regionId": 0,
                "countryId": 7,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T11:45:48.99281",
                "updatedAt": "2021-08-27T11:52:25.091851",
                "createdBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f",
                "updatedBy": "61f4eef9-f29c-4957-b0f0-b8c831ae678f"
            },
            "category": {
                "id": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "categoryName": "Argentina_Leave_Template",
                "description": "",
                "parentCategoryId": null,
                "orderId": 0,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T09:08:58.512084",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "a66bf59d-216b-450e-a1c3-e0ccb5374d01",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "7f80ead8-432c-43bc-be43-524253c5a3f7",
            "version": "1.1",
            "regionName": "",
            "stateName": "",
            "countryName": "Antigua & Barbuda",
            "countryId": 7,
            "languageName": "English"
        },
        {
            "id": "3975da9a-9177-4255-890b-9a1485065651",
            "title": "Argentina_Leave_Template - Argentina",
            "document": {
                "id": "3975da9a-9177-4255-890b-9a1485065651",
                "title": "Argentina_Leave_Template - Argentina",
                "description": null,
                "categoryId": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "subtitle": "",
                "previewImageUrl": null,
                "employeeLifecycleStage": "Onboard",
                "price": 500.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-27T09:09:54.793747",
                "updatedAt": "2021-08-27T09:09:54.793747",
                "createdBy": "e90bec4d-4e09-4585-a13d-537c2ad084ec",
                "updatedBy": "e90bec4d-4e09-4585-a13d-537c2ad084ec",
                "documentCount": 1
            },
            "location": {
                "id": "544330e9-e77f-4889-8201-1a868be04ff5",
                "documentId": "3975da9a-9177-4255-890b-9a1485065651",
                "regionId": 0,
                "countryId": 8,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T09:09:54.793747",
                "updatedAt": "2021-08-27T09:09:54.793747",
                "createdBy": "e90bec4d-4e09-4585-a13d-537c2ad084ec",
                "updatedBy": "e90bec4d-4e09-4585-a13d-537c2ad084ec"
            },
            "category": {
                "id": "3a2a17b5-96cc-481b-9119-d5dbe767d5a3",
                "categoryName": "Argentina_Leave_Template",
                "description": "",
                "parentCategoryId": null,
                "orderId": 0,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-27T09:08:58.512084",
                "updatedAt": "0001-01-01T00:00:00",
                "createdBy": "a66bf59d-216b-450e-a1c3-e0ccb5374d01",
                "updatedBy": "00000000-0000-0000-0000-000000000000"
            },
            "documentUploadId": "a305d08b-9c99-4f58-b350-ad14a65cc8eb",
            "version": "1.0",
            "regionName": "",
            "stateName": "",
            "countryName": "Argentina",
            "countryId": 8,
            "languageName": "English"
        },
        {
            "id": "480d7817-144d-4433-9afd-10861ec325aa",
            "title": "Dismissal - Brazil",
            "document": {
                "id": "480d7817-144d-4433-9afd-10861ec325aa",
                "title": "Dismissal - Brazil",
                "description": "Barzil 122",
                "categoryId": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                "subtitle": "from Automation",
                "previewImageUrl": null,
                "employeeLifecycleStage": "",
                "price": 100.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-26T08:03:00.73261",
                "updatedAt": "2021-08-27T05:20:15.32714",
                "createdBy": "2d52b351-e38e-49df-b5cb-d64f5db284be",
                "updatedBy": "00000000-0000-0000-0000-000000000000",
                "documentCount": 2
            },
            "location": {
                "id": "9aaffcf6-161c-4887-bd69-113645ba3b43",
                "documentId": "480d7817-144d-4433-9afd-10861ec325aa",
                "regionId": 0,
                "countryId": 25,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-26T08:03:00.73261",
                "updatedAt": "2021-08-27T05:20:15.327137",
                "createdBy": "2d52b351-e38e-49df-b5cb-d64f5db284be",
                "updatedBy": "2d52b351-e38e-49df-b5cb-d64f5db284be"
            },
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
            "documentUploadId": "d3a101fe-1d24-464e-ad8d-03c31190607c",
            "version": "1.3",
            "regionName": "",
            "stateName": "",
            "countryName": "Brazil",
            "countryId": 25,
            "languageName": "AaaLanguage"
        },
        {
            "id": "480d7817-144d-4433-9afd-10861ec325aa",
            "title": "Dismissal - Brazil",
            "document": {
                "id": "480d7817-144d-4433-9afd-10861ec325aa",
                "title": "Dismissal - Brazil",
                "description": "Barzil 122",
                "categoryId": "0006aafd-ccea-4dcf-96a8-f09e88e7e4d9",
                "subtitle": "from Automation",
                "previewImageUrl": null,
                "employeeLifecycleStage": "",
                "price": 100.00,
                "isActive": true,
                "isBundle": false,
                "isDeleted": false,
                "createdAt": "2021-08-26T08:03:00.73261",
                "updatedAt": "2021-08-27T05:20:15.32714",
                "createdBy": "2d52b351-e38e-49df-b5cb-d64f5db284be",
                "updatedBy": "00000000-0000-0000-0000-000000000000",
                "documentCount": 2
            },
            "location": {
                "id": "9aaffcf6-161c-4887-bd69-113645ba3b43",
                "documentId": "480d7817-144d-4433-9afd-10861ec325aa",
                "regionId": 0,
                "countryId": 25,
                "stateId": null,
                "isActive": true,
                "isDeleted": false,
                "createdAt": "2021-08-26T08:03:00.73261",
                "updatedAt": "2021-08-27T05:20:15.327137",
                "createdBy": "2d52b351-e38e-49df-b5cb-d64f5db284be",
                "updatedBy": "2d52b351-e38e-49df-b5cb-d64f5db284be"
            },
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
            "documentUploadId": "8b9d48df-d144-453a-bc68-d220dd2c89f5",
            "version": "2.0",
            "regionName": "",
            "stateName": "",
            "countryName": "Brazil",
            "countryId": 25,
            "languageName": "Language1KbX"
        }
    ]
    const TemplateListColumns = [
        {
            name: "Type",
            selector: "type",
            width: "20%",
            sortable: true,
            sortName: "type",
            cell: (row) => {
                return (
                    <p className="font-family-for-list mb-2">{row.type}</p>
                );
            },
        },

        {
            name: "Country",
            selector: "countryName",
            right: false,
            sortable: true,
            width: "20%",
            sortName: "country",
            cell: (row) => {
                return (
                    <p className="font-family-for-list mb-2">{row.countryName}</p>
                );
            },
        },
        {
            name: "Language",
            selector: "languageName",
            width: "20%",
            sortable: true,
            right: false,
            sortName: "language",
            cell: (row) => {
                return (
                    <p className="font-family-for-list mb-2">{row.languageName}</p>
                );
            },
        },
        {
            name: "Versions",
            selector: "version",
            sortable: true,
            sortName: "version",
            width: "10%",
            cell: (row) => (
                <p className="font-family-for-list mb-2">{row.version}</p>
            ),
        },
        {
            name: "Date Archived",
            selector: "archivedDate",
            sortable: true,
            sortName: "archivedDate",
            width: "20%",
            cell: (row) => (
                <p className="font-family-for-list mb-2">{moment(row.archivedDate).format(
                    "MMM DD, YYYY")}</p>
            ),
        },
        {
            name: "Action",
            width: "10%",
            cell: (row) => (
                <p className="font-family-for-list mb-2 delete">Delete</p>
            ),
        },
    ];

    const loadTemplateResult = (req) => {
        const _apiLangs = { ...templateListParam };

        if (_apiLangs?.language?.length > 0 && _apiLangs.language.includes('all')) {
            _apiLangs.language = _apiLangs.language.filter(_lng => _lng !== 'all');
            const filteredList = [];
            languageList.map(_langs => {
                if (!defaultLanguages.includes(_langs.language_Name)) {
                    filteredList.push(_langs.id);
                }
            })
            _apiLangs.language = filteredList;
        }

        if (!props.testCase) dispatch(getAllArchives(req ? { ...req, ..._apiLangs } : { ..._apiLangs }));
    };

    useEffect(() => {
        // var user_data = getUserProfile();
        // setUserData(user_data);
        // if (!props.testCase) dispatch(getAllLanguages());
        if (!props.testCase) dispatch(getAllCategoriesList());

    }, []);

    useEffect(() => {
        if (!archiveListLoading) {
            //for mock
            setHrTableList(archiveListArray.map((_template) => {
                // setHrTableList(archiveList.map((_template) => {
                return {
                    ..._template, description: _template?.document?.description,
                    type: _template?.category?.categoryName,
                }
            }));

            setTemplateListParam({
                ...templateListParam,
                total: templatesListCount
            })
        }
    }, [archiveListLoading, archiveList]);


    // useEffect(() => {
    //     if (_updateDocumentStatus === true) {
    //         loadTemplateResult();
    //         handleResetFilter();
    //     }
    // }, [_updateDocumentStatus, updateDocumentStatusLoading]);

    useEffect(() => {
        loadTemplateResult({ sort: sortOrder, sortBy: sortField, searchText: searchText });
    }, [
        templateListParam.pageNumber,
        templateListParam.pageSize,
        templateListParam.category,
        templateListParam.language,
        searchText
    ]);

    // useEffect(() => {
    //     if (_updateDocumentStatus === true) {
    //         handleResetFilter();
    //         loadTemplateResult();
    //     }
    // }, [_updateDocumentStatus, updateDocumentStatusLoading])

    const handleSort = (field, order) => {
        setSortField(field?.sortName);
        setSortOrder(order === "asc" ? false : true);
        loadTemplateResult({ sort: order === "asc" ? false : true, sortBy: field?.sortName, searchText: searchText });
    };

    // const handleDotClick = (statusId) => {
    //     if (id && id == statusId) {
    //         setId(undefined);
    //     } else {
    //         setId(statusId);
    //     }
    // };

    // const deactivateTemplate = async (row) => {
    //     if (!props.testCase) await dispatch(updateDocumentStatus({ id: row.id, status: !deactivateStatus.document?.isActive }));
    //     setShowStatusModal(false);
    // };

    const onViewClick = (row) => {
        goToEditPage(row)
    };

    const goToEditPage = (navigateTo) => {
        if (!props.testCase) {
            if (navigateTo) {
                history.push(`${constants.ROUTE.HR_TEMPLATE.VIEW_EDIT_NEW_TEMPLATE.replace(":id", navigateTo.id).replace(":status", "view")}`);
            } else {
                history.push(`${constants.ROUTE.HR_TEMPLATE.ADD_NEW_TEMPLATE}`);
            }
        }
    };

    const handleClickSelect = async (data, e, type) => {
        const APIRequest = {
            ...templateListParam,
            category: [],
            language: [],
        };

        if (type === 'document') {
            let array = selectedCats.slice(0);
            if (e.target.checked) {
                setSelectedCats([...array, data.id]);
                array = [...array, data.id];
            } else {
                setSelectedCats(array.filter((item) => item !== data.id));
                array = array.filter((item) => item !== data.id);
            }

            APIRequest.category.push(...array);
        } else {
            let array = selectedLangs.slice(0);
            if (e.target.checked) {
                if (data === 'all') {
                    setSelectedLangs([...array, data]);
                    array = [...array, data];
                } else {
                    setSelectedLangs([...array, data.id]);
                    array = [...array, data.id];
                }
            } else {
                if (data === 'all') {
                    setSelectedLangs(array.filter((item) => item != data));
                    array = array.filter((item) => item != data);
                } else {
                    setSelectedLangs(array.filter((item) => item != data.id));
                    array = array.filter((item) => item != data.id);
                }
            }

            APIRequest.language.push(...array);
        }

        setTemplateListParam(APIRequest);
    };

    const onSearchValueChange = ({ target: { value } }) => {
        setSearchText(value);
    }

    const handleResetFilter = () => {
        setSelectedCats([]);
        setSelectedLangs([]);
        setTemplateListParam({
            ...templateListParam,
            category: [],
            language: [],
        });
    }

    // const popupAction = (type, row) => {
    //     if (type === "deactivate") {
    //         setShowStatusModal(true);
    //         setDeactivateStatus(row)
    //     } else if (type === "activate") {
    //         setShowStatusModal(true);
    //         setDeactivateStatus(row)
    //     } else {
    //         goToEditPage(row.id);
    //     }
    // };

    const handleDropdownChange = (e) => {
        const requestObject = {
            ...templateListParam,
            pageNumber: 1,
            pageSize: e.target.value,
        };

        setTemplateListParam(requestObject)
    };

    const handlePageChange = (perPage) => {
        const requestObject = {
            ...templateListParam,
            pageNumber: perPage,
        };

        setTemplateListParam(requestObject)
    };

    const closePopup = ({ target }) => {
        // console.log(target.className) // Enable this to check the classNames
        const closeActionClickClassName = ["hr-template-container", 'font-family-for-list mb-2', "row", "table-custom custom-tabe-tooltip", 'rdt_TableCell'];
        if (closeActionClickClassName.includes(target.className) || target.className.includes("rdt_TableCell") || target.className.includes("rdt_TableCol")) {
            setId(undefined);
        }
    }

    return (
        <div className="hr-template-container" data-testid="TemplateList-result-page" onClick={closePopup}>
            <SearchHeaderText
                filter={true}
                breadcrumb={true}
                user={userData}
                handleClickBack={() => history.push(`${constants.ROUTE.HR_TEMPLATE.LIST}`)
                }
                isArchive={true}
            />
            <div className="container-fluid">
                <div className="col-12">
                    <div className="title-action-wrap hr-doc-header">
                        <div className="row">
                            <div className="col-sm-6 pl-0">
                                <h3
                                    className="gutter-manag-user"
                                    data-tip="Manage user"
                                >
                                    HR Template Archives
                                </h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-12 pl-0">
                                <div className="tbl-search search-by-document-country">
                                    <div className="hr-template-search">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={searchText}
                                            data-testid="search-filter-country"
                                            onChange={onSearchValueChange}
                                            placeholder="Search by document name or country"
                                        />
                                        {searchText ?
                                            <div onClick={() => onSearchValueChange({ target: { value: '' } })}>
                                                {props.theme === "dark" ?
                                                    <img
                                                        alt=""
                                                        src={closeWhite}
                                                        name="search-outline"
                                                        className="close-icon-search-knowledge cursor-pointer"
                                                    />
                                                    :
                                                    <img
                                                        alt=""
                                                        src={close}
                                                        name="search-outline"
                                                        className="close-icon-search cursor-pointer"
                                                    />}
                                            </div>
                                            : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-12 d-flex align-items-center justify-content-md-end pr-0 pl-0">

                                <div className="filter-wrap">
                                    <HRTemplateFilterDropdown
                                        data={categoriesList}
                                        languages={languageList.filter(c => defaultLanguages.includes(c.language_Name))}
                                        handleClickSelect={handleClickSelect}
                                        resetFilter={handleResetFilter}
                                        selectedType={selectedCats}
                                        selectedLanguages={selectedLangs}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div
                    className="table-custom custom-tabe-tooltip"
                    data-test="custome-table"
                >
                    <CustomeTable
                        {...props}
                        columns={TemplateListColumns}
                        data={hrTableList}
                        pending={archiveListLoading}
                        pagination={false}
                        disabledJumpTo={false}
                        paginationServer={false}
                        noDataString={<div className="no-data-found-hr-template">Add templates to see them listed here.</div>}
                        onSort={handleSort}
                        custompagination
                        totalListCount={templateListParam.total}
                        paginationTotalRows={templateListParam.total}
                        paginationPerPage={templateListParam.pageSize}
                        onPageChangedCalled={handlePageChange}
                        pageNumber={templateListParam.pageNumber}
                        handleDropdownChange={handleDropdownChange}
                        limit={templateListParam.pageSize}
                    />
                </div>
            </div>

            {/* <Modal
                show={showStatusModal}
                onHide={() => { setDeactivateStatus({}); setShowStatusModal(false) }}
                backdrop="static"
                keyboard={false}
                centered={true}
                contentClassName="custome-modal"
            >
                <Modal.Header className="role_header_model" closeButton>
                    <Modal.Title>
                        {deactivateStatus?.document?.isActive ? 'Deactivate' : 'Activate'} {deactivateStatus?.type}?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="role_body_model">
                    {
                        deactivateStatus?.document?.isActive ? 'Users will no longer have access to this template.' : 'Users will have the access to this template.'
                    }
                    {
                        deactivateStatus?.document?.isActive ? 'The template will be archived after 30 days.' : ''
                    }
                </Modal.Body>
                <Modal.Footer className="role_footer_model">
                    <Button variant="secondary" onClick={() => { setDeactivateStatus({}); setShowStatusModal(false) }}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => deactivateTemplate(deactivateStatus)}>
                        {deactivateStatus?.document?.isActive ? "Deactivate" : "Activate"}
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    );
};

export default TemplateList;
