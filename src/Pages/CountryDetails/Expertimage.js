import React from 'react';
import { useState } from 'react';
import profile_img from '../../assets/images/dp.jpeg';
import constants from '../../utils/constants';
// import OpenModal from '../Settings/OpenModal';
import AskanExpertModal from './AskanExpertModal';
import { permissionMapping, userDetailsMixpnel } from '../../utils/utils';
import { getExpertHours } from "../../Store/reducers/country";
import { useDispatch } from "react-redux";
import HeadsUpPopup from '../headsUpPopup';
import { getUserProfile } from '../../utils/storage';

/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */

const Expertimage = (props) => {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [expertHoursModal, setExpertHoursModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const userProfile = getUserProfile()
  const getExpertImage = (expertData) => {
    let imageContent = expertData?.[0]?.topics?.length
      ? expertData[0].topics.find(
        (item) =>
          item.topicName === 'Expert Pic-' + expertData[0].supertopicName
      )
      : null;

    return imageContent?.topicContent;
  };
  let profile_name = '';
  let profile_img_link = '';
  if (props.card_data != '') {
    profile_name = props.card_data?.length
      ? props.card_data[0].supertopicName
      : '';
    profile_img_link = getExpertImage(props.card_data)
      ? `${constants.IMAGE.DOWNLOAD}${getExpertImage(props.card_data)}`
      : profile_img;
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setShowHelp(false);
  };
  const openModal = async () => {
    const exportCount = await getExpertHours(dispatch);
    if (exportCount && exportCount.availableHours != null && exportCount.availableHours !== "") {
      if (Number(exportCount.availableHours) >= 10) {
        setExpertHoursModal(false);
        setShowModal(true);
      } else if (!exportCount?.error) {
        setExpertHoursModal(true);
      } else {
        props.notify('Failed to validate your availability!')
      }
    }
  };
  const permissionArray = permissionMapping();
  return (
    <div className="col-lg-4 gutter-card" data-test="Expertimage">
      <div className="Expert-team-wrapper">
        <div className="blue-header-section">
          <h3>Ask Our Team of Experts</h3>
        </div>
        <div className="expert-wrapper">
          <img src={profile_img_link ? profile_img_link : profile_img} />
          <h3>{profile_name}</h3>
          <h5>Legal & HR Researcher</h5>

          <a
            
            className={
              permissionArray?.includes(
                constants.PERMISSION_MAPPING.SUBMIT_QUERY
              )
                ? props.card_data
                  ? 'btn btn-primary'
                  : 'a-disabled btn-primary'
                : 'a-disabled btn-primary'
            }
            onClick={props.card_data && permissionArray?.includes(
              constants.PERMISSION_MAPPING.SUBMIT_QUERY
            ) ? () => {
              mixpanel.track('Ask a question', {
                'Content Country Name': props.countryName,
                'User Details': userDetailsMixpnel()
              })
              openModal()
            } : ''}
          >
            <span>Ask a Question</span>
          </a>

          
        </div>
      </div>
      <AskanExpertModal
        isOpen={showModal}
        onCancelClickListner={handleCloseModal}
        askAnExpert={true}
        dialogClassName="doc-modal"
        notify={props.notify}
        expertDetails={props?.card_data[0]}
        showHelp={showHelp}
        countryName={props.countryName}
        countryId={props.countryId}
        setShowHelp={setShowHelp}
      />

      <HeadsUpPopup
        isOpen={expertHoursModal}
        closeModal={() => setExpertHoursModal(false)}
      />
    </div>
  );
};

export default Expertimage;
