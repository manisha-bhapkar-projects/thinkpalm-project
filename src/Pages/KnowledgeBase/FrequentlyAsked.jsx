import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import constants from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

// Component
import KnowledgeBaseHeader from './KnowledgeBaseHeader';
import Loader from "../../Components/Loader";
import SupportButton from "../../Components/SupportButton"

import {
	getAllFAQ
} from "../../Store/reducers/knowledgeBase";

const FrequentlyAsked = (props) => {
	document.title = "FAQ";
	const topicWindowRef = useRef(null)
	const breadcrumb = [{
		name: 'Knowledge Base',
		pageLink: 'knowledge-base'
	}, {
		name: 'FAQ',
		pageLink: ''
	}];

	const history = useHistory();
	const dispatch = useDispatch();
	const [faqDetailsList, setDetailsFaqList] = useState([])
	const [activeId, setActiveId] = useState("")
	const [loading, setLoading] = useState(false);
	const { faqLoading, faqList } = useSelector(state => state.knowledgeBase);

	const scrollToChild = (childId) => {
		if (childId) {
			const parentWindow = document.getElementById("parent-window");
			const childWindow = document.getElementById(childId);
			if (childWindow != null) {
				parentWindow?.scrollTo({ top: (childWindow.offsetTop - 30) - parentWindow.offsetTop, behavior: 'smooth' });
			}
			setActiveId(childId)
		}
	};

	const scrollToParent = (childId) => {
		if (childId) {
			const leftParentWindow = document.getElementById("left-parent-window");
			const parentWindow = document.getElementById(childId + "left");
			if (parentWindow != null) {
				leftParentWindow.scrollTo({ top: (parentWindow.offsetTop - 10) - leftParentWindow.offsetTop, behavior: 'smooth' });
			}
			setActiveId(childId)
		}
	};

	const stripHtml_fun = (a) => {
		if (a != null) {
			let stripedHtml = a.replace(/<[^>]+>/g, '');
			return stripedHtml;
		}
		return a;
	}

	useEffect(() => {
		setLoading(true)
		loadFAQList();
	}, []);

	const loadFAQList = () => {
		if (!props.testCase) dispatch(getAllFAQ());
		setLoading(false)
	}

	useEffect(() => {
		if (faqList.length > 0) {
			setDetailsFaqList(faqList);
			setActiveId(faqList[0].supertopicContentId)
		}
	}, [faqLoading, faqList]);

	return (
		<>
			{
				loading && (
					<div className="custom-loader">
						<Loader />
					</div>
				)
			}
			<KnowledgeBaseHeader
				{...props}
				bannerHeader="faq-image"
				breadcrumb={breadcrumb}
				title="Frequently Asked Questions"
				className="knowledge-header-container"
			/>
			<div className="faq-container" data-testid="faq-result-page">
				<div
					className="faq-list-wrap"
					id="left-parent-window"
					onClick={() => scrollToChild(props.testCase ? '60ccb1309fd7e10bb13020e2' : undefined)}
					data-testid="scroll-child"
				>
					{
						faqDetailsList.map((item) => {
							return (
								<React.Fragment key={Math.random().toString(36).substr(2, 5)}>
									<h6
										onClick={() => scrollToChild(item.supertopicContentId)}
										id={item.supertopicContentId + "left"}
										className={activeId === item.supertopicContentId ? "activeTag" : ""}
										data-test="namesec1"
										>
										{item.supertopicName}
									</h6>
									{
										item.topics.map((child) => {
											return (
												<span
													onClick={() => scrollToChild(child.topicId)}
													id={child.topicId + "left"}
													key={child.topicId + "left"}
													className={activeId === child.topicId ? "activeTag" : ""}
													data-test="namesec"
												>
													{child.topicName}
												</span>
											)
										})
									}
								</React.Fragment>
							);
						})
					}
				</div>
				<div
					className="faq-writing"
					ref={topicWindowRef}
					id="parent-window"
					data-testid="scroll-parent"
					onClick={() => scrollToParent(props.testCase ? '60ccb1309fd7e10bb13020e2' : undefined)}>
					{
						faqDetailsList.map((item, i) => {
							return (
								<React.Fragment key={Math.random().toString(36).substr(2, 5)}>
									<div className={i === 0 ? "" : "mt-5"}>
										<h3
											onClick={() => scrollToParent(item.supertopicContentId)}
											id={item.supertopicContentId}
											data-test="namesec2">
											{item.supertopicName}
										</h3>
										<p dangerouslySetInnerHTML={{ __html: stripHtml_fun(item.supertopicContent) }}></p>
									</div>
									<div className="parent">
										{
											item.topics.map((child) => {
												return (
													<React.Fragment key={Math.random().toString(36).substr(2, 5)}>
														<h3
															onClick={() => scrollToParent(child.topicId)}
															id={child.topicId}
															data-test="namesec3">
															{child.topicName}
														</h3>
														<p dangerouslySetInnerHTML={{ __html: child.topicContent }}></p>
													</React.Fragment>
												)
											})
										}
									</div>
									<SupportButton/>
								</React.Fragment>
							);
						})
					}
				</div>
			</div>
		</>
	);
};

export default React.memo(FrequentlyAsked);
