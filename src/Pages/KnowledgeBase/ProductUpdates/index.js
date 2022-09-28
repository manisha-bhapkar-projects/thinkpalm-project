import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import constants from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

// Component
import KnowledgeBaseHeader from '../KnowledgeBaseHeader';
import Loader from "../../../Components/Loader";
import SupportButton from "../../../Components/SupportButton"


const FrequentlyAsked = (props) => {
	document.title = "Product Updates";
	const breadcrumb = [{
		name: 'Knowledge Base',
		pageLink: 'knowledge-base'
	}, {
		name: 'Product Updates',
		pageLink: ''
	}];

	const history = useHistory();
	const dispatch = useDispatch();
	
	return (
		<>
			<div className="product_update">
			<KnowledgeBaseHeader
				{...props}
				bannerHeader="faq-image"
				breadcrumb={breadcrumb}
				title="Product Updates"
				className="knowledge-header-container"
			/>
			</div>
			<div className="faq-container product_update_container" data-testid="faq-result-page">
				<div className="faq-list-wrap">
					<h6 className="activeTag">2021</h6>
					<span>September 19, 2021 Update</span>
					<span>September 10, 2021 Update</span>
				</div>
				<div className="faq-writing">
					<h2 className="font-26">
					2021
					</h2>
					<h3>September 19, 2021 Update</h3>
					<ul>
						<li>Ask an Expert <span>Estimate Approval</span> page.</li>
						<li>Download <span>Users</span> through Settings.</li>
					</ul>
				</div>
			<SupportButton/>	
			</div>
		</>
	);
};

export default React.memo(FrequentlyAsked);
