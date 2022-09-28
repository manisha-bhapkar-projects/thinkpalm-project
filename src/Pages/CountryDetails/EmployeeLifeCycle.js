import React, { useState } from 'react'
import magnet from "../../assets/images/magnet.svg"
import handshake from "../../assets/images/hadnshake.svg"
import retain from "../../assets/images/retain.svg"
import offboard from "../../assets/images/offboard.svg"
import arrow_lc from "../../assets/images/arrow-lc.svg"
import download_btn from "../../assets/images/download-btn.svg"
import constants from '../../utils/constants';
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from '../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const EmployeeLifeCycle=(props)=>{
const [seeMore,setSeeMore]=useState(false)
const handleSee=()=>{
    setSeeMore(!seeMore)
}
    return(

        <div className="tab-section" data-test="employee">
              <div className="">
                  <h3>Employee Lifecycle</h3>
              </div>
              <div className="tab-2-container">
                <div className="row">
                  <div className="col-md-3 position-relative">
                    <div className="nxt-arrow"><img src={arrow_lc}></img></div>

                    <div className="round-136 green">
                    <img src={magnet}></img>
                    <span>attract</span>
                    </div>
                    {/*<a href="" className="download-btn">
                          <span>Download</span>
                          <img src={download_btn}></img>
                        </a> */}
                    <div className="tab-2-contents">
                      <ul>
                      {
                          !seeMore&&props.attract&&
                        props?.attract?.map((attractItem,index)=>{
                            if(index<3)
                            return(
                              <div key={index}>
                                <li onClick={() =>
                                    {
                                      props.onClickLifecycle(attractItem, props.attractId);
                                      mixpanel.track('Attract', {'Content Link Name': attractItem.supertopicName,
                                                                  'User Details':userDetailsMixpnel()});
                                    } 
                                  }
                                  data-test="attract"
                                  >
                                  {attractItem.supertopicName}</li>
                                </div>
                            )
                        })
                     }
                     {
                        seeMore&&props.attract&&
                      props?.attract?.map((attractItem,index)=>{
                        
                          return(
                              <li key={index} onClick={() => 
                                {
                                  props.onClickLifecycle(attractItem, props.attractId);
                                  mixpanel.track('Attract', {'Content Link Name': attractItem.supertopicName,
                                  'User Details':userDetailsMixpnel()});
                                }
                                
                              }
                              data-test="attract1"
                              >
                              {attractItem.supertopicName}</li>
                          )
                      })
                   }
                       
                      </ul>
                    </div>
                    
                  </div>
                  <div className="col-md-3 position-relative">
                    <div className="nxt-arrow"><img src={arrow_lc}></img></div>

                    <div className="round-136 aquagreen">
                    <img src={handshake}></img>
                    <span>Onboard</span>
                    </div>

                    <div className="tab-2-contents">
                      <ul>
                       {
                          !seeMore&&props.onBoard&&props?.onBoard.map((onBoardItems,index)=>{
                              if(index<3)
                               return(
                                   <li key={index} onClick={() => 
                                      {
                                        props.onClickLifecycle(onBoardItems, props.onBoardId);
                                        mixpanel.track('Onboard', {'Content Link Name': onBoardItems.supertopicName,
                                        'User Details':userDetailsMixpnel()});
                                      }
                                    }
                                    data-test="onBoard"
                                    >
                                    {onBoardItems.supertopicName}</li>
                                   
                               )
                           })
                       }
                       {
                        seeMore&&props.onBoard&&props?.onBoard.map((onBoardItems,index)=>{
                           
                             return(
                                 <li key={index} onClick={() => 
                                    {
                                      props.onClickLifecycle(onBoardItems, props.onBoardId);
                                      mixpanel.track('Onboard', {'Content Link Name': onBoardItems.supertopicName,
                                      'User Details':userDetailsMixpnel()});
                                    }
                                  
                                  }
                                  data-test="onBoard1"
                                  >
                                  {onBoardItems.supertopicName}</li>
                             )
                         })
                     }
                      </ul>
                    </div>
                    
                  </div>
                  <div className="col-md-3 position-relative">
                    <div className="nxt-arrow"><img src={arrow_lc}></img></div>

                    <div className="round-136 blue">
                    <img src={retain}></img>
                    <span>Develop <br/>& Retain</span>
                    </div>

                    <div className="tab-2-contents">
                      <ul>
                       {
                          !seeMore&&props.develop&&props.develop.map((devItems,index)=>{
                              if(index<3)
                               return(
                                   <li key={index} onClick={() => 
                                    {
                                      props.onClickLifecycle(devItems, props.developId);
                                      mixpanel.track('Develop and Retain', {'Content Link Name': devItems.supertopicName,
                                      'User Details':userDetailsMixpnel()});
                                    }
                                    
                                  }
                                  data-test="develop"
                                  >
                                  {devItems.supertopicName}</li>
                               )
                           })
                       }
                       {
                        seeMore&&props.develop&&props.develop.map((devItems,index)=>{
                             return(
                                 <li key={index} onClick={() => 
                                  {
                                    props.onClickLifecycle(devItems,  props.developId);
                                    mixpanel.track('Develop and Retain', {'Content Link Name': devItems.supertopicName,
                                    'User Details':userDetailsMixpnel()});
                                  }
                                  
                                }
                                data-test="develop1"
                                >
                                {devItems.supertopicName}</li>
                             )
                         })
                     }
                      </ul>
                    </div>
                    
                  </div>
                  <div className="col-md-3 position-relative">
                    

                    <div className="round-136 orange">
                    <img src={offboard}></img>
                    <span>Offboard</span>
                    </div>

                    <div className="tab-2-contents">
                      <ul>
                       {
                          !seeMore&&props.offBoard&&props.offBoard.map((offItems,index)=>{
                               if(index<3){
                                return(
                                    <li key={index} onClick={() => 
                                      {
                                        props.onClickLifecycle(offItems,  props.offBoardId);
                                        mixpanel.track('Offboard', {'Content Link Name': offItems.supertopicName,
                                        'User Details':userDetailsMixpnel()});
                                      }
                                      
                                    }
                                    data-test="offBoard"
                                    >
                                    {offItems.supertopicName}</li>
                                )
                               }
                              
                           })
                       }
                       {
                        seeMore&&props.offBoard&&props.offBoard.map((offItems,index)=>{
                              return(
                                  <li key={index} onClick={() => 
                                    {
                                      props.onClickLifecycle(offItems, props.offBoardId);
                                      mixpanel.track('Offboard', {'Content Link Name': offItems.supertopicName,
                                      'User Details':userDetailsMixpnel()});
                                    }
                                  }
                                  data-test="offBoard1"
                                  >
                                  {offItems.supertopicName}</li>
                              )
                         })
                     }
                      </ul>
                    </div>
                    
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <button className="btn-primary-outline" onClick={handleSee} data-test="handleSee">{!seeMore?"See All":"See Less"}</button>
                  </div>
                </div>
              </div>


            </div>


    )
}
export default EmployeeLifeCycle;