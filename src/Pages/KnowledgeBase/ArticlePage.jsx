import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

/* Icon */
import shoppingIcon from "../../assets/images/shopping_icon_1.svg";
import articleAuthorImage from "../../assets/images/article-author.png";
import articleBanner from "../../assets/images/Rectangle.svg";
import profile_img from "../../assets/images/dp.jpeg";

/* Component */
import { getUserProfile } from "../../utils/storage";
import UserDropdown from "../../Components/UserDropdown";
import constants from "../../utils/constants";
import SearchBar from "../../Components/SearchBar";
import SupportButton from "../../Components/SupportButton";
/* Action */
import { getArticleContent } from "../../Store/reducers/country";
import { stripHtml_fun } from "../../utils/utils";

const ArticlePage = (props) => {
  const param = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [tags, setTags] = useState({});
  const [userData, setUserData] = useState();
  const articleContent = useSelector((state) => state.country.articleContent);
  const SuperTopicName = history?.location?.state?.supertopicName
    ? history?.location?.state?.supertopicName
    : param?.name;
  const comingfromHomepage = history?.location?.state?.comingfromHomepage;
  const comingFromKB = history?.location?.state?.comingFromKB;
    useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    dispatch(getArticleContent({ SuperTopicName: SuperTopicName }));
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (
      articleContent &&
      articleContent.length > 0 &&
      articleContent[0]?.supertopicName
    ) {
      document.title = articleContent[0]?.supertopicName;
    }
  }, [articleContent]);

  useEffect(() => {
    const data = getContentByTag(articleContent);
    setTags(data);
    getCoverImage(articleContent);
    getAuthorImage(articleContent);
    getExpertDetails(articleContent);
  }, [articleContent]);

  const getContentByTag = (articleContent) => {
    let data = {};
    if (articleContent && articleContent.length > 0) {
      let tagContent = articleContent[0]?.topics;
      tagContent?.forEach((item, index) => {
        item.tags.forEach((val) => {
          data = {
            ...data,
            [val.name]: tagContent && tagContent[index].topicName,
          };
        });
      });
    }
    return data;
  };
  const getAuthorImage = (data) => {
    let topics = data && data[0] ? data[0]?.topics : "";
    let tags;
    let picId;
    let details;
    topics &&
      topics?.find((item) => {
        item?.tags?.find((e) => {
          if (e.name === "Author - Name") {
            tags = item?.subTopics;
          }
        });
      });
    tags &&
      tags?.find((item) => {
        item?.tags?.find((e) => {
          if (e.name === "Author - Pic") {
            picId = item?.subTopicContent;
          }
        });
      });
    return picId;
  };
  const getAuthorLinkedIn = (data) => {
    let topics = data && data[0] ? data[0]?.topics : "";
    let tags;
    let linkedInId;
    let details;
    topics &&
      topics?.find((item) => {
        item?.tags?.find((e) => {
          if (e.name === "Author - Name") {
            tags = item?.subTopics;
          }
        });
      });
    tags &&
      tags?.find((item) => {
        item?.tags?.find((e) => {
          if (e.name === "Author - LinkedIn") {
            linkedInId = item?.subTopicContent;
          }
        });
      });

    return linkedInId;
  };

  const getCoverImage = (data) => {
    let topics = data && data[0]?.topics;
    let tags;
    let picId;
    topics &&
      topics?.find((item) => {
        item?.tags?.find((e) => {
          if (e.name === "Cover-Image") {
            tags = item?.topicContent;
          }
        });
      });
    return tags;
  };

  const getExpertDetails = (data) => {
    let topics = data && data[0] ? data[0]?.topics : "";
    let tags;
    topics &&
      topics?.find((item) => {
        item?.tags?.find((e) => {
          if (e.name === "Author - Name") {
            tags = item?.topicContent;
          }
        });
      });
    return tags;
  };

  const estimatedReadingTime = (words) => {
    if (words && words != null && words != "") {
      const wordLength = words.replaceAll(/(<([^>]+)>)/gi, "").split(' ').length;
      if (!isNaN(wordLength / 220)) {
        return Math.round(wordLength / 220) < 1 ? 1 : Math.round(wordLength / 220);
      }

      return 0;
    }

    return 0;
  };

  return (
    <div data-test="article-page">
      <div
        className="ip_header_wrap search-results-wrap article-header-wrap"
        data-testid="search-results-wrap"
      >
        <div className="ip_banner-img large-banner">
          <img
            src={
              getCoverImage(articleContent)
                ? `${constants.IMAGE.DOWNLOAD}${getCoverImage(articleContent)}`
                : articleBanner
            }
            alt=""
          />
        </div>
        <div>
          <div className="row">
            <SearchBar noRow user={userData} theme="dark" />
            <div className="breadcrumb-w ml-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li
                    className="breadcrumb-item"
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => history.push(constants.ROUTE.HOME_PAGE.HOME)}
                    data-test="bredcrumbClick"
                  >
                    Home
                  </li>
                  {comingfromHomepage ? (
                    ""
                  ) : param.country ? (
                    <li
                      className="breadcrumb-item"
                      aria-current="page"
                      style={{ color: "white", cursor: "pointer" }}
                      onClick={() => history.push(`/details/${param.id}`)}
                      data-test="countryClick"
                    >
                      {param.country}
                    </li>
                  ) : (
                    <li
                      className="breadcrumb-item"
                      aria-current="page"
                      style={{ color: "white", cursor: "pointer" }}
                      onClick={() =>
                        history.push(constants.ROUTE.KNOWLEDGE_BASE.HOME)
                      }
                    >
                      Knowledge Base
                    </li>
                  )}

                  {param.name ? (
                    ""
                  ) : (
                    <li
                      className="breadcrumb-item"
                      aria-current="page"
                      style={{ color: "white", cursor: "pointer" }}
                      onClick={() =>
                        history.push(
                          constants.ROUTE.KNOWLEDGE_BASE.INSIGHTS_ANALYSIS
                        )
                      }
                    >
                      Insights & Analysis
                    </li>
                  )}
                  {param.name ? (
                    <li
                      className="breadcrumb-item"
                      aria-current="page"
                      style={{ color: "white", cursor: "pointer" }}
                    >
                      {param.name}
                    </li>
                  ) : (
                    <li
                      className="breadcrumb-item"
                      aria-current="page"
                      style={{ color: "white", cursor: "pointer" }}
                    >
                      Article
                    </li>
                  )}
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <div className="article-title-wrap">
          <h1>{articleContent && articleContent[0]?.supertopicName}</h1>
          <h4>{tags?.["Sub Title"]}</h4>
        </div>
      </div>
      <div className="article-content">
        <div className="article-content-head">
          <div className="article-info">
            <div className="authorDP">
              <img
                src={
                  getAuthorImage(articleContent)
                    ? `${constants.IMAGE.DOWNLOAD}${getAuthorImage(
                      articleContent
                    )}`
                    : profile_img
                }
                alt=""
              />
            </div>
            <h4>{tags?.["Author - Name"]}</h4>

            <label>
              {moment(articleContent && articleContent[0]?.createdAt).format(
                "MMM DD, YYYY"
              )}{" "}
              •{" "}
              {estimatedReadingTime(
                articleContent && articleContent[0]?.supertopicContent
              )}{" "}
              min read
            </label>
          </div>
        </div>
        <div className="article-writing">
          <p
            dangerouslySetInnerHTML={{
              __html: articleContent && articleContent[0]?.supertopicContent,
            }}
          />
        </div>
        <div className="article-content-footer">
          <hr />
          <div className="article-info">
            <div className="authorDP">
              <img
                src={
                  getAuthorImage(articleContent)
                    ? `${constants.IMAGE.DOWNLOAD}${getAuthorImage(
                      articleContent
                    )}`
                    : profile_img
                }
                alt=""
              />
            </div>
            <h5>
              <i>
                About the Author -{" "}
                <span style={{ color: "#40659e" }}>
                  {getAuthorLinkedIn(articleContent) ? (
                    <a
                      target="_blank"
                      href={`${stripHtml_fun(
                        getAuthorLinkedIn(articleContent)
                      )}`}
                    >
                      {tags?.["Author - Name"]}
                    </a>
                  ) : (
                    tags?.["Author - Name"]
                  )}
                </span>
              </i>
            </h5>
            <label
              dangerouslySetInnerHTML={{
                __html: getExpertDetails(articleContent),
              }}
            ></label>
          </div>
        </div>
      </div>
      <SupportButton />
    </div>
  );
};

export default React.memo(ArticlePage);
