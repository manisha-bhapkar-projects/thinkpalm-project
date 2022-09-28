import React from "react";
import ComingSoon from "../../Components/ComingSoon";
import constants from '../../utils/constants'
export const SupportButton = () => {
  return (
    !constants.CHAT_BOT?  <a className="support-btn " data-test="supportButton">
      <div>
        <ComingSoon direction="right"></ComingSoon>
      </div>
      <div className="btn-bottom-wrap " />
    </a>:""


  );
};


export default React.memo(SupportButton);
