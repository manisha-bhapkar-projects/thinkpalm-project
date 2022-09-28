import React, { useEffect } from "react";
import Slider from "react-slick";
import moment from "moment";
import { stripHtml_fun } from "../../utils/utils";
import profile_img from "../../assets/images/dp.jpeg";
import { map, pick } from "lodash";
import constants from "../../utils/constants";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const PopularContentCarousel = (props) => {
	useEffect(() => {
		getAuthorImage(props.popularContent)
	}, [])
	const history = useHistory();
	const getExpertImage = (content) => {
		let imageContent = null;
		content &&
			content.topics &&
			content.topics.map((t) => {
				const pexIds = map(t.tags, "name");
				if (pexIds.includes("Author")) {
					imageContent = t.subTopics?.length
						? t.subTopics[0].subTopicContent
						: null;
				}
			});
		return imageContent;
	};

	const getAuthorImage = (data) => {
		let topics = data?.topics
		let picId;
		topics?.find((item) => {
			item?.tags?.find((e) => {
				if (e.name === "Author - Name") {
					item?.subTopics?.find((item) => {
						item?.tags?.find((e) => {
							if (e.name === "Author - Pic") {
								picId = item?.subTopicContent
							}
						})
					})
				}
			})

		})
		return picId
	}
	const { popularContent = [], UnFavCountries } = props;

	var settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: popularContent.length < 4 ? popularContent.length : 4,
		slidesToScroll: 4,
	};
	return (
		<div className="container-fluid" data-test="popularContent">
			<Slider {...settings} data-test="slider">
				{popularContent && popularContent.map((content, x) => (
					<div key={x} className="popular-con-card">
						<div className="popular-header-info">
							<OverlayTrigger
								overlay={(props) => (
									<Tooltip id={`Download-Button`} {...props}>
										{content?.supertopicName}
									</Tooltip>
								)}
							>
								<h3 className="two-lined-ellipses">
									{content?.supertopicName}
								</h3>
							</OverlayTrigger>
							<div className="popular-author-details">
								<div className="author-pic">
									{UnFavCountries ?
										<img
											className="avatar"
											src={
												getAuthorImage(content)
													? `${constants.IMAGE.DOWNLOAD
													}${getAuthorImage(content)}`
													: profile_img
											}
										/> :
										<img
											className="avatar"
											src={
												getAuthorImage(content)
													? `${constants.IMAGE.DOWNLOAD
													}${getAuthorImage(content)}`
													: profile_img
											}
										/>}
								</div>
								<div className="popular-information">
									<span>Articles</span>
									<span>
										{moment(content.publishedDate)
											.format("MMM DD, YYYY")
											.toUpperCase()}
									</span>
								</div>
							</div>
						</div>

						<div className="content-info col-12">
							<div className="row">
								<div className="col-12 p-0">
									<div className="popular-con-card-body">
										<p className="three-lined-ellipses">
											{`${stripHtml_fun(
												content.supertopicContent
											)}`}
										</p>
									</div>
									<a
										onClick={() =>
											{
												history.push({
												pathname: `${constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE}`,
												state: {
													supertopicName:
														content.supertopicName,
													comingfromHomepage: true,
												},
												});
												mixpanel.track('Popular Content', {'Article headline': content.supertopicName});
											}


										}
										style={{ cursor: "pointer" }}
										className="popular-con-card-more"
									>
										Read More
									</a>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default PopularContentCarousel;
