import { useEffect, useRef, useState } from 'react';
import { userDetailsMixpnel } from '../../../utils/utils';
import './_specifics.scss';
import { getPublicHolidayList } from '../../../Store/reducers/country';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { stripHtml_fun } from '../../../utils/utils';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { map } from '@amcharts/amcharts4/.internal/core/utils/Iterator';
import constants from "../../../utils/constants";
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const tag = '998877';

const severityTypes = {
  CRITICAL: {
    name: 'Critical',
    color: 'border-maroon',
    bullet: 'maroon_bg',
  },
  MAJOR: {
    name: 'Major',
    color: 'border-yellow',
    bullet: 'yellow_bg',
  },
  MINOR: {
    name: 'Minor',
    color: 'border_blue',
    bullet: 'green_bg',
  },
  OTHER: {
    name: 'other',
    color: 'border_blue',
    bullet: '',
  },
};

const getSeverity = (type) => {
  let severity;
  for (let key in severityTypes) {
    if (severityTypes[key].name === type) severity = severityTypes[key];
  }
  if (severity) return severity;
  else return severityTypes.OTHER;
};

export default function CountrySpecifics(props) {
  const { specifics = [], selectedSolution = false, searchDivScroll } = props;

  const superTopics =
    (specifics && specifics.length && specifics[0]?.superTopicMetadatas) || [];
  const ref = useRef(null);
  const scroll = useRef(null);
  const [active, setActive] = useState();
  const [newSnap, setSnap] = useState();
  const [contentType, setContentType] = useState();
  const [holiday, setHolidays] = useState([]);
  const [rightSnap, setRightSnap] = useState();
  const dispatch = useDispatch();
  const holidayList = useSelector((state) => state?.country?.holidayList);
  let date = new Date();
  var year = date.getFullYear();

  useEffect(() => {
    dispatch(
      getPublicHolidayList({
        id: superTopics[0]?.countryId,
        year: [year, year + 1],
      })
    );
  }, []);
  useEffect(() => {
    if (searchDivScroll) {
      let targetEl = document.getElementById(searchDivScroll);
      targetEl?.scrollIntoView(true);
    }
  }, [searchDivScroll]);

  useEffect(() => {
    const currentYearHoliData = holidayList[0]?.holidays?.map((data) => ({
      description: data?.description,
      currentYear: data?.date,
    }));
    const nextYearHoliData = holidayList[1]?.holidays?.map((data) => ({
      description: data?.description,
      nextYear: data?.date,
    }));
    const currentYearHoliDescrption = holidayList[0]?.holidays?.map((data) => (
      data?.description
     ));
    const nextYearHoliDescrption = holidayList[1]?.holidays?.map((data) => (
     data?.description
    ));
    let holiday=[]
    let holidayCurDate1=[]
    let holidayNexDate2=[]
    let holides=[]
    currentYearHoliData?.forEach((item)=>{
     
      nextYearHoliData?.find((item1)=>{
        if (
          item?.description===item1?.description
        ) {
          if(!holidayCurDate1?.includes(item?.currentYear)&&!holidayNexDate2?.includes(item1?.nextYear)||!holides?.includes(item?.description)){
          holiday.push({description:item?.description,currentYear:item.currentYear?item.currentYear:" ",nextYear:item1.nextYear?item1.nextYear:" ",date:item.currentYear?item.currentYear:" "})
          
          holiday?.map((item)=>{
            holidayCurDate1.push(
              item?.currentYear
          )
          })
          holiday?.map((item)=>{
            holides.push(
              item?.description
          )
          })
          holiday?.map((item)=>{
            holidayNexDate2.push(
              item?.nextYear
          )
          })
          }

        }
       
    })
    if((currentYearHoliDescrption.includes(item?.description)&&!nextYearHoliDescrption.includes(item?.description)||
    (currentYearHoliDescrption.includes(item?.description)&&!holidayCurDate1?.includes(item?.currentYear)))){
     
      holiday.push({description:item?.description,currentYear:item.currentYear?item.currentYear:" ",nextYear:"",date:item.currentYear?item.currentYear:" "})
    }
    
    
  })
  nextYearHoliData?.forEach((item1)=>{
    if(nextYearHoliDescrption.includes(item1?.description)&&!currentYearHoliDescrption.includes(item1?.description)
    ){
      var date =item1.nextYear;
      var date1=date?.split('-')
      date1[0]=(parseInt(date?.split('-')[0])-1).toString()
      holiday.push({description:item1?.description,currentYear:"",nextYear:item1.nextYear?item1.nextYear:" ",date:date1?.join('-')})
    }
  })

  holiday.sort(function(a, b) {
    var c = new Date(a?.date);
    var d = new Date(b?.date);
    return c-d;
  })
    setHolidays(holiday);
  }, [holidayList]);
  
  useEffect(() => {
    if (specifics && specifics.length) {
      const superTopics =
        (specifics && specifics.length && specifics[0]?.superTopicMetadatas) ||
        [];
      let snap = [];
      specifics &&
        specifics.length &&
        specifics.map((e) => {
          e?.subcategorySettings?.map((item) => {
            e?.superTopicMetadatas?.map((data) => {
              if (item?.contenId === data?.supertopicContentId) {
                if (!item?.isTitleHidden || !item?.isContentHidden) {
                  if (data?.topics?.length) {
                    let topics = [];
                    data?.subcategorySettings.map((subcategory) => {
                      data?.topics.map((top) => {
                        if (subcategory?.contenId === top?.topicContentId) {
                          if (
                            !subcategory?.isTitleHidden ||
                            !subcategory?.isContentHidden
                          ) {
                            topics?.push(top);
                          }
                        }
                      });
                    });
                    snap.push({
                      alert: data?.alert,
                      supertopicContent: data?.supertopicContent,
                      supertopicName: data?.supertopicName,
                      topics: topics,
                      subcategorySettings: data?.subcategorySettings,
                      supertopicId: data?.supertopicId,
                    });
                  } else {
                    snap.push(data);
                  }
                }
                if (item?.isTitleHidden && item?.isContentHidden) {
                  if (data?.topics?.length) {
                    let topics = [];
                    data?.subcategorySettings.map((subcategory) => {
                      data?.topics.map((top) => {
                        if (subcategory?.contenId === top?.topicContentId) {
                          if (
                            !subcategory?.isTitleHidden ||
                            !subcategory?.isContentHidden
                          ) {
                            topics.push(top);
                          }
                        }
                      });
                    });
                    snap.push({
                      supertopicContent: data?.supertopicContent,
                      supertopicName: '',
                      topics: topics,
                      subcategorySettings: data?.subcategorySettings,
                      supertopicId: data?.supertopicId,
                    });
                  } 
                }
              }
            });
          });
        });
      let snap1 = [];
      specifics &&
        specifics.length &&
        specifics.map((e) => {
          e?.subcategorySettings?.map((item) => {
            e?.superTopicMetadatas?.map((data) => {
              if (item?.contenId === data?.supertopicContentId) {
                if (!item?.isTitleHidden && !item?.isContentHidden) {
                  snap1.push({
                    alert: data?.alert,
                    supertopicContent: data?.supertopicContent,
                    supertopicName: data?.supertopicName,
                    topics: data?.topics,
                    supertopicId: data?.supertopicId,
                    subcategorySettings: data?.subcategorySettings,
                    contentType: data?.contentType,
                  });
                }
                if (item.isTitleHidden && !item.isContentHidden) {
                  snap1.push({
                    supertopicContent: data?.supertopicContent,
                    supertopicName: ' ',
                    topics: data?.topics,
                    subcategorySettings: data?.subcategorySettings,
                    supertopicId: data?.supertopicId,
                    contentType: data?.contentType,
                  });
                }
                if (!item?.isTitleHidden && item?.isContentHidden) {
                  snap1.push({
                    alert: data?.alert,
                    supertopicContent: '',
                    supertopicName: data?.supertopicName,
                    topics: data?.topics,
                    subcategorySettings: data?.subcategorySettings,
                    supertopicId: data?.supertopicId,
                    contentType: data?.contentType,
                  });
                }
                if (item?.isTitleHidden && item?.isContentHidden) {
                  snap1.push({
                    supertopicContent: '',
                    supertopicName: ' ',
                    topics: data?.topics,
                    subcategorySettings: data?.subcategorySettings,
                    supertopicId: data?.supertopicId,
                    contentType: data?.contentType,
                  });
                }
              }
            });
          });
        });
      setSnap(snap);
      setRightSnap(snap1);
      if (newSnap?.length) {
        setActive(newSnap[0].supertopicId);
      }
    }

    if (selectedSolution) {
      setActive(selectedSolution.supertopicId);
    }
  }, [specifics]);

  //  useEffect(() => {
  //      //for checking content type
  //      var contentType = newSnap && newSnap.map((type) =>{
  //       return (type.contentType)
  //     })
  //    setContentType(contentType);
  //   }, [specifics])

  useEffect(() => {
    if (props?.divScroll?.divScroll) {
      let targetEl = document.getElementById(props?.divScroll?.divScroll);
      targetEl?.scrollIntoView(true);
    }
  }, [rightSnap]);
  const onTabPaneScroll = (event) => {
    // let content = event.target;
    // let children = content.children;
    // let index = 0,
    //   topChild;
    // for (let child of children) {
    //   if (index === 7) index++;
    //   if (child.offsetTop - content.scrollTop < 50) {
    //     topChild = child;
    //   }
    // }
    // debugger;
    // if (topChild) {
    //   setActive(topChild.getAttribute("id"));
    // }
  };
  const onSuperTopicClick = (target) => {
    let element = ref.current;
    let targetEl = document.getElementById(target);
    setActive(targetEl.getAttribute('id'));
    targetEl.scrollIntoView(true);
  };
  return (
    <div
      className="row specifics-detail"
      ref={scroll}
      id={specifics[0]?.templateId}
      data-test="country-specific-page"
    >
      <div className="col-lg-4 scrollscpy_overflow">
        <ul className="tab-header">
          {newSnap?.map((superTopic, index) => {
            let topics = superTopic.topics;
             
              return (
                <li
                  key={superTopic.supertopicId}
                  data-key={superTopic.supertopicId}
                  id={superTopic.supertopicContentId}
                  className={
                    active === superTopic.supertopicId ? 'selected' : ''
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    onSuperTopicClick(superTopic.supertopicId);
                    mixpanel.track('Country specifics ', {'Content specific Name': superTopic.supertopicName,
                    'User Details':userDetailsMixpnel()});
                  }}
                >
                  {superTopic.supertopicName}
                  {superTopic.alert ? (
                    <div
                      className={`round ${
                        getSeverity(superTopic.alert?.severityType)?.bullet
                      }`}
                    ></div>
                  ) : null}
                  {topics.length ? (
                    <ul>
                      {topics.map((topic) => (
                        <li
                          key={topic.topicId}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSuperTopicClick(superTopic.supertopicId);
                          }}
                        >
                          {topic.topicName}
                          {topic.alert ? (
                            <div
                              className={`round ${
                                getSeverity(topic.alert?.severityType)?.bullet
                              }`}
                              style={{ top: '22px', left: '0px' }}
                            ></div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            
          })}
        </ul>
      </div>
      <div className="col-lg-8">
        <div className="tab-content scrollscpy_overflow">
          <div className="scrollspy-para">
            <div className=" list-style-specifics">
              <div className="tab-pane" ref={ref}>
                {rightSnap?.map((superTopic, index) => {
                  

                  let topics = superTopic.topics;
                  return (
                    <div
                      id={superTopic.supertopicId}
                      key={superTopic.supertopicId}
                      className={
                        props?.divScroll?.divScroll ===
                          superTopic.supertopicId ||
                        searchDivScroll === superTopic.supertopicId ||
                        props?.tospecificsId === superTopic.supertopicId
                          ? 'col-12 searchStyle'
                          : 'col-12 '
                      }
                    >
                      <h3
                        className={`supertopic-title ${
                          !superTopic.alert ? 'pl-0' : ''
                        } `}
                      >
                        {superTopic.supertopicName}
                      </h3>
                      {superTopic.alert ? (
                        <div
                          className={`round ${
                            getSeverity(superTopic.alert?.severityType)?.bullet
                          }`}
                        ></div>
                      ) : null}
                      <div>
                        <p
                          className="text-data"
                          dangerouslySetInnerHTML={{
                            __html: superTopic.supertopicContent,
                          }}
                        />
                        {topics && topics.length
                          ? topics.map((topic) => {
                              let subTopics = topic.subTopics;
                              let newTop = superTopic?.subcategorySettings?.map(
                                (top) => {
                                  if (top.contenId === topic.topicContentId) {
                                    return (
                                      <div
                                        key={topic.topicId}
                                        className={
                                          props?.divScroll?.divScroll ===
                                            topic.topicId ||
                                          searchDivScroll === topic.topicId
                                            ? 'col-12 searchStyle'
                                            : 'col-12 '
                                        }
                                        id={topic.topicId}
                                      >
                                        <h3
                                          className={`topic-title ${
                                            !topic.alert ? 'pl-0' : ''
                                          }`}
                                        >
                                          {!top.isTitleHidden
                                            ? topic.topicName
                                            : ''}
                                        </h3>
                                        {superTopic.supertopicName ===
                                          'Public Holidays' &&
                                        superTopic?.contentType === 1 &&
                                        topic.topicName ===
                                          'List of Public Holidays' &&
                                        topic.contentType === 6 ? (
                                          <>
                                            <table>
                                              <tr>
                                                <th className="text-left">
                                                  HOLIDAY
                                                </th>
                                                <th>{year}</th>
                                                <th>{year + 1}</th>
                                              </tr>
                                              {holiday && holiday.length ? (
                                                holiday?.map((data, index) => {
                                                  return (
                                                    <>
                                                      <tr
                                                        id={index}
                                                        key={index}
                                                      >
                                                        {/* <OverlayTrigger
                                                          overlay={(props) => (
                                                            <Tooltip
                                                              id={`Download-Button`}
                                                              {...props}
                                                            >
                                                              {data.description}
                                                            </Tooltip>
                                                          )}
                                                          placement="left"
                                                        > */}
                                                        <td
                                                          className="text-left"
                                                          style={{
                                                            cursor: 'pointer',
                                                          }}
                                                        >
                                                          {/* {`${stripHtml_fun(
                                                            data.description
                                                          ).substring(0, 25)}${
                                                            data.description
                                                              ?.length > 25
                                                              ? '...'
                                                              : ''
                                                          }`} */}
                                                          {data?.description}
                                                        </td>
                                                        {/* </OverlayTrigger> */}

                                                        <td>
                                                          {data?.currentYear &&
                                                            moment.utc(
                                                              data?.currentYear
                                                            ).format(
                                                              'MMM DD, YYYY'
                                                            )}
                                                        </td>
                                                        <td className="gray-txt-color">
                                                          {
                                                            
                                                            <>
                                                            {data?.nextYear &&
                                                              moment.utc(
                                                                data?.nextYear
                                                              ).format(
                                                                'MMM DD, YYYY'
                                                              )}
                                                          </>}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  );
                                                })
                                              ) : (
                                                <tr
                                                  style={{
                                                    textAlign: 'center',
                                                  }}
                                                  id={'534651246'}
                                                >
                                                  <td colSpan={4}>
                                                    {' '}
                                                    No data found
                                                  </td>
                                                </tr>
                                              )}
                                            </table>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                        {!top.isTitleHidden && topic.alert ? (
                                          <div
                                            className={`round ${
                                              getSeverity(
                                                topic.alert?.severityType
                                              )?.bullet
                                            }`}
                                          ></div>
                                        ) : null}
                                        <div>
                                          <p
                                            className="text-data"
                                            dangerouslySetInnerHTML={{
                                              __html: !top.isContentHidden
                                                ? topic.topicContent
                                                : '',
                                            }}
                                          />
                                          {subTopics && subTopics.length
                                            ? subTopics.map((subTopic) => {
                                                let terTopics =
                                                  subTopic.tertiaryTopics;
                                                let newSub =
                                                  topic?.subcategorySettings?.map(
                                                    (sub) => {
                                                      if (
                                                        sub.contenId ===
                                                        subTopic.subTopicContentId
                                                      ) {
                                                        return (
                                                          <div
                                                            key={
                                                              subTopic.subTopicId
                                                            }
                                                            className={
                                                              props?.divScroll
                                                                ?.divScroll ===
                                                                subTopic.subTopicId ||
                                                              searchDivScroll ===
                                                                subTopic.subTopicId
                                                                ? 'col-12 searchStyle'
                                                                : 'col-12 '
                                                            }
                                                            id={
                                                              subTopic.subTopicId
                                                            }
                                                          >
                                                            <h3
                                                              className={`subtopic-title ${
                                                                !subTopic.alert
                                                                  ? 'pl-0'
                                                                  : ''
                                                              }`}
                                                            >
                                                              {!sub.isTitleHidden
                                                                ? subTopic.subTopicName
                                                                : ''}
                                                            </h3>
                                                            {!sub.isTitleHidden &&
                                                            subTopic.alert ? (
                                                              <div
                                                                className={`round ${
                                                                  getSeverity(
                                                                    subTopic
                                                                      .alert
                                                                      ?.severityType
                                                                  )?.bullet
                                                                }`}
                                                              ></div>
                                                            ) : null}
                                                            <div>
                                                              <p
                                                                className="text-data"
                                                                dangerouslySetInnerHTML={{
                                                                  __html:
                                                                    !sub.isContentHidden
                                                                      ? subTopic.subTopicContent
                                                                      : '',
                                                                }}
                                                              />
                                                              {terTopics &&
                                                              terTopics.length
                                                                ? terTopics.map(
                                                                    (
                                                                      terTopic
                                                                    ) => {
                                                                      let newTer =
                                                                        subTopic?.subcategorySettings?.map(
                                                                          (
                                                                            ter
                                                                          ) => {
                                                                            if (
                                                                              ter.contenId ===
                                                                              terTopic.tertiaryTopicContentId
                                                                            ) {
                                                                              return (
                                                                                <div
                                                                                  key={
                                                                                    terTopic.tertiaryTopicId
                                                                                  }
                                                                                  className={
                                                                                    props
                                                                                      ?.divScroll
                                                                                      ?.divScroll ==
                                                                                      terTopic.tertiaryTopicId ||
                                                                                    searchDivScroll ===
                                                                                      terTopic.tertiaryTopicId
                                                                                      ? 'col-12 searchStyle'
                                                                                      : 'col-12 '
                                                                                  }
                                                                                  id={
                                                                                    terTopic.tertiaryTopicId
                                                                                  }
                                                                                >
                                                                                  <h3
                                                                                    className={`tertopic-title ${
                                                                                      !terTopic.alert
                                                                                        ? 'pl-0'
                                                                                        : ''
                                                                                    }`}
                                                                                  >
                                                                                    {!ter.isTitleHidden
                                                                                      ? terTopic.tertiaryTopicName
                                                                                      : ''}
                                                                                  </h3>
                                                                                  {!ter.isTitleHidden &&
                                                                                  terTopic.alert ? (
                                                                                    <div
                                                                                      className={`round ${
                                                                                        getSeverity(
                                                                                          terTopic
                                                                                            .alert
                                                                                            ?.severityType
                                                                                        )
                                                                                          ?.bullet
                                                                                      }`}
                                                                                    ></div>
                                                                                  ) : null}
                                                                                  <div>
                                                                                    <p
                                                                                      className="text-data"
                                                                                      dangerouslySetInnerHTML={{
                                                                                        __html:
                                                                                          !ter.isContentHidden
                                                                                            ? terTopic.tertiaryTopicContent
                                                                                            : '',
                                                                                      }}
                                                                                    />
                                                                                  </div>
                                                                                </div>
                                                                              );
                                                                            }
                                                                          }
                                                                        );
                                                                      return newTer;
                                                                    }
                                                                  )
                                                                : null}
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    }
                                                  );
                                                return newSub;
                                              })
                                            : null}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              );

                              return newTop;
                            })
                          : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
