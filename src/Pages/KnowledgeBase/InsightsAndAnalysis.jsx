import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import sortArrow from "../../assets/images/sort-arrows.svg";
import authorDP from "../../assets/images/author.png";
import searchIcon from "../../assets/images/search.svg";
import { Checkbox } from "primereact/checkbox";
import { getArticles } from "../../Store/reducers/country";
import { useDispatch, useSelector } from "react-redux";
import constants from "../../utils/constants";
import KnowledgeBaseHeader from "./KnowledgeBaseHeader";
import profile_img from "../../assets/images/dp.jpeg";
import close from "../../assets/images/search-close.svg";
import SupportButton from "../../Components/SupportButton";
import Loader from "../../Components/Loader";
import { permissionMapping } from "../../utils/utils";

import moment from "moment";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const InsightsAndAnalysis = (props) => {
	document.title = "Insights";
	const param = useParams()
	const history = useHistory();
	const dispatch = useDispatch()
	const permissionArray = permissionMapping();

	const breadcrumb = [{
		name: 'Home',
		pageLink: 'home'
	}, {
		name: param?.country ? param.country : 'Knowledge Base',
		pageLink: param?.id ? `/details/${param.id}` : 'knowledge-base'
	}, {
		name: 'Insights and Analysis',
		pageLink: ''
	}];
	const allArticles = useSelector(state => state.country.allArticles);
	const [allContent, setAllContent] = useState(param?.country ? false : true)
	const [allCountry, setAllCountry] = useState(param.regionId ? false : true)
	const [countryDisable, setCountryDisable] = useState(false)
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState(param?.country ? param.country : "")
	const [regionName, setRegionName] = useState(param.regionId ? param.regionId === "2" ? ['South Asia'] : param.regionId === "3" ? ['Europe & Central Asia']
		: param.regionId === "54" ? ['Americas'] : param.regionId === "5" ? ['East Asia & Pacific'] : param.regionId === "7" ? ['Latin America & Caribbean'] :
			param.regionId === "8" ? ['North America'] : param.regionId === "4" ? ['Middle East & North Africa'] : [] : [])
	const scroll = useRef(null)
	var tags = ["Annual Leave",
		"Bonuses",
		"Employment Contracts",
		"Employment Termination",
		"Maternity Leave",
		"Sick Leave",
		"Severance",
		"Visas",
		"Social Security Contributions",
		"Working Hours"]
	const [cities, setCities] = useState({
		solutionName: param?.country ? ["Knowledge Base - Insights and Analysis - Articles"] : [
			"Knowledge Base - Insights and Analysis - Articles",
			"Knowledge Base - Insights and Analysis - Whitepapers",
			"Knowledge Base - Insights and Analysis - Blogs",
		],
		GeographicTags: param.regionId ? [param.regionId] : [],
		tags: param?.country ? [param.country] : [],
		"TrimContent": true
	});
	const initialRequest = {
		solutionName: ["Knowledge Base - Insights and Analysis - Articles"],
		GeographicTags: [],
		"TrimContent": true,
		tags: param.country ? [param.country] : []

	}
	const onRegionChange = (e) => {
		let selectedCities = [...cities.GeographicTags];
		let selectedRegionName = [...regionName]
		setSearchValue("")
		if (e.checked) {
			setAllCountry(false)
			selectedCities.push(e.value);
			selectedRegionName.push(e.target.name)

		}
		else {
			selectedCities.splice(selectedCities.indexOf(e.value), 1);
			selectedRegionName.splice(selectedRegionName.indexOf(e.target.name), 1);
		}
		setCities({ ...cities, GeographicTags: selectedCities.length ? selectedCities : [-1], tags: [] });
		setRegionName(selectedRegionName)

	}
	const onContentChange = (e) => {
		let selectedContents = [...cities.solutionName];
		if (e.checked) {
			selectedContents.push(e.value);

		}
		else {
			selectedContents.splice(selectedContents.indexOf(e.value), 1);
		}
		setCities({ ...cities, solutionName: selectedContents, tags: [] });

	}
	const onTextChange = (e) => {
		setAllCountry(false)
		setSearchValue(e.target.value)
		setCities({ ...cities, GeographicTags: [], tags: e.target.value.length ? [e.target.value] : [] });
		if (e.target.value.length === 0) {
			setCountryDisable(false)
			setAllCountry(true)
		}
	}


	const onAllContentChange = (e) => {
		let selectedContents = [];
		if (e.checked) {
			setAllContent(true);
			selectedContents = [
				"Knowledge Base - Insights and Analysis - Articles",
				"Knowledge Base - Insights and Analysis - Whitepapers",
				"Knowledge Base - Insights and Analysis - Blogs",
			];
		} else {
			setAllContent(false);
			selectedContents.splice(selectedContents.indexOf(e.value), 1);
		}
		setCities({ ...cities, solutionName: selectedContents, tags: [] });
	};
	const onAllCountryChange = (e) => {
		let selectedContents = [-1];
		setSearchValue("")
		if (e.checked) {
			setAllCountry(true);
			setRegionName([])
			selectedContents = [];
		} else {
			setAllCountry(false);
		}
		setCities({ ...cities, GeographicTags: selectedContents, tags: [] });
	};

	const getPopularArticle = () => {
		setCities({ ...cities, tags: ["Popular Content"] })
	}
	const getRecentArticle = () => {
		let divScroll = scroll.current
		divScroll.scrollTop = 0
	}
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
	useEffect(async () => {
		// if (!permissionArray?.includes(constants.PERMISSION_MAPPING.INSIGHTS_AND_ANALYSIS))
		// 	history.push("/home")
		dispatch(getArticles(initialRequest));
	}, []);
	useEffect(async () => {
		dispatch(getArticles(cities));
	}, [cities]);

	return (
		<div>
			{
				loading && (
					<div className="custom-loader">
						<Loader />
					</div>
				)
			}
			<div data-test="insight">
				<SupportButton/>

				<KnowledgeBaseHeader
					{...props}
					breadcrumb={breadcrumb}
					title="Insights & Analysis"
					className="knowledge-header-container"
					insight={true}
					param={param.country}
				/>
				<div className="knowledge-content-container article-grid-container">
					{cities.GeographicTags.length && searchValue.length ? <h4>Results For : <span className="search-result">“{searchValue}”</span></h4> : cities.GeographicTags.length === 1 && cities.GeographicTags.length ? <h4>Results For : <span className="search-result">“{regionName[0] ? regionName[0] : ""}”</span></h4> : cities.GeographicTags.length === 2 && cities.GeographicTags.length && cities.GeographicTags[0] === -1 ? <h4>Results For : <span className="search-result">“{regionName[0] ? regionName[0] : ""}”</span></h4> : cities.GeographicTags.length > 1 || (cities.GeographicTags.length > 1 && cities.GeographicTags[0] === -1) ? <h4>Results For : <span className="search-result">“Regions”</span></h4> : searchValue.length ? <h4>Results For : <span className="search-result">“{searchValue}”</span></h4> : <h4>All Content</h4>}
					<div className="article-grid-control">
						<button className="article-sort-button">
							<img src={sortArrow} alt="" />
						</button>
						<label>Sort by:</label>
						<button onClick={getRecentArticle} data-test='recentClick'>Recent</button>
						<button onClick={getPopularArticle} data-test="popularClick">Popular</button>
					</div>
					<div className="article-grid custom-scroll" ref={scroll}>
						{allArticles &&
							allArticles.data &&
							allArticles.data.length &&
							allArticles.data.map((e, id) => {
								return (
									<div
										className="article-grid-item"
										key={id}
										data-test="article"
									>
										<h5>{e.supertopicName}</h5>
										<div className="article-author-date">
											<div className="article-author">
												<img
													src={
														getAuthorImage(e)
															? `${constants.IMAGE
																.DOWNLOAD
															}${getAuthorImage(e)}`
															: profile_img
													}
													alt=""
												/>
											</div>
											<span>
												{e.templateType}{" "}
												{moment(e.publishedDate).format(
													"MMM DD, YYYY"
												)}
											</span>
										</div>
										<p>{`${e.supertopicContent}${"..."}`}</p>
										<button
											onClick={() =>
												{history.push({
													pathname: `${constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE}`,
													state: {
														supertopicName:
															e.supertopicName,
													},
												})
												mixpanel.track('Insight and Analysis', {'Article headline':e?.supertopicName,
												'User Details':userDetailsMixpnel()})
											}
											}
											data-test='buttonClick'
										>
											Read More
										</button>
									</div>
								);
							})}

					</div>
					<div className="article-filter">
						<div className="article-search" data-test='search'>
							<button>
								<img src={searchIcon} alt="" />
							</button>
							<input
								type="text"
								placeholder="Filter by country/US State"
								value={searchValue}
								onChange={onTextChange}
								data-test='textChange'
							/>
							{searchValue ?
								<div onClick={() => {
									setSearchValue("");
									setCities({ ...cities, GeographicTags: [], tags: [] });
									setCountryDisable(false)
									setAllCountry(true)
								}} data-test="searchValue">
									<img
										alt=""
										src={close}
										height={11}
										name="search-outline"
										className="cursor-pointer"
									/>
								</div>

								: null}
						</div>

						<div className="article-filter-group">
							<h5>Regions</h5>
							<div className="check-group checked">
								<Checkbox
									className="checkbox"
									onChange={onAllCountryChange}
									checked={allCountry ? true : false}
									disabled={countryDisable ? true : false}
									data-test='allCountryChange'
								></Checkbox>
								<label>All Countries</label>
							</div>

							<div className="check-group">
								<Checkbox name="South Asia" inputId='ch1' value="2" className="checkbox" checked={cities.GeographicTags.includes('2')} onChange={onRegionChange} disabled={countryDisable ? true : false} data-test='regionChange'></Checkbox>

								<label>South Asia</label>
							</div>

							<div className="check-group">
								<Checkbox name="Europe &amp; Central Asia" inputId='ch2' value="3" className="checkbox" checked={cities.GeographicTags.includes('3')} onChange={onRegionChange} disabled={countryDisable ? true : false}></Checkbox>

								<label>Europe &amp; Central Asia</label>
							</div>

							<div className="check-group">
								<Checkbox name="Americas" inputId='ch3' value="54" className="checkbox" checked={cities.GeographicTags.includes('54')} onChange={onRegionChange} disabled={countryDisable ? true : false}></Checkbox>

								<label>Americas</label>
							</div>

							<div className="check-group">
								<Checkbox name="SubSaharan Africa" inputId='ch4' value="6" className="checkbox" checked={cities.GeographicTags.includes('6')} onChange={onRegionChange} disabled={countryDisable ? true : false}></Checkbox>

								<label>SubSaharan Africa</label>
							</div>

							<div className="check-group">
								<Checkbox name="East Asia &amp; Pacific" inputId='ch5' value="5" className="checkbox" checked={cities.GeographicTags.includes('5')} onChange={onRegionChange} disabled={countryDisable ? true : false}></Checkbox>

								<label>East Asia &amp; Pacific</label>
							</div>
							<div className="check-group">
								<Checkbox name="Latin America &amp; Caribbean" inputId='ch5' value="7" className="checkbox" checked={cities.GeographicTags.includes('7')} onChange={onRegionChange} disabled={countryDisable ? true : false}></Checkbox>

								<label>Latin America &amp; Caribbean</label>
							</div>
							<div className="check-group">
								<Checkbox name="North America" inputId='ch6' value="8" className="checkbox" checked={cities.GeographicTags.includes('8')} onChange={onRegionChange} disabled={countryDisable ? true : false}></Checkbox>

								<label>North America</label>
							</div>

							<div className="check-group">
								<Checkbox name="Middle East &amp; North Africa" inputId='ch6' value="4" className="checkbox" checked={cities.GeographicTags.includes('4')} onChange={onRegionChange} disabled={countryDisable ? true : false}></Checkbox>

								<label>Middle East &amp; North Africa</label>
							</div>
						</div>

						<div className="article-filter-group">
							<h5>Content Type</h5>
							<div className="check-group checked">
								<Checkbox
									className="checkbox"
									checked={allContent}
									onChange={onAllContentChange}
									data-test="allContentChange"
								></Checkbox>
								<label>All Contents</label>
							</div>

							<div className="check-group">
								<Checkbox
									inputId="ch7"
									value="Knowledge Base - Insights and Analysis - Articles"
									className="checkbox"
									checked={cities.solutionName.includes(
										"Knowledge Base - Insights and Analysis - Articles"
									)}
									onChange={onContentChange}
									disabled={allContent ? true : false}
									data-test='contentChange'
								></Checkbox>
								<label>Articles</label>
							</div>

							<div className="check-group" data-test='check'>
								<Checkbox
									inputId="ch8"
									value="Knowledge Base - Insights and Analysis - Whitepapers"
									className="checkbox"
									checked={cities.solutionName.includes(
										"Knowledge Base - Insights and Analysis - Whitepapers"
									)}
									onChange={onContentChange}
									disabled={allContent ? true : false}
								></Checkbox>
								<label>Whitepapers</label>
							</div>

							<div className="check-group">
								<Checkbox
									inputId="ch9"
									value="Knowledge Base - Insights and Analysis - Blogs"
									className="checkbox"
									checked={cities.solutionName.includes(
										"Knowledge Base - Insights and Analysis - Blogs"
									)}
									onChange={onContentChange}
									disabled={allContent ? true : false}
								></Checkbox>
								<label>Blogs</label>
							</div>
						</div>

						<div className="article-filter-group">
							<h5>Tags</h5>
							<div className="article-tags">
								{
									tags.map((data,index) => {
										return (
											<button key={index} value='Visa' data-test='tagClick'>{data}</button>
										)

									})
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	);

}
export default InsightsAndAnalysis;
