import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import SearchBar from '../../Components/SearchBar';
import constants from '../../utils/constants';

/* Icon-images */
import alertsBanner from '../../assets/images/alerts_bg.jpg';
import { getUserProfile } from '../../utils/storage';

const AlertHeaderText = (props) => {
  const history = useHistory();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
  }, []);
  return (
    <div
      className="ip_header_wrap alerts-page-wrap article-header-wrap"
      data-testid="manage-alerts-page-wrap"
      data-test="alertHeader"
    >
      <div className="ip_banner-img large-banner">
        <img src={alertsBanner} alt="" />
      </div>
      <div>
        <div className="row">
          <SearchBar noRow user={userData} theme="dark" />
          <div className="breadcrumb-w ml-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li
                  className="breadcrumb-item"
                  style={{ color: 'white', cursor: 'pointer' }}
                  onClick={() => history.push(constants.ROUTE.HOME_PAGE.HOME)}
                  data-test="bredcrumbClick"
                >
                  {props.firstTitle}
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                  style={{ color: 'white', cursor: 'pointer' }}
                  onClick={() =>
                    history.push(constants.ROUTE.KNOWLEDGE_BASE.HOME)
                  }
                >
                  {props.secondTitle}
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                  style={{ color: 'white', cursor: 'pointer' }}
                  onClick={() =>
                    history.push(
                      constants.ROUTE.KNOWLEDGE_BASE.ALERTS_HOME_PAGE
                    )
                  }
                >
                  {props.thirdTitle}
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                  style={{ color: 'white', cursor: 'pointer' }}
                >
                  {props.fourthTitle}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="article-title-wrap">
        <h1>{props.pageTitle}</h1>
      </div>
    </div>
  );
};

export default AlertHeaderText;
