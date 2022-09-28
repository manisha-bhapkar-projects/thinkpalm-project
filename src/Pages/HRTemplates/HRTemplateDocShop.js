import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { notifyAction } from "../../Store/reducers/notification";
import constants from "../../utils/constants";
import OpenModal from "../Settings/User_and_Accounts/OpenModal";

import SupportButton from "../../Components/SupportButton";
/* Icons */
import cart_body_icon from "../../assets/images/cart-body-icon.svg"
import searchIcon from "../../assets/images/search.svg";

/* Component */
import CustomePagination from "../../Components/CustomePagination/CustomePagination";
import KnowledgeBaseHeader from '../KnowledgeBase/KnowledgeBaseHeader';
import { permissionMapping } from "../../utils/utils";
import Loader from "../../Components/Loader";
import {userDetailsMixpnel} from '../../utils/utils'
/* Action */
import {
	getAllDocumentList,
	getLanguageList,
	getCategoryList,
	addToCartAPI,
	getPreviewPOPupDetails,
	callPurchasedDocumentList,
	getTemplateDetails,
	getPurchaseList
} from "../../Store/reducers/HRTemplate";

import { callgetCountryListAPI } from "../../Store/reducers/favoriteCountries";
import ComingSoon from "../../Components/ComingSoon";
import { getUserProfile } from "../../utils/storage";
import download_btn from "../../assets/images/download-blue.svg";
import mixpanel from 'mixpanel-browser';
mixpanel.init(constants.MIXPANEL_TOKEN);


