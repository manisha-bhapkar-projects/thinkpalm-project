import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import DropToUpload from 'react-drop-to-upload';
import { Spinner } from 'react-bootstrap';
import DeleteConfirmModal from './deleteConfirmModal';

/* Icons */
import check from '../../../assets/images/check.svg';

/* Component */
import CustomeDropDown from '../../../Components/CustomeDropDown/CustomeDropDown';
import TextFieldComponent from '../../../Components/TextFieldComponent/TextFieldComponent';
import { getUserProfile } from '../../../utils/storage';
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import constants from '../../../utils/constants';
import { permissionMapping } from '../../../utils/utils';
import Loader from '../../../Components/Loader';

/* Action */
import {
  addEstimation,
  addTimetrackerDetails,
  assignToExpert,
  getExpertEmailList,
  getManageQueryDetails,
  postNoteForInternalView,
  updateEstimation,
  updateTimetrackerDetails,
  deleteUploadedDocument,
} from '../../../Store/reducers/Purchase_ExpertBriefs';
import {
  callUploadProfilePicAPI,
  uploadDocument,
} from '../../../Store/reducers/myAccount';

const convertMinToHours = (mins) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins - hours * 60;

  return { hours, minutes };
};

const ManageQuery = (props) => {
  document.title = 'Settings ';
  const param = useParams();
  const hiddenFileInput = React.useRef(null);
  const history = useHistory();
  const id = param?.id;
  const [userData, setUserData] = useState();
  const [expertEmails, setExpertEmails] = useState([]);
  const [isDisplay, setIsDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const permissionArray = permissionMapping(props.isTestCase);
  const [timeTrackerValues, setTimeTrackerValues] = useState([]);
  const [initialValues, setInitialValues] = useState({
    estimateHours: '',
    estimateMinutes: '',
    estimateNoteForUser: '',
    noteForInternalView: '',
    userCancellationNote: '',
    isEditable: true,
  });
  const [billableHour, setBillableHours] = useState({
    totalHours: 0,
    totalMinutes: 0,
    billableHours: 0,
    billableMinutes: 0,
  });
  const [timeTrackerIndex, setTimeTrackerIndex] = useState(-1);

  const [expertEmail, setExpertEmail] = useState({
    emailId: '',
    name: '',
    isEditable: false,
  });
  const dispatch = useDispatch();
  const { manageQueryData, manageQueryDataLoading } = useSelector(
    (state) => state?.purchaseExpertReducer
  );
  const expertEmailList = useSelector(
    (state) => state?.purchaseExpertReducer?.expertEmailList
  );
  const addTimeTrackerLoading = useSelector(
    (state) => state?.purchaseExpertReducer?.addTimeTrackerLoading
  );
  const docUploadedLoading = useSelector(
    (state) => state?.myAccountReducer?.docUploadedLoading
  );
  const assignExpertPending = useSelector(
    (state) => state?.purchaseExpertReducer?.assignExpertPending
  );
  const timeTrackerData = useSelector(
    (state) => state?.purchaseExpertReducer?.timeTrackerData
  );
  const imageURL = useSelector((state) => state?.myAccountReducer?.imageURL);
  const isLoading = useSelector((state) => state?.myAccountReducer?.isLoading);
  const uploadFileError = useSelector(
    (state) => state?.myAccountReducer?.uploadFileError
  );
  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    dispatch(getExpertEmailList());
  }, []);

  useEffect(() => {
    if (timeTrackerData) {
      if (timeTrackerIndex >= 0) {
        const tempTimeTrackerValues = [...timeTrackerValues];
        tempTimeTrackerValues.splice(timeTrackerIndex, 1, timeTrackerData);

        let tempBillableHour = tempTimeTrackerValues.reduce(
          (acc, curr) => {
            if (curr.hours !== '' && curr.minutes !== '') {
              acc.totalHours += curr.hours;
              acc.totalMinutes += curr.minutes;

              if (!curr.isBillableExcluded) {
                acc.billableHours += curr.hours;
                acc.billableMinutes += curr.minutes;
              }
            }

            return acc;
          },
          {
            totalHours: 0,
            totalMinutes: 0,
            billableHours: 0,
            billableMinutes: 0,
          }
        );

        tempBillableHour = {
          totalHours:
            tempBillableHour.totalHours +
            convertMinToHours(tempBillableHour.totalMinutes).hours,
          totalMinutes: convertMinToHours(tempBillableHour.totalMinutes)
            .minutes,
          billableHours:
            tempBillableHour.billableHours +
            convertMinToHours(tempBillableHour.billableMinutes).hours,
          billableMinutes: convertMinToHours(tempBillableHour.billableMinutes)
            .minutes,
        };

        setTimeTrackerValues(tempTimeTrackerValues);
        setTimeTrackerIndex(-1);
        setBillableHours(tempBillableHour);
      }
    }
  }, [timeTrackerData]);

  useEffect(() => {
    if (manageQueryData?.timeTrackers?.length > 0) {
      setTimeTrackerValues(manageQueryData?.timeTrackers);
    } else {
      setTimeTrackerValues([
        {
          activity: '',
          hours: '',
          minutes: '',
          isBillableExcluded: false,
          isEditable: true,
        },
      ]);
    }

    if (manageQueryData?.expertUser) {
      setExpertEmail({
        ...expertEmail,
        emailId: manageQueryData.expertUser?.emailId,
      });
    } else {
      setExpertEmail({
        emailId: '',
        name: '',
        isEditable: false,
      });
    }

    if (manageQueryData?.noteForInternalView) {
      setInitialValues((prevState) => ({
        ...prevState,
        noteForInternalView: manageQueryData.noteForInternalView,
      }));
    } else {
      setInitialValues((prevState) => ({
        ...prevState,
        noteForInternalView: '',
      }));
    }
  }, [manageQueryData]);

  useEffect(() => {
    dispatch(getManageQueryDetails({ id }));
  }, [id]);

  useEffect(() => {
    if (!isLoading && uploadFileError) {
      props.notify(uploadFileError.data || 'Failed to upload file');
      dispatch(callUploadProfilePicAPI({ success: true }));
    }
  }, [uploadFileError]);

  useEffect(() => {
    setExpertEmails(
      expertEmailList?.map((x) => {
        return {
          ...x,
          id: x.emailId,
          value: x.emailId,
          isDisable: false,
        };
      })
    );
  }, [expertEmailList]);

  useEffect(() => {
    if (manageQueryData?.queryEstimate) {
      setInitialValues((prevState) => ({
        ...prevState,
        estimateHours: manageQueryData?.queryEstimate?.hours,
        estimateMinutes: manageQueryData?.queryEstimate?.minutes,
        estimateNoteForUser: manageQueryData?.queryEstimate?.noteForUser,
        userCancellationNote:
          manageQueryData?.queryEstimate?.userCancellationNote,
        isEditable: false,
      }));
    } else {
      setInitialValues((prevState) => ({
        ...prevState,
        estimateHours: '',
        estimateMinutes: '',
        estimateNoteForUser: '',
        userCancellationNote: '',
        isEditable: true,
      }));
    }
  }, [manageQueryData?.queryEstimate]);

  useEffect(() => {
    if (manageQueryData?.timetrackerTotaltime) {
      setBillableHours((prevState) => ({
        ...prevState,
        totalHours: manageQueryData?.timetrackerTotaltime?.totalHours,
        totalMinutes: manageQueryData?.timetrackerTotaltime?.totalMinutes,
        billableHours:
          manageQueryData?.timetrackerTotaltime?.totalBillableHours,
        billableMinutes: manageQueryData?.timetrackerTotaltime?.totalMinutes,
      }));
    } else {
      setBillableHours((prevState) => ({
        ...prevState,
        totalHours: 0,
        totalMinutes: 0,
        billableHours: 0,
        billableMinutes: 0,
      }));
    }
  }, [manageQueryData?.timetrackerTotaltime]);

  const isInputNumber = (fieldName, fieldValue) => {
    if (fieldValue === '') {
      return true;
    } else if (/^[0-9]*$/.test(fieldValue)) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (i, e) => {
    let { name, value } = e.target;

    if (name === 'minutes' || name === 'hours') {
      if (!isInputNumber(name, value)) {
        return;
      }
    }

    if (name === 'activity' && value.length > 90) {
      props.notify('Character limit exceeded');
      return;
    }

    let newFormValues = [...timeTrackerValues];
    newFormValues[i][e.target.name] = value;
    setTimeTrackerValues(newFormValues);
  };

  const handleChangeValues = (e) => {
    const { name, value } = e.target;
    if (name === 'estimateMinutes' || name === 'estimateHours') {
      if (!isInputNumber(name, value)) {
        return;
      }
    }
    setInitialValues({
      ...initialValues,
      [e.target.name]: value,
    });
  };
  const addTimeTrackerFields = () => {
    setTimeTrackerValues([
      ...timeTrackerValues,
      {
        activity: '',
        hours: '',
        minutes: '',
        isBillableExcluded: false,
        isEditable: true,
      },
    ]);
  };

  const saveTimetrackerDetails = (index, element, value) => {
    const { isEditable, ...data } = value;
    const tempTimeTrackerValues = [...timeTrackerValues];
    if (value.id) {
      dispatch(updateTimetrackerDetails(data));
      if (value.activity === '' || value.hours === '' || value.minutes === '') {
        return;
      }
    } else {
      dispatch(addTimetrackerDetails({ ...data, queryId: id }));
      if (value.activity === '' || value.hours === '' || value.minutes === '') {
        return;
      }
    }
    setTimeTrackerIndex(index);
  };

  const handleClickEdit = (i, e) => {
    let newFormValues = [...timeTrackerValues];
    let isEditable = true;
    if (newFormValues[i].isEditable) {
      isEditable = false;
    }
    newFormValues[i] = { ...newFormValues[i], isEditable };
    setTimeTrackerValues(newFormValues);
  };

  const handleClickEstimateEdit = async (e) => {
    let newFormValues = { ...initialValues };
    newFormValues.isEditable = true;
    setInitialValues(newFormValues);
  };

  const handleSaveEstimate = async () => {
    let newFormValues = { ...initialValues };
    if (
      newFormValues.estimateHours &&
      newFormValues.estimateMinutes &&
      newFormValues.estimateNoteForUser.trim()
    ) {
      let temp = {};
      temp['QueryId'] = id;
      temp['Hours'] = newFormValues.estimateHours;
      temp['Minutes'] = newFormValues.estimateMinutes;
      temp['NoteForUser'] = newFormValues.estimateNoteForUser;
      temp['StatusId'] = manageQueryData?.queryStatusId;
      if (manageQueryData?.queryEstimate?.id) {
        temp['id'] = manageQueryData?.queryEstimate?.id;
        await dispatch(updateEstimation({ temp }));
        props.notify('Estimation Updated Successfully');
        newFormValues.isEditable = false;
      } else {
        await dispatch(addEstimation({ temp }));
        props.notify('Estimation Added Successfully');
      }
      await dispatch(getManageQueryDetails({ id }));
      setInitialValues(newFormValues);
    } else {
      props.notify('Please fill the details');
    }
  };

  const handleChangeUploadDoc = async (e) => {
    if (imageURL?.originalFileName) {
      props.notify('Please upload selected file');
    } else {
      const data = new FormData();
      data.append('file', e.target.files[0]);
      await dispatch(callUploadProfilePicAPI({ data }));
    }
    hiddenFileInput.current.value = '';
  };
  const handleClickUploadDoc = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChangeCheckBox = (index, e, value) => {
    // debugger;
    const data = [...timeTrackerValues];
    data[index].isBillableExcluded = e.target.checked;
    setTimeTrackerValues(data);
  };

  const uploadfile = async (e) => {
    if (imageURL?.id) {
      let temp = {};
      temp['QueryId'] = id;
      temp['UploadId'] = imageURL?.id;
      temp['OriginalFileName'] = imageURL?.originalFileName;
      await dispatch(uploadDocument({ temp }));
      await dispatch(getManageQueryDetails({ id }));
    }
  };

  const handleClickAssignExpert = async (isDisplay) => {
    if (expertEmail.emailId) {
      let emailId = expertEmail.emailId;
      await dispatch(assignToExpert({ id, emailId }));
      props.notify('Email Assigned Successfully');
      setIsDisplay(false);
    } else {
      props.notify('Please Select Email Id');
      return;
    }
    await dispatch(getManageQueryDetails({ id }));
  };

  const handleCancel = () => {
    setInitialValues({
      ...initialValues,
      estimateHours: '',
      estimateMinutes: '',
      estimateNoteForUser: '',
      noteForInternalView: '',
      isEditable: true,
    });
  };

  const handleClickAssignExpertEdit = (isDisplay) => {
    setIsDisplay(!isDisplay);
  };

  const updateExpertDropdown = (id) => {
    let value = expertEmails.filter((x) => x.id == id);
    setExpertEmail({
      ...expertEmail,
      emailId: value[0].emailId,
    });
  };

  const handleDrop = (files) => {
    const data = new FormData();
    data.append('file', files[0]);
    dispatch(callUploadProfilePicAPI({ data }));
  };

  const addNoteForInternalView = async () => {
    let data = {
      queryId: id,
      note: initialValues?.noteForInternalView.trim(),
    };
    if (initialValues?.noteForInternalView.trim() === '') {
      props.notify('Please add note');
    } else {
      await dispatch(postNoteForInternalView({ data }));
      setInitialValues({
        ...initialValues,
        noteForInternalView: initialValues.noteForInternalView.trim(),
      });
      props.notify('Note Added Successfully');
    }
  };

  const onDeleteUploadedDocument = async (type, item) => {
    if (type === 'internal') {
      await dispatch(callUploadProfilePicAPI({ success: true }));
    } else {
      setDeleteModal(false);
      setLoading(true);
      let deleteUploadedItem = {};
      if (props.isTestCase) {
        deleteUploadedItem = { data: null };
      } else {
        deleteUploadedItem = await deleteUploadedDocument(item.id);
      }
      if (deleteUploadedItem && deleteUploadedItem.error) {
        props.notify('Failed to delete the document', 3000);
      } else if (
        deleteUploadedItem &&
        (deleteUploadedItem.data || deleteUploadedItem.data === null)
      ) {
        await dispatch(getManageQueryDetails({ id }));
        props.notify('Document deleted successfully', 3000);
      }
      setLoading(false);
    }
  };

  return (
    <div className="loader-enable">
      {(loading || manageQueryDataLoading) && (
        <div className="custom-loader">
          <Loader />
        </div>
      )}
      <SearchHeaderText
        filter={true}
        breadcrumb={true}
        user={userData}
        manageBriefsQuery={true}
        referenceNo={manageQueryData?.referenceNumber}
        viewQueryId={param?.id}
        pageTitle="Manage Query"
      />
      <div
        className="container-fluid"
        data-test="manage-query"
        data-testid="manage-query-page"
      >
        <div className="brief-manage-container">
          <h3>Assign to Expert</h3>
          <div className="ctrl-div" data-test="assignDiv">
            {manageQueryData?.expertUser === null || isDisplay ? (
              <>
                <div className="select-control">
                  <div className="floating custom-manage-brief">
                    <CustomeDropDown
                      className="form-control ld_form-ctrl custome-dropdown"
                      data={expertEmails}
                      placeholder=""
                      noDisable={permissionArray?.includes(
                        constants.PERMISSION_MAPPING.ASSIGN_TO_EXPERT
                      )}
                      value={expertEmail.emailId}
                      onSelect={updateExpertDropdown}
                    />
                    <span className="dropdown_btn_label">
                      Select Email Address
                    </span>
                  </div>
                </div>
                <div className="assign-btn-container">
                  {assignExpertPending ? (
                    <button className="primary-button">
                      <Spinner animation="border" size="sm" />
                    </button>
                  ) : (
                    <button
                      // className="primary-button"
                      className={
                        permissionArray?.includes(
                          constants.PERMISSION_MAPPING.ASSIGN_TO_EXPERT
                        )
                          ? 'primary-button'
                          : 'primary-button disable-btn-manage'
                      }
                      disabled={
                        !permissionArray?.includes(
                          constants.PERMISSION_MAPPING.ASSIGN_TO_EXPERT
                        )
                      }
                      onClick={() => handleClickAssignExpert(isDisplay)}
                      data-test="assign-btn"
                    >
                      Assign
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="row w-100">
                <div className="col-8 d-flex">
                  <p className="expert-email-link mr-2">Assigned to</p>
                  <span className="email-link">{expertEmail.emailId}</span>
                </div>
                <div className="col-2">
                  <button
                    // className="expert-email-change-btn"
                    data-testid="handle-ask-expert"
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.ASSIGN_TO_EXPERT
                      )
                        ? 'expert-email-change-btn'
                        : 'expert-email-change-btn a-disabled'
                    }
                    onClick={() => handleClickAssignExpertEdit(isDisplay)}
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* <div className="ctrl-div">
            <div className="select-control">
              <h3>Schedule kick off meeting with requestor</h3>
            </div>
            <div className="assign-btn-container">
              <span>Hide</span>
            </div>
          </div>
          <div className="ctrl-div">
            <button className="schedule-btn">Schedule Meeting</button>
          </div> */}
          {/* <div className="ctrl-div">
          <h3>Add a note for the user</h3>
          </div>
          <div className="ctrl-div">
            <textarea 
            className="form-control text-area"

            ></textarea>
          </div> */}
          {/* <div className="btn-wrapper-query">
              <button className="secondary-gray-button">Cancel</button>
              <button className="primary-button">Send</button>
            </div> */}
          <div className="estimate-container" data-test="estimate-div">
            <h3>Estimate</h3>
            <h1>
              All estimations greater than 10 hours will be sent to the client
              for approval. Do not proceed with researching the query until the
              client has approved this amount.
            </h1>
            <div>
              <div className="row align-items-end">
                <div className="col">
                  <div className="row">
                    <div className="col-sm-2">
                      <div className="label-in-textxtfield">
                        <TextFieldComponent
                          type="text"
                          id="estimateHours"
                          testid="estimateHours"
                          name="estimateHours"
                          inputClassName={
                            permissionArray?.includes(
                              constants.PERMISSION_MAPPING.MANAGE_QUERY
                            ) || initialValues.isEditable
                              ? 'input-disable'
                              : 'a-disabled'
                          }
                          value={initialValues.estimateHours}
                          onChange={handleChangeValues}
                          // inputClassName="input-disable"
                          isDisable={
                            !initialValues.isEditable ||
                            // manageQueryData?.queryEstimate != null &&
                            !permissionArray?.includes(
                              constants.PERMISSION_MAPPING.MANAGE_QUERY
                            )
                          }
                        />
                        <span>hrs</span>
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <div className="label-in-textxtfield">
                        <TextFieldComponent
                          type="text"
                          id="estimateMinutes"
                          name="estimateMinutes"
                          testid="estimateMinutes"
                          value={initialValues.estimateMinutes}
                          onChange={handleChangeValues}
                          // inputClassName="input-disable"
                          inputClassName={
                            permissionArray?.includes(
                              constants.PERMISSION_MAPPING.MANAGE_QUERY
                            ) || initialValues.isEditable
                              ? 'input-disable'
                              : 'a-disabled'
                          }
                          isDisable={
                            !initialValues.isEditable ||
                            // manageQueryData?.queryEstimate != null &&
                            !permissionArray?.includes(
                              constants.PERMISSION_MAPPING.MANAGE_QUERY
                            )
                          }
                        />
                        <span>mins</span>
                      </div>
                    </div>
                    {!initialValues.isEditable ? (
                      // && manageQueryData?.queryEstimate != null
                      <>
                        <div className="col-3 ml-auto">
                          <div className="tracker-time">
                            <span className="text-muted"> Updated by </span>
                            <br />
                            <span>
                              {manageQueryData?.expertUser?.fullName} &nbsp;
                              {moment(manageQueryData?.updatedAt).format(
                                'MM/DD'
                              )}
                            </span>
                          </div>
                          <div className="col-2">
                            <div
                              // className="tracker-edit"
                              data-test="tracker-edit-btn"
                              data-testid="tracker-edit-btn"
                              className={
                                permissionArray?.includes(
                                  constants.PERMISSION_MAPPING.MANAGE_QUERY
                                )
                                  ? 'tracker-edit'
                                  : 'a-disabled'
                              }
                              onClick={(e) => handleClickEstimateEdit(e)}
                            >
                              Edit
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="top-margin-heading">Add a note for the user</h3>
            <textarea
              className="form-control input-disable text-area note-css"
              value={initialValues.estimateNoteForUser}
              name="estimateNoteForUser"
              data-testid="estimateNoteForUser"
              onChange={handleChangeValues}
              disabled={
                !initialValues.isEditable ||
                // manageQueryData?.queryEstimate != null
                !permissionArray?.includes(
                  constants.PERMISSION_MAPPING.MANAGE_QUERY
                )
              }
            />
            <div className="btn-wrapper-query">
              {initialValues.isEditable ? (
                // || manageQueryData?.queryEstimate == null
                <>
                  <button
                    // className="secondary-gray-button"
                    data-testid="cancel-btn"
                    disabled={
                      !permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                    }
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                        ? 'secondary-gray-button'
                        : 'secondary-gray-button disable-btn-manage'
                    }
                    onClick={() => handleCancel()}
                  >
                    Cancel
                  </button>
                  <button
                    // className="primary-button"
                    data-testid="save-estimation-btn"
                    disabled={
                      !permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                    }
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                        ? 'primary-button'
                        : 'primary-button disable-btn-manage'
                    }
                    onClick={(e) => handleSaveEstimate(e)}
                    data-test="save-estimate-btn"
                  >
                    Send
                  </button>
                </>
              ) : manageQueryData?.queryEstimate?.statusId === 3 ? (
                <div className="query-status-progress">
                  {manageQueryData?.queryEstimate?.status}
                </div>
              ) : manageQueryData?.queryEstimate?.statusId === 1 ? (
                <div className="text-link">
                  <img src={check} className="mr-15" />
                  {manageQueryData?.queryEstimate?.status}
                </div>
              ) : (
                ''
              )}
            </div>
            {initialValues.userCancellationNote ? (
              <>
                <h3 className="top-margin-heading">
                  Cancellation note from user
                </h3>
                <textarea
                  className="form-control input-disable text-area note-css"
                  value={initialValues.userCancellationNote}
                  disabled={true}
                />
              </>
            ) : (
              ''
            )}
          </div>

          <div className="time-tracker" data-test="timeTrackerEntry">
            <div className="header ">
              <h3>Time Tracker</h3>
            </div>
            <div className="header">
              <h3>Total Time</h3>
            </div>
            <div className="header">
              <input
                type="text"
                className="time-input-light form-control"
                value={
                  (billableHour.totalHours || 0) +
                  ' hrs ' +
                  (billableHour.totalMinutes || 0) +
                  ' mins '
                }
              />
            </div>
            <div className="header">
              <h3>Billable Time</h3>
            </div>
            <div className="header">
              <input
                type="text"
                className="time-input form-control"
                value={
                  (billableHour.billableHours || 0) +
                  ' hrs ' +
                  (billableHour.billableMinutes || 0) +
                  ' mins '
                }
              />
            </div>
          </div>
          {timeTrackerValues?.map((element, index) => {
            return (
              <div className="time-tracker p-0 py-3" key={index}>
                <div className="controls position-relative">
                  <TextFieldComponent
                    type="text"
                    id="expiration"
                    testid="expiration"
                    data-test="expiration"
                    placeholder="Expiration"
                    label="Activity*"
                    name="activity"
                    dataContent="Activity*"
                    value={element.activity}
                    onChange={(e) => handleChange(index, e)}
                    isDisable={
                      !element.isEditable ||
                      !permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                    }
                  />
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      name="isBillableExcluded"
                      data-testid="isBillableExcluded"
                      checked={element.isBillableExcluded}
                      value={element.isBillableExcluded}
                      disabled={
                        !element.isEditable ||
                        !permissionArray?.includes(
                          constants.PERMISSION_MAPPING.MANAGE_QUERY
                        )
                      }
                      onChange={(e) => handleChangeCheckBox(index, e, element)}
                    />
                    <label>Exclude from billable hours</label>
                  </div>
                  <div className="text-count">{`Characters left : ${
                    90 - element?.activity?.length
                  }`}</div>
                </div>
                <div className="controls">
                  <TextFieldComponent
                    type="text"
                    id="hours"
                    testid="hours"
                    data-test="hours"
                    data-test="hours"
                    name="hours"
                    placeholder="Expiration"
                    label="Activity*"
                    dataContent="Duration*"
                    value={element.hours}
                    onChange={(e) => handleChange(index, e)}
                    isDisable={
                      !element.isEditable ||
                      !permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                    }
                  />
                  <span>hrs</span>
                </div>
                <div className="controls">
                  <TextFieldComponent
                    type="text"
                    id="minutes"
                    testid="minutes"
                    data-test="minutes"
                    name="minutes"
                    placeholder="Expiration"
                    label="Activity*"
                    dataContent="Duration*"
                    value={element.minutes}
                    onChange={(e) => handleChange(index, e)}
                    isDisable={
                      !element.isEditable ||
                      !permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                    }
                  />
                  <span>mins</span>
                </div>

                {element.isEditable ? (
                  <>
                    <div className="controls">
                      {addTimeTrackerLoading && timeTrackerIndex === index ? (
                        <button>
                          <Spinner animation="border" size="sm" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) =>
                            saveTimetrackerDetails(index, e, element)
                          }
                          data-test="saveTimetracker"
                          data-testid="saveTimetracker"
                          className={
                            permissionArray?.includes(
                              constants.PERMISSION_MAPPING.MANAGE_QUERY
                            )
                              ? ''
                              : 'a-disabled'
                          }
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tracker-time">
                      Updated by <br />
                      <span>
                        {manageQueryData?.expertUser?.fullName} &nbsp;
                        {moment(manageQueryData?.updatedAt).format('MM/DD')}
                      </span>
                    </div>
                    <div
                      // className="tracker-edit"
                      data-testid="editTimetracker"
                      className={
                        permissionArray?.includes(
                          constants.PERMISSION_MAPPING.MANAGE_QUERY
                        )
                          ? 'tracker-edit'
                          : 'a-disabled'
                      }
                      onClick={(e) => handleClickEdit(index, e)}
                    >
                      Edit
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div
            // className="add_instance"
            className={
              permissionArray?.includes(
                constants.PERMISSION_MAPPING.MANAGE_QUERY
              ) && !timeTrackerValues.find((val) => !val.id)
                ? 'add_instance'
                : 'add_instance a-disabled'
            }
            onClick={() => addTimeTrackerFields()}
          >
            Add Instance
          </div>

          <div className="internal_view">
            <div className="internal_view_header">
              <h3>Notes for internal view</h3>
              <button
                onClick={addNoteForInternalView}
                className={
                  permissionArray?.includes(
                    constants.PERMISSION_MAPPING.MANAGE_QUERY
                  )
                    ? ''
                    : 'a-disabled'
                }
                data-test="addNoteBtn"
              >
                Save
              </button>
            </div>
            <div className="internal_view_container" data-test="addNoteDiv">
              <textarea
                className={
                  permissionArray?.includes(
                    constants.PERMISSION_MAPPING.MANAGE_QUERY
                  )
                    ? 'form-control text-area'
                    : 'form-control text-area a-disabled'
                }
                name="noteForInternalView"
                value={initialValues.noteForInternalView}
                onChange={handleChangeValues}
              />
            </div>
          </div>
          <DropToUpload
            className={
              permissionArray?.includes(
                constants.PERMISSION_MAPPING.MANAGE_QUERY
              )
                ? ''
                : 'a-disabled'
            }
            onDrop={handleDrop}
          >
            <div className="upload-section">
              <h3 className="text-left">Upload Documents</h3>
              <div className="drop-box">
                <div className="upload_ico"></div>
                <h3>Drag and Drop files here</h3>
                <h1>Or</h1>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={hiddenFileInput}
                  data-testid="document-upload-input"
                  multiple
                  accept=".png, .jpg, .jpeg, .gif, .svg, .xlsx, .xls, .pdf, .doc, .docx, .xml, .csv, .txt"
                  onChange={handleChangeUploadDoc}
                />
                {isLoading ? (
                  <>
                    <button>
                      <Spinner animation="border" size="sm" />
                    </button>
                  </>
                ) : (
                  <button
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.MANAGE_QUERY
                      )
                        ? ''
                        : 'a-disabled'
                    }
                    onClick={handleClickUploadDoc}
                    data-test="upload"
                  >
                    Choose File
                  </button>
                )}
              </div>
            </div>
          </DropToUpload>
          <div data-test="uploadDiv">
            {manageQueryData?.uploads?.map((uploadedFiles, index) => {
              return (
                <div className="upload-list" key={index}>
                  <div className="list_items">
                    <div className="document_name">
                      {uploadedFiles?.originalFilename}
                      <span
                        data-testid="external-delete-btn"
                        onClick={() =>
                          setDeleteModal({ active: true, ...uploadedFiles })
                        }
                      ></span>
                    </div>
                    <div className="btn-ctrl">
                      <button className="completed-button">uploaded</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {imageURL?.originalFileName ? (
              <div className="upload-list">
                <div className="list_items">
                  <div className="document_name">
                    {imageURL?.originalFileName}
                    <span
                      data-testid="internal-delete-btn"
                      onClick={() =>
                        onDeleteUploadedDocument('internal', imageURL)
                      }
                    ></span>
                  </div>
                  <div className="btn-ctrl">
                    {docUploadedLoading ? (
                      <button className="primary-button">
                        <Spinner animation="border" size="sm" />
                      </button>
                    ) : (
                      <button
                        className="primary-button"
                        onClick={uploadfile}
                        data-testid="upload-file-btn"
                      >
                        upload
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal?.active || false}
        onCancelClick={() => setDeleteModal(false)}
        filename={deleteModal?.originalFilename || ''}
        onDelete={() => onDeleteUploadedDocument('external', deleteModal)}
      />
    </div>
  );
};

export default ManageQuery;
