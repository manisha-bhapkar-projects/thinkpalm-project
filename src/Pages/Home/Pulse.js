import React from "react";
import pulse_img from "../../assets/images/Heatmap.svg";
import PulseMap from "./PulseMap";
import { toNumber, round } from "lodash";
import upArrow from "../../assets/images/bi_arrow-down.svg"
import constants from "../../utils/constants";
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from "../../utils/utils";
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const Pulse = (props) => {
  const {
    activePulseTab,
    setActivePulseTab,
    pulseMapContent,
    activePulseTabLoader,
    pulseBoxContent
  } = props;
  const q = pulseMapContent ? pulseMapContent[activePulseTab] : [];
  let activePulseTabContent = [];
  q?.map((i) => {
    activePulseTabContent.push({
      id: i.id,
      value: toNumber(i.value),
    });
  });
  return (
    <div className="container-fluid" data-test="Pulse">
      <div className="row">
        <div className="header_wrapper pulse-header col-12">
          <h2>Pulse</h2>
        </div>
      </div>
      <div className="row">
        <div className="tab-section col-12 mb-5">
          <div className="tab-header">
            <a
              className={`cursor-pointer ${
                activePulseTab === "gdp" && "active"
              }`}
              onClick={() => 
                {
                  setActivePulseTab("gdp");
                  mixpanel.track('GDP-Per Person Employed',{'User Details':userDetailsMixpnel()});
                }
              }
            >
              GDP - PER PERSON EMPLOYED
            </a>
            <a
              className={`cursor-pointer ${
                activePulseTab === "unemployment" && "active"
              }`}
              onClick={() => 
                {
                  setActivePulseTab("unemployment");
                  mixpanel.track('Unemployment',{'User Details':userDetailsMixpnel()});
                }
              }
            >
              UNEMPLOYMENT
            </a>
            <a
              className={`cursor-pointer ${
                activePulseTab === "easeOfDoingBusiness" && "active"
              }`}
              onClick={() => 
                {
                  setActivePulseTab("easeOfDoingBusiness");
                  mixpanel.track('Ease of Business',{'User Details':userDetailsMixpnel()});
                }
              }
            >
              EASE OF BUSINESS
            </a>
          </div>
          <div className="tab-content-container">
            <div className="section-1">
              {/* <img src={pulse_img} data-test="pulse-img" /> */}
              {activePulseTabContent.length && !activePulseTabLoader ? (
                <PulseMap activePulseTabContent={activePulseTabContent} activePulseTab={activePulseTab}/>
              ) : (
                "Loading"
              )}
              <div className="section-info">
              <div className='global-trends'>Global Trends</div>
                <div className="info_container">
                  <h6>{pulseBoxContent?.gdp?.year} GDP Per Person Employed</h6>
                  <h2>${round((toNumber(pulseBoxContent?.gdp?.value||0)/1000), 1)}K</h2>
                  <div className="trending">
                    <img src={upArrow} data-test="upArrow" />
                    <span>{pulseBoxContent?.gdp?.change}%</span>
                  </div>
                </div>
                <div className="info_container">
                  <h6>{pulseBoxContent?.unemployment?.year} Unemployment</h6>
                  <h2>{(parseFloat(pulseBoxContent?.unemployment?.value).toFixed(2))}%</h2>
                  <div className="trending">
                    <img src={upArrow} data-test="upArrow" />
                    <span>{pulseBoxContent?.unemployment?.change}%</span>
                  </div>
                </div>
                <div className="info_container">
                  <h6>{pulseBoxContent?.easeOfDoingBusiness?.year} Ease of Business</h6>
                  <div className="row">
                    <div className="col-md-7">
                      <h2>{pulseBoxContent?.easeOfDoingBusiness?.increase} <sub>Countries</sub></h2>
                      <span>Improved Ease</span>
                    </div>
                    <div className="col-md-5">
                      <h2 className="orang-text">{pulseBoxContent?.easeOfDoingBusiness?.decrease} <sub>Countries</sub></h2>
                      <span>Reduced Ease</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="tab-navigation">
              <a href="#" className="active">
                Unemployment Rate
              </a>
              <span />
              <a href="#">Country Rankings</a>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default Pulse;