const HRTemplateDocShop = (props) => {
	document.title = "Doc Shop";
	const history = useHistory();
	const permissionArray = permissionMapping();
	const userProfile = getUserProfile()
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch()
	const countries = useSelector((state) => state?.favoriteCountriesReducer?.countryList);
	//Main Lists
	const documentList = useSelector(state => state?.HRTemplate?.documentList?.data);
	const docListLoading = useSelector(state => state?.HRTemplate?.docListLoading);
	const userDocumentList = useSelector(state => state?.HRTemplate?.userDocumentList)
	const purListLoading = useSelector(state => state?.HRTemplate?.purListLoading)
	const docPageSize = useSelector(state => state?.HRTemplate?.documentList?.pageSize);
	const docTotalCount = useSelector(state => state?.HRTemplate?.documentList?.totalCount);
	const purchaseList = useSelector(state => state?.HRTemplate?.purchaseList?.data);
	const purchaseListLoading = useSelector(state => state?.HRTemplate?.purchaseListLoading);
	const purPageSize = useSelector(state => state?.HRTemplate?.purchaseList?.pageSize);
	const purTotalCount = useSelector(state => state?.HRTemplate?.purchaseList?.totalCount);
	// const completePurchaseList = useSelector(state => state?.HRTemplate?.completePurchaseList)
	// const completePurchaseListLoading = useSelector(state => state?.HRTemplate?.completePurchaseListLoading)


	//end
	//this contains clicked template details
	const templateDetailsLoading = useSelector(state => state?.HRTemplate?.templateDetailsLoading)
	const templateDetails = useSelector(state => state?.HRTemplate?.templateDetails)
	//end

	const languageList = useSelector((state) => state?.HRTemplate?.languageList);
	const categoryList = useSelector((state) => state?.HRTemplate?.categoryList?.data);
	const cartSuccess = useSelector((state) => state?.HRTemplate?.cartSuccess);

	// const pageSize = docPageSize || 10;
	// const totalCount = docTotalCount;
	const [pageNumber, setPageNumber] = useState(1);
	const [searchItem, setSearchItem] = useState("");
	const [item, setItem] = useState([]);
	const [previewFileId, setPreviewFileId] = useState();
	const [countryList, setCountryList] = useState([]);
	const [searchCountry, setSearchCountry] = useState([])
	const [selectedCountry, setSelectedCountry] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState([]);
	const [languages, setLanguageList] = useState([]);
	const [previewLanguage, setPreviewLanguage] = useState();
	const [loading, setLoader] = useState(false);
	const [btnLoading, setBtnLoader] = useState(false);
	const [allPurchases, setAllPurchasesSelected] = useState(false);
	const [cartList, setCartList] = useState();
	const [cardIds, setCardIds] = useState([]);
	const [selectedTemplate, setSelectedTemplate] = useState();
	const [pageSize, setPageSize] = useState(10);
	const [totalCount, setPageTotalCount] = useState(10);
	const [isSearchText, setSearchTextClear] = useState(false);
	const [searchText, setSearchText] = useState();
	// New states
	const [hrTemplateList, setHrTemplatesList] = useState([]);
	//
	const [docListrequestObject, setDocListRequestObject] = useState({
		page: pageNumber,
		pageSize: pageSize,
	});

	/** history */
	const redirectToHrTemplate = history?.location?.state?.redirectToHrTemplate;
	const searchTextFromRedirect = history?.location?.state?.searchText
	const searchSpecificItem = history?.location?.state?.searchSpecificItem
	const specificItem = history?.location?.state?.specificItem

	/**This useEffect is for calling document list with search param 
	 * when redirecting from in cart ,payment page etc. */
	useEffect(() => {
		if (redirectToHrTemplate && searchTextFromRedirect) {
			callDocumentList(searchTextFromRedirect)
		}
	}, [redirectToHrTemplate])

	useEffect(() => {
		if (searchSpecificItem) {
			callSpecificDoc(specificItem)
		}

	}, [searchSpecificItem])

	const callDocumentList = async (searchText) => {
		clearFilters()
		if (searchText === '') {
			setPageNumber(1)
			setPageSize(10)
		}
		setSearchText(searchText) // main search
		const res = await dispatch(getAllDocumentList({
			page: searchText === '' ? 1 : pageNumber,
			pageSize: searchText === '' ? 10 : pageSize,
			searchterm: searchText
		}));
		return res.payload.responseCode;
	}
	const callSpecificDoc = (item) => {
		clearFilters()
		const requestObject = {
			page: pageNumber,
			pageSize: pageSize,
		};
		requestObject["countryIds"] = [item.countryId];
		requestObject["categorIds"] = [item.category.id];
		// requestObject["searchterm"] = item.languageName
		dispatch(getAllDocumentList(requestObject));
	}


	useEffect(() => {
		if (!redirectToHrTemplate) {
			dispatch(getAllDocumentList({
				page: pageNumber,
				pageSize: pageSize

			}));
		}
		dispatch(callPurchasedDocumentList());
		dispatch(callgetCountryListAPI());
		dispatch(getLanguageList());
		dispatch(getCategoryList());
		window.scrollTo(0, 0);


	}, []);


	useEffect(() => {
		//This will used initially itself
		callInitialListingFunction()

	}, [userDocumentList, documentList, docListLoading])


	useEffect(() => {
		//This will be used when my purchases filter is checked
		if (purchaseList?.length > 0 && !purchaseListLoading) {
			setPageSize(purPageSize)
			setPageTotalCount(purTotalCount)
			const purchaseListCopy = purchaseList.map(it => {
				return {
					...it,
					languageName: it.documentProduct.languageName,
					countryName: it.documentProduct.document.countryName,
					price: it.documentProduct.document.document.price,
					category: {
						categoryName: it.documentProduct.document.category.categoryName,
					},
					upload: {
						id: it.documentProduct.upload.id
					},

					purchased: true
				}
			})
			setHrTemplatesList(purchaseListCopy);
			setLoader(false)
		} else if (!purchaseListLoading) {
			setLoader(false);
			setHrTemplatesList(purchaseList)
		}

	}, [purchaseList, purchaseListLoading])

	useEffect(() => {
		//This will be used when preview btn is clicked
		if (!templateDetailsLoading && templateDetails && Object.keys(templateDetails)?.length > 0) {
			setSelectedTemplate(templateDetails)
			const selectedLanguage = templateDetails?.documentUploads?.filter(it => (it.id === item.documentUploadId))
			setPreviewLanguage(selectedLanguage?.[0]);
			setLanguageList(templateDetails?.documentUploads);

			setLoader(false);
			setShowModal(true);
		} else if (templateDetailsLoading) {
			setLoader(true);
		}

	}, [templateDetailsLoading, templateDetails])

	const clearFilters = () => {
		setSelectedCountry([]);
		setSelectedCategory([]);
		setSelectedLanguage([]);
		setSearchItem(""); //country name search input box
	}


	useEffect(() => {
		if (purListLoading) {
			setLoader(true)
		}
		else {
			setLoader(false);
		}

	}, [purListLoading])

	useEffect(() => {
		setCountryList(countries)
	}, [countries]);

	useEffect(() => {
		dispatch(getPreviewPOPupDetails({ previewFileId }));
	}, [previewFileId]);

	const onTemplateChange = async (checked, alreadyPurchasedList) => {
		setSearchTextClear(true);
		const reObj = {
			...docListrequestObject,
			page: 1
		}
		setPageNumber(1)

		if (checked) {
			setLoader(true)
			setAllPurchasesSelected(true);
			dispatch(getPurchaseList(reObj))
		} else {
			setAllPurchasesSelected(false);
			await dispatch(getAllDocumentList(reObj));
		}
	}

	const callInitialListingFunction = () => {
		if (!docListLoading) {

			if (documentList?.length > 0) {
				setPageTotalCount(docTotalCount)
				setPageSize(docPageSize)
				setHrTemplatesList(documentList);
			}
			else {
				setLoader(false);
				setHrTemplatesList(documentList)
			}
		}
		if (userDocumentList?.length > 0 && documentList?.length > 0 && !purListLoading) {
			setLoader(false)
			setBtnLoader(false)
			setPageSize(docPageSize)
			setPageTotalCount(docTotalCount)
			const purchasedList = documentList.map(item => {
				if (userDocumentList.some(it => (it.productId === item.documentUploadId && it.purchaseStage === "Purchased"))) {
					return {
						...item,
						purchased: true
					}
				} else {
					return {
						...item
					}
				}
			})
			setHrTemplatesList(purchasedList)
			const cartList = userDocumentList.filter(item => {
				if (item.purchaseStage === "AddedToCart") {
					return item;
				}
			});
			setCartList(cartList);
		} else if (!purListLoading && userDocumentList?.length === 0) {
			setLoader(false)
			setCartList([]);
			setPageTotalCount(docTotalCount)
			setPageSize(docPageSize)
			setHrTemplatesList(documentList);

		}
	}

	useEffect(() => {
		let cartIds = cartList?.map((item) => {
			return item?.productId
		})
		setCardIds(cartIds);
	}, [cartList]);

	useEffect(() => {
		if (countries && countries.length > 0) {
			setCountryList(countries);
			setSearchCountry(countries);
		}
	}, [countries]);


	useEffect(async () => {
		if (cartSuccess == 200) {
			props.notify("Item added to cart");
			setLoader(false)
			await dispatch(addToCartAPI({ success: true }));
		}
		// else if()
	}, [cartSuccess]);


	const onPageChangedCalled = async (perPage) => {
		setPageNumber(perPage);
		const requestObject = {
			...docListrequestObject,
			page: perPage,
			pageSize: pageSize,
			searchterm: searchText
		};
		if (selectedCountry != null && selectedCountry.length > 0) {
			requestObject["countryIds"] = selectedCountry;
		}
		if (selectedLanguage != null && selectedLanguage.length > 0) {
			requestObject["languageIds"] = selectedLanguage;
		}
		if (selectedCategory != null && selectedCategory.length > 0) {
			requestObject["categorIds"] = selectedCategory;
		}
		setDocListRequestObject(requestObject);
		if (allPurchases) {
			setLoader(true)
			await dispatch(getPurchaseList(requestObject))
			window.scrollTo(0, 0);


		} else {
			dispatch(getAllDocumentList(requestObject));
			window.scrollTo(0, 0);
		}
		// dispatch(getAllDocumentList(requestObject));
	};

	const handleDropdownChange = async (e) => {
		const requestObject = {
			...docListrequestObject,
			page: 1,
			pageSize: e.target.value,
			searchterm: searchText
		};
		setPageNumber(1)

		setDocListRequestObject(requestObject);
		if (allPurchases) {
			setLoader(true)
			await dispatch(getPurchaseList(requestObject))
			window.scrollTo(0, 0);


		} else {
			dispatch(getAllDocumentList(requestObject));
			window.scrollTo(0, 0);
		}
	};


	const onTextChange = (e) => {
		setSearchItem(e.target.value);
		const updateValue = searchCountry.filter((item) => {
			return (
				item.country_Name
					.toLowerCase()
					.search(e.target.value.trim().toLowerCase()) !== -1
			);
		});
		setCountryList(updateValue);
	}

	const onCountryChange = async (id) => {
		setSearchTextClear(true);
		let tempData = [...selectedCountry];
		if (tempData.includes(id)) {
			const index = tempData.indexOf(id);
			tempData.splice(index, 1);
		}
		else {
			tempData.push(id);
		}
		setSelectedCountry(tempData);
		setPageNumber(1)

		const requestObject = {
			...docListrequestObject,
			page: 1,
			pageSize: pageSize,
		};

		if (tempData != null && tempData.length > 0) {
			requestObject["countryIds"] = tempData;
		} else {
			delete requestObject['countryIds'];
			// requestObject["countryIds"] = [];

		}
		setDocListRequestObject(requestObject);
		if (allPurchases) {
			setLoader(true)
			await dispatch(getPurchaseList(requestObject))

		} else {
			await dispatch(getAllDocumentList(requestObject));
		}
		if (countries.length) {
			setCountryList(countries)
		}

		window.scrollTo(0, 0);

	}


	const onCategoryChange = async (id) => {
		setSearchTextClear(true);
		let tempData = [...selectedCategory];
		if (tempData.includes(id)) {
			const index = tempData.indexOf(id);
			tempData.splice(index, 1);
		}
		else {
			tempData.push(id);
		}
		setSelectedCategory(tempData);
		setPageNumber(1)
		const requestObject = {
			...docListrequestObject,
			page: 1,
			pageSize: pageSize,
		};
		if (tempData != null && tempData.length > 0) {
			requestObject["categorIds"] = tempData;
		} else {
			delete requestObject['categorIds'];
		}
		setDocListRequestObject(requestObject);
		if (allPurchases) {
			setLoader(true)
			await dispatch(getPurchaseList(requestObject))

		} else {
			await dispatch(getAllDocumentList(requestObject));
		}

		setCountryList(countries)
		window.scrollTo(0, 0);
	}
	const addToCart = async (id) => {
		setLoader(true);
		await dispatch(addToCartAPI({ id }));
		await dispatch(callPurchasedDocumentList());

	};
	const openModal = (item) => {
		// let language = item?.documentUploads?.map((item) =>{
		// 	return item.languageName
		// })
		dispatch(getTemplateDetails(item?.document?.id))
		setItem(item);
		// setPreviewFileId(id);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const GotoReviewPage = () => {
		if (cartList?.length > 0 && cartList?.[0]?.productType !== "expert-hour") {
			history.push(constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART)
		}
		else {
			props.notify("Cart is empty");
		}
	};


	const handleClearFilter = () => {
		setSelectedCountry([]);
		setSelectedCategory([]);
		setSelectedLanguage([]);
		setSearchItem(""); //country name search input box
		setAllPurchasesSelected(false)
		setDocListRequestObject({
			page: 1,
			pageSize: 10,
		})
		dispatch(getAllDocumentList({
			page: pageNumber,
			pageSize: pageSize,
		}));
	};
	const numberFormat = (value) =>
		new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "USD",
			maximumSignificantDigits: 3,
		}).format(value);

	useEffect(() => {
		if (docListLoading) {
			setLoader(true);
		}

	}, [docListLoading])

	const downloadDocument = (doc,country) => {
		window.open(constants.API.COUNTRY.GET_FLAG_DOWNLOAD + doc.id, "_blank");
		mixpanel.track('HR template Download', {
			'Template Country Name':country,
			'User Details':userDetailsMixpnel()
		})
	}


	const showButton = (item) => {
		// subItem.purchased is for showing download btn for first rendering of Doc list & all purchases for
		//showing download btn for only purchases items.
		if ((item?.purchased)) {
			return (
				<div className="mx-auto">
					<button className="download-btn btn" data-test="download-doc" onClick={() => downloadDocument(item.upload,item?.countryName)}>
						<span>Download</span>
						<img src={download_btn} className="mb-1 mx-1" />

					</button>
				</div>
			)
		} else {
			return (
				<div className="doc-btn-container" data-test="add-to-cart">
					<button className="light-btn btn"
						// disabled={allPurchases}
						onClick={() => {
							openModal(item)
							mixpanel.track('Preview HR template', {
								'User Details':userDetailsMixpnel()
							})
						}} data-test='preview'>Preview</button>
					{(cardIds?.includes(item?.documentUploadId)) ?
						<span className="add-to-cart-btn">
							Added to Cart
						</span> :
						<button className="dark-btn btn"
							data-test="add-cart"
							// disabled={subItem?.addedToCart}
							onClick={() => addToCart(item.documentUploadId)}
						>
							Add to Cart
						</button>
					}
				</div>
			)
		}

	}

	return (
		<div data-test="hrtemplate-page" className="loader-enable">
			{
				loading &&
				(<div className="custom-loader h-full-loader">
					<Loader />
				</div>)
			}
			<div>

				<SupportButton />
				<KnowledgeBaseHeader
					{...props}
					cartList={cartList}
					title="Doc Shop"
					doc_shop={true}
					callDocumentList={callDocumentList}
					callSpecificDoc={callSpecificDoc}
					className="knowledge-header-container doc-shop-header"
					isSearchText={isSearchText}
					setSearchTextClear={setSearchTextClear}
				// searchField={searchText}
				// setSearchField={setSearchText}
				/>
				<div className="doc-cart-banner" data-test="banner">
					<div className="cart-count pointer"
						data-test="banner-cart"
						// style={{ "cursor": "unset" }}
						onClick={() => cartList?.length && cartList?.[0]?.productType !== "expert-hour" ?
							history.push(constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART)
							: ""}
					>
						<img src={cart_body_icon} alt="cart-icon" />
						<span  >{cartList?.length > 0 && cartList?.[0]?.productType !== "expert-hour" ? cartList.length : "No"} Items In Cart</span>
					</div>
					<div
						className="cart-btn-wrap review-checkout display_comingsoon"
					// {permissionArray?.includes(constants.PERMISSION_MAPPING.PURCHASE_NEW_HR_TEMPLATES) ?
					// 	"cart-btn-wrap review-checkout display_comingsoon " :
					// 	"a-disabled cart-btn-wrap review-checkout display_comingsoon"
					// }

					>
						<button
							data-test="review-page"
							// onClick={() => {
							// 	history.push({ pathname: constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART })
							// }}

							/**commenting onCLick for production process */
							onClick={GotoReviewPage}
						/**end  */
						>Review and Checkout</button>
						{/* <ComingSoon direction="bottom"></ComingSoon> */}
					</div>
				</div>
				<div className="knowledge-content-container article-grid-container doc-grid-container">
					<h4>HR Templates</h4>
					<div className="doc-grid-control" data-test="view-my-purchases" onClick={() => history.push(constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS)}>
						<span>View My Purchases</span>
					</div>
					{hrTemplateList && hrTemplateList?.length > 0 ?
						<>
							<div className="doc-card-grid custom-scroll" >
								{hrTemplateList?.map((item, index) => {
									// return item.documentUploads.map((subItem, subId) => {
									return (
										<div className="doc-card-item" key={index} data-test="template-card">
											<div className="doc-child-item">
												<div className="position-relative">
													<h3>{item?.countryName}</h3>
													{cardIds?.includes(item?.id) ?
														<img src={cart_body_icon} alt="cart-icon" /> : ""}
												</div>
												<span>
													<ion-icon class="folder-icon icon-yellow" name="folder-sharp" />
													{item?.category?.categoryName}
												</span>
												<div className="seperator"></div>
												<div className="doc-pricing align-items-center">
													<span>{item?.languageName}</span>
													<span>{numberFormat(item?.document?.price || item?.price)}</span>
												</div>
											</div>
											{
												showButton(item)
											}

										</div>
									)

									// })
								})}

							</div>
						</>
						:
						<div className="no-data-filter">
							No Data Available
						</div>

					}
					<div className="article-filter doc-filter" data-test="categoryList">
						<div className="article-filter-group">
							<h6>Filter
								<span data-test="clearFilter" onClick={handleClearFilter}>Clear</span>
							</h6>
							<h5>Template Type</h5>
							<div className="country-checkbox-container">
								{categoryList && categoryList.map((category, index) => {
									return (
										<div className="check-group checked" key={index} >
											<Checkbox
												inputId={category.id}
												className="checkbox"
												data-test="category-checkbox"
												checked={selectedCategory.includes(category.id)}
												onChange={() => onCategoryChange(category.id)}
											/>
											<label htmlFor={category.id} style={{ "cursor": "pointer" }}>{category.categoryName}</label>
										</div>
									)
								})}
							</div>
						</div>

						<div className="article-filter-group">
							<h5>Show Templates</h5>
							<div className="check-group checked" >
								<Checkbox
									className="checkbox"
									inputId="my-purchases"
									checked={allPurchases}
									// disabled={true}
									onChange={e => onTemplateChange(e.checked)}
									data-test="languageList"
								></Checkbox>
								<label htmlFor="my-purchases" style={{ "cursor": "pointer" }}>My Purchases</label>
							</div>

						</div>

						<div className="article-filter-group">
							<h5>Country</h5>
							<div className="article-search" data-test='search'>
								<button>
									<img src={searchIcon} alt="" />
								</button>
								<input
									type="text"
									placeholder="Search"
									value={searchItem}
									onChange={onTextChange}
									data-test='textChange'
								/>
							</div>
							<div className="country-checkbox-container">
								{countryList && countryList.map((country, index) => {
									return (
										<div className="check-group" key={index}>
											<Checkbox
												className="checkbox"
												data-test="country-checkbox"
												inputId={country.id}
												checked={selectedCountry.includes(country.id)}
												onChange={() => onCountryChange(country.id)}
											></Checkbox>
											<label htmlFor={country.id} style={{ "cursor": "pointer" }}>{country.country_Name}</label>
										</div>
									)
								})}
							</div>
						</div>
					</div>
					{hrTemplateList && hrTemplateList?.length > 0 ?
						<CustomePagination
							{...props}
							totalLength={totalCount}
							paginationPerPage={pageSize}
							onPageChangedCalled={onPageChangedCalled}
							pageNumber={pageNumber}
							limit={pageSize}
							paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
							handleDropdownChange={handleDropdownChange}
						/>
						: ""}
				</div>
			</div>
			{
				previewLanguage &&
				<OpenModal
					isOpen={showModal}
					dialogClassName="doc-modal"
					onCancelClickListner={handleCloseModal}
					previewFlag={true}
					previewFileId={previewFileId}
					cardId={cardIds}
					item={item}
					languages={languages}
					currentLanguage={previewLanguage}
					setCurrentLanguage={setPreviewLanguage}
					selectedTemplate={selectedTemplate?.documentUploads}
					setBtnLoader={setBtnLoader}
					loading={btnLoading}
					isHrTemplate={true}

				/>
			}

		</div>
	);

}
export default HRTemplateDocShop;
