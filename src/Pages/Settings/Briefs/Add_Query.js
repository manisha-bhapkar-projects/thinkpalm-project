import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

/* Icons */
import calender from '../../../assets/images/calendar-ico.svg';

/* Component */
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import ReactDropdown from '../../../Components/CustomeSelectDropDown/reactDropdown';
import { SupportButton } from '../../../Components/SupportButton';
import { getUserProfile } from '../../../utils/storage';
import constants from '../../../utils/constants';
import Loader from '../../../Components/Loader';

/* Action */
import {
  addQuery,
  getAccountList,
  getUserList,
} from '../../../Store/reducers/Purchase_ExpertBriefs';

const AddQuery = (props) => {
  document.title = 'Settings';
  const history = useHistory();
  const [userData, setUserData] = useState();
  const [accountData, setAccountData] = useState([]);
  const [userListData, setUserListData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    AccountId: '',
    AccountName: '',
    UserId: '',
    UserName: '',
    RequestDate: '',
    QueryDetails: '',
  });
  const dispatch = useDispatch();

  const accountList = useSelector(
    (state) => state?.purchaseExpertReducer?.accountList
  );
  const userList = useSelector(
    (state) => state?.purchaseExpertReducer?.userList
  );
  const addQuerySuccess = useSelector(
    (state) => state?.purchaseExpertReducer?.addQuerySuccess
  );
  const accountLoading = useSelector(
    (state) => state?.purchaseExpertReducer?.accountLoading
  );
  const userLoading = useSelector(
    (state) => state?.purchaseExpertReducer?.userListLoading
  );

  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    dispatch(getAccountList());
  }, []);

  useEffect(() => {
    setAccountData(
      accountList?.map((x) => {
        return {
          ...x,
          id: x?.id,
          value: x?.id,
          label: x?.companyName,
        };
      })
    );
  }, [accountList]);

  useEffect(() => {
    setUserListData(
      userList?.map((x) => {
        return {
          ...x,
          id: x?.id,
          value: x?.id,
          label: x?.userProfile?.firstName + ' ' + x?.userProfile?.lastName,
        };
      })
    );
  }, [userList]);

  useEffect(() => {
    if (addQuerySuccess === 200) {
      props.notify('Query Added Successfully');
      dispatch(addQuery({ Success: true }));
    }
  }, [addQuerySuccess]);

  useEffect(async () => {
    let accountId = initialValues.AccountId;
    if (accountId) {
      await dispatch(getUserList(accountId));
    }
  }, [initialValues.AccountId]);

  const handleChangeValues = (e) => {
    const { name, value } = e.target;
    if (name === 'QueryDetails' && value.length > 300) {
      props.notify('Character limit exceeded');
      return;
    }
    setInitialValues({
      ...initialValues,
      [e.target.name]: value,
    });
  };

  const handleAddQuery = async () => {
    if (
      initialValues.UserId &&
      initialValues.AccountId &&
      initialValues.RequestDate &&
      initialValues.QueryDetails.trim()
    ) {
      let data = {
        UserId: initialValues.UserId,
        AccountId: initialValues.AccountId,
        QueryDetails: initialValues.QueryDetails,
        RequestDate: initialValues.RequestDate,
      };
      await dispatch(addQuery({ data }));
      props.notify('Query Added Successfully');
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_BRIEFS);
    } else {
      props.notify('Please fill the details');
    }
  };

  return (
    <div className="loader-enable" data-test="addQuery">
      {(accountLoading || userLoading) && (
        <div className="custom-loader">
          <Loader />
        </div>
      )}
      <div>
        <SearchHeaderText
          filter={true}
          testId="submitaddQuery"
          breadcrumb={true}
          titleHeader={true}
          user={userData}
          AddQuery={true}
          pageTitle="Add Query"
          title="Save"
          onClick={handleAddQuery}
        />
      </div>
      <div
        className="container-fluid add-query-container"
        
      >
        {console.log("acc", accountData)}
        {console.log("user", userListData)}

        <div className="form-wrapper" data-testid="add-query">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <h4>User Info</h4>
              </div>
              <div className="col-lg-4">
                <div className="floating date-picker">
                  <input
                    id="RequestDate"
                    className="floating__input"
                    name="RequestDate"
                    onChange={handleChangeValues}
                    value={initialValues.RequestDate}
                    type="date"
                    placeholder="Select Registration Date"
                    data-testid="RequestDate"
                  />
                  <label
                    htmlFor="RequestDate"
                    className="floating__label"
                    data-content="Request Date*"
                  >
                    <span className="hidden--visually">Request Date*</span>
                  </label>
                  <span>
                    <img className="calender-icon" src={calender} />
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4" data-test="accountDiv">
                <div className="select-control">
                  <div className="floating" data-test="accountDropdown">
                    <ReactDropdown
                      id="AccountName"
                      name="AccountName"
                      placeholder="AccountName"
                      htmlFor="AccountName"
                      testid="AccountName"
                      data_content="Account*"
                      title="Account*"
                      value={initialValues.AccountName}
                      data={accountData ? accountData : []}
                      isDisabled={false}
                      isSearchable={true}
                      Prefilled={initialValues.AccountName}
                      onChange={(value) =>
                        setInitialValues({
                          ...initialValues,
                          AccountName: value,
                          AccountId: value.id,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4" data-test="userDiv">
                <div className="select-control">
                  <div className="floating" data-test="userDropdown">
                    <ReactDropdown
                      id="User"
                      name="User"
                      placeholder="User"
                      htmlFor="User"
                      testid="User"
                      data_content="User*"
                      title="User*"
                      value={initialValues.UserName}
                      data={userListData ? userListData : []}
                      isDisabled={false}
                      isSearchable={true}
                      Prefilled={initialValues.UserName}
                      onChange={(value) =>
                        setInitialValues({
                          ...initialValues,
                          UserName: value,
                          UserId: value?.userProfile?.userId,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-8" data-testid="queryDetails">
              <div className="row">
                <div className="text-area">
                  <textarea
                    className="form-control input-disable text-area"
                    value={initialValues.QueryDetails}
                    name="QueryDetails"
                    onChange={handleChangeValues}
                  />
                  <label>Query Description* </label>
                  <span>
                    {`Characters left : ${
                      300 - initialValues?.QueryDetails?.length
                    }`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SupportButton />
    </div>
  );
};

export default AddQuery;
