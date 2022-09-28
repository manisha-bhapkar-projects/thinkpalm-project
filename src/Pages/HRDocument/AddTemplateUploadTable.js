import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import moment from "moment";

/* Icons */
import archive_blue from "../../assets/images/archive_blue.svg";
import trash_blue from "../../assets/images/trash_blue.svg";
import download_btn from "../../assets/images/download-blue.svg";
import documentStack from "../../assets/images/document-stack-gray.svg";


/* Component */
import CustomeTable from "../../Components/CustomeTable/CustomeTable";

/* Action */
import {
    deleteDocument,
    getTemplateById
} from "../../Store/reducers/HRTemplate";
import constants from "../../utils/constants";

const AddTemplateUploadTable = (props) => {
    const { testCase, isEdit, id, documentList, addToArchive, setLoading, loading, setOpenAddToArchieveModal } = props;

    const dispatch = useDispatch();
    const history = useHistory();

    const [uploadList, setUploadList] = useState([]);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState("");

    const [showArchivedModal, setShowArchivedModal] = useState(false);
    const [archiveItem, setArchiveItem] = useState({});

    useEffect(() => {
        if (documentList != null && documentList.length > 0) {
            setUploadList(documentList)
            // let tempList = [];
            // documentList.map(item => {
            //     item.versionHistory.map(it => {
            //         tempList.push(
            //             {
            //                 ...it,
            //                 Language: item.languageName,
            //                 uploadId: item.uploadId,
            //                 deleteId: item.id
            //             }
            //         );
            //     });
            //     setUploadList(tempList)
            // })
        }

    }, [documentList])

    const UploadListColumns = [
        {
            name: "",
            selector: "",
            width: "6%",
            sortable: false,
            sortName: "",
            cell: (row) => {
                return (
                    <p className="font-family-for-list mb-2 link-btn">
                        <img
                            alt=""
                            src={documentStack}
                            name="search-outline"
                            className="document-stack"
                        />
                    </p>
                );
            },
        },
        {
            name: "Language",
            selector: "languageName",
            width: "25%",
            sortable: true,
            sortName: "Language",
            cell: (row) => {
                return (
                    <p className="font-family-for-list mb-2 link-btn">{row?.languageName}</p>
                );
            },
        },
        {
            name: "Upload Date",
            selector: "UploadDate",
            sortable: true,
            sortName: "updatedAt",
            width: "30%",
            cell: (row) => (
                <p className="font-family-for-list mb-2">{moment(row?.updatedAt).format("MMMM DD, YYYY")}</p>
            ),
        },
        {
            name: "Version",
            selector: "Version",
            right: false,
            sortable: true,
            width: "15%",
            sortName: "version",
            cell: (row) => {
                return (
                    <p className="font-family-for-list mb-2">{row?.version}</p>
                );
            },
        },
        {
            name: isEdit ? "Actions" : "",
            selector: "",
            right: false,
            width: isEdit ? "20%" : "10%",
            grow: "1",
            cell: (row) => {
                return (
                    <>
                        <div className="template-quick-action-btn">
                            {/* {
                                (isEdit && row.isActive) && (
                                    <div className="child-action" data-testid="edit-template"
                                        onClick={() =>
                                            popupAction('archive', row)}
                                    >
                                        <Tooltip title="Add to archive">
                                            <img
                                                alt=""
                                                src={archive_blue}
                                                name="search-outline"
                                                className="file-clip"
                                            />
                                        </Tooltip>
                                    </div>
                                )
                            } */}
                            {
                                (isEdit && row.isActive) && (
                                    <div className="child-action" data-testid="activate-template"
                                    // onClick={() => 
                                    // popupAction('delete', row)}
                                    >
                                        <Tooltip title="Delete the document">
                                            <img
                                                alt=""
                                                src={trash_blue}
                                                name="search-outline"
                                                className="file-clip"
                                            />
                                        </Tooltip>
                                    </div>
                                )
                            }
                            <div className="child-action" data-testid="activate-template"
                            // onClick={() => 
                            // popupAction('download', row)}
                            >
                                <Tooltip title="Download the document">
                                    <img
                                        alt=""
                                        src={download_btn}
                                        name="search-outline"
                                        className="download"
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </>
                );
            },
        },
    ];

    const popupAction = (type, itemValue) => {
        setOpenAddToArchieveModal(true, "document")
        // if (type === "delete") {
        //     console.log(type, itemValue)
        //     setSelectedDeleteItem(itemValue.documentUploadsId);
        //     debugger
        //     setShowStatusModal(true);
        // } else if (type === "download") {
        //     window.open(constants.API.COUNTRY.GET_FLAG_DOWNLOAD + itemValue.documentUploadsId, "_blank");
        // } else {
        //     setArchiveItem(itemValue);
        //     setShowArchivedModal(true);
        // }
    }

    const handleSort = (field, order) => {
        const orderBy = order === "asc" ? false : true;
        if (field?.sortName) {
            let sortedItem = [...uploadList].sort(function (a, b) {
                var nameA = '', nameB = '';
                if (field?.sortName == "updatedAt") {
                    nameA = a?.updatedAt;
                    nameB = b?.updatedAt;
                } else if (field?.sortName == "version") {
                    nameA = a?.version;
                    nameB = b?.version;
                } else {
                    nameA = a[field?.sortName].toLowerCase();
                    nameB = b[field?.sortName].toLowerCase();
                }

                if (nameA < nameB)
                    return orderBy ? 1 : -1;

                if (nameA > nameB)
                    return orderBy ? -1 : 1;

                return 0;
            });

            setUploadList([...sortedItem]);
        }
    };

    const deleteTemplate = async () => {
        setLoading(true);
        setShowStatusModal(false);
        setSelectedDeleteItem('');
        let status = await deleteDocument(selectedDeleteItem);
        if (status && status.error) {
            dispatch(getTemplateById({ id }));
            props.notify('Failed to delete the document!');
        } else {
            dispatch(getTemplateById({ id }));
            props.notify('Template Deleted');
        }
        setLoading(false);
    }

    const GetModalContent = ({ status, setStatus, title, body, type, confirmAction, test_id }) => {
        return (
            <Modal
                show={status || props.testCase}
                onHide={setStatus}
                backdrop="static"
                keyboard={false}
                centered={true}
                contentClassName="custome-modal"
            >
                <Modal.Header className="role_header_model" closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="role_body_model">{body}</Modal.Body>
                <Modal.Footer className="role_footer_model">
                    <button className="btn btn-secondary" onClick={setStatus}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={confirmAction} data-testid={test_id}>
                        {type}
                    </button>
                </Modal.Footer>
            </Modal>
        )
    }
    return (
        <div className="upload-list">
            <div
                className="table-custom custom-tabe-tooltip"
                data-test="custome-table"
            >
                <CustomeTable
                    {...props}
                    columns={UploadListColumns}
                    data={uploadList}
                    customClassName="templateList"
                    pending={loading}
                    pagination={false}
                    disabledJumpTo={false}
                    paginationServer={false}
                    noDataString={<div className="no-data-found-hr-template">No documents found.</div>}
                    onSort={handleSort}
                />
            </div>
            <GetModalContent
                status={showStatusModal}
                setStatus={() => setShowStatusModal(false)}
                title="Permanently Delete HR Template?"
                body="Users will lose access to deleted templates. This template will be removed from Archives and HR listings pages."
                type="Delete"
                test_id="delete-btn"
                confirmAction={() => deleteTemplate(selectedDeleteItem)}
            />
            <GetModalContent
                status={showArchivedModal}
                setStatus={() => setShowArchivedModal(false)}
                title={`Archive Template “${"Employee Agreement"}” in ${archiveItem.languageName}?`}
                body="This version of the document will be removed from Doc Shop and the list of uploaded templates. Users who own this template will continue to have access to it."
                type="Archive"
                test_id="archive-btn"
                confirmAction={() => {
                    addToArchive(archiveItem);
                    setShowArchivedModal(false);
                    setArchiveItem({});
                }}
            />
        </div>
    );
};

export default AddTemplateUploadTable;
