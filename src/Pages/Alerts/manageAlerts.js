import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

/* Icon-images */
import backbtn from '../../assets/images/back-btn.svg';

/* Component */
import { getUserProfile } from '../../utils/storage';
import AlertHeaderText from './AlertHeaderText';

/* Action */
import {
  getAlertTypeList,
  updateManageAlert,
} from '../../Store/reducers/ManageAlerts';
import constants from '../../utils/constants';
import Loader from '../../Components/Loader';

const handleCheckox = (isChecked, selectedCheckbox, id) => {
  let tempSelectedCheckbox = [...selectedCheckbox];
  if (isChecked) {
    tempSelectedCheckbox.push(id);
  } else {
    const index = tempSelectedCheckbox.indexOf(id);
    tempSelectedCheckbox.splice(index, 1);
  }
  return tempSelectedCheckbox;
};

const AlertsLandingPage = (props) => {
  const param = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [selectedEmail, setSelectedEmail] = useState([]);
  const [selectedInApp, setSelectedInApp] = useState([]);

  const alertTypeList = useSelector(
    (state) => state?.manageAlertReducer?.alertTypeList
  );
  const updateSuccess = useSelector(
    (state) => state?.manageAlertReducer?.updateSuccess
  );
  const alertTypeListLoading = useSelector(
    (state) => state?.manageAlertReducer?.alertTypeListLoading
  );
  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    dispatch(getAlertTypeList());
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      props.notify('Notification Updated Successfully');
      dispatch(updateManageAlert({ success: true }));
    }
  }, [updateSuccess]);

  useEffect(() => {
    const tempSelectedEmail = [];
    const tempSelectedInApp = [];

    alertTypeList?.map((type) => {
      type?.alertTopics?.map((subType) => {
        subType?.alertTypes?.map((alertType) => {
          if (alertType?.emailNotification) {
            tempSelectedEmail.push(alertType?.id);
          }
          if (alertType?.inAppNotification) {
            tempSelectedInApp.push(alertType?.id);
          }
        });
      });
    });

    setSelectedEmail(tempSelectedEmail);
    setSelectedInApp(tempSelectedInApp);
  }, [alertTypeList]);

  const handleSelectEmail = (e, id) => {
    const { checked } = e.target;
    const tempSelectedEmail = handleCheckox(checked, selectedEmail, id);
    const inAppIndex = selectedInApp.indexOf(id);

    const data = {
      userid: userData?.userid,
      AlertTypeId: id,
      EmailNotification: checked,
      InAppNotification: inAppIndex > -1 ? true : false,
    };

    dispatch(updateManageAlert({ data }));
    setSelectedEmail(tempSelectedEmail);
  };

  const handleSelectInApp = (e, id) => {
    const { checked } = e.target;
    const tempSelectedInApp = handleCheckox(checked, selectedInApp, id);
    const emailIndex = selectedEmail.indexOf(id);

    const data = {
      userid: userData?.userid,
      AlertTypeId: id,
      EmailNotification: emailIndex > -1 ? true : false,
      InAppNotification: checked,
    };

    dispatch(updateManageAlert({ data }));
    setSelectedInApp(tempSelectedInApp);
  };

  return (
    <div className="loader-enable" data-test="manageAlerts">
      {alertTypeListLoading && (
        <div className="custom-loader">
          <Loader />
        </div>
      )}
      <div
        data-test="manage-alerts-page"
        className="manage-alerts-page-container"
      >
        <AlertHeaderText
          firstTitle="Home"
          secondTitle="Knowledge Base"
          thirdTitle="Alerts"
          fourthTitle="Manage Alerts & Notifications"
          pageTitle="Alerts"
        />
        <div className="manage-alerts" data-test="showNotification">
          <div className="main-header">
            <h3>Manage Alerts & Notifications</h3>
            <span
              className="back_btn"
              onClick={() =>
                history.push(constants.ROUTE.KNOWLEDGE_BASE.ALERTS_HOME_PAGE)
              }
              data-test="back_btn"
            >
              <img src={backbtn} alt="" />
            </span>
          </div>
          {alertTypeList?.map((type, index) => {
            return (
              <div
                className="notification-wrapper"
                key={index}
                data-test="notifications"
              >
                <h2>{type.masterName}</h2>
                {type?.alertTopics?.map((subType, sindex) => {
                  return (
                    <div className="content-update" key={sindex}>
                      <h3>{subType?.topicName}</h3>
                      {subType?.alertTypes?.map((item, itemindex) => {
                        return (
                          <div className="update-box" key={itemindex}>
                            <h4>{item?.type}</h4>
                            <h5>{item?.typeDescription}</h5>
                            <div className="Email-update">
                              <div className="checkbox-wrapper">
                                <label className="tab-checkbox ">
                                  <input
                                    name="email"
                                    type="checkbox"
                                    value=""
                                    disabled={item?.disableNotifications}
                                    checked={selectedEmail.includes(item?.id)}
                                    onChange={(e) =>
                                      handleSelectEmail(e, item?.id)
                                    }
                                    data-test="emailClick"
                                  ></input>
                                  <span
                                    className={`${
                                      item?.disableNotifications
                                        ? 'checkmark disabled'
                                        : 'checkmark'
                                    }`}
                                  ></span>
                                  Email
                                </label>
                              </div>
                            </div>
                            <div className="in-app">
                              <div className="checkbox-wrapper">
                                <label className="tab-checkbox">
                                  <input
                                    name="inApp"
                                    type="checkbox"
                                    value=""
                                    disabled={item?.disableNotifications}
                                    checked={selectedInApp.includes(item?.id)}
                                    onChange={(e) =>
                                      handleSelectInApp(e, item?.id)
                                    }
                                    data-test="inAppClick"
                                  ></input>
                                  <span
                                    className={`${
                                      item?.disableNotifications
                                        ? 'checkmark disabled'
                                        : 'checkmark'
                                    }`}
                                  ></span>
                                  In-App
                                </label>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AlertsLandingPage);
