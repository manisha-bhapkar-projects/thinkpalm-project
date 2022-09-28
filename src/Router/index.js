import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router";
import Layout from "../Components/Layout/Layout";
import Loader from "../Components/Loader";
import constants from "../utils/constants";
import { getKeyClockToken_Data } from "../utils/storage";
import { useDispatch } from "react-redux";
import { notifyAction } from "../Store/reducers/notification";
import { path } from "@amcharts/amcharts4/core";
import { useKeycloak } from '@react-keycloak/web'
import { HashRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { storeKeyClockToken } from "../utils/storage/index";
import constant from "../utils/constants";


const InitialPage = lazy(() => import("../Pages/InitialPage/initialPage"))
const Logout = lazy(() => import("../Pages/Logout"))
const Home = lazy(() => import("../Pages/Home"))
const UserProfile = lazy(() => import("../Pages/User/UserProfile"))
const history = createBrowserHistory;


const RestrictedRoute = ({
	component: Component,
	layoutSettings = {},
	path = "",
	...rest
}) => {
	const dispatch = useDispatch();
	let keys = [];
	for (var key in localStorage) {
		keys.push(key)
	}
	if (localStorage.length <= 0) {
		var url = window.location.href
		url = url.replace(url.split("#")[1], '/logout')
		window.location.href = url

	}

	// if (!userToken) return <Redirect to="/" />;

	const notify = (message, timeOut) => {
		dispatch(notifyAction({ message, timeOut }));
	};

	return (
		<Route
			{...rest}
			path={[path, `/:hash/${path}`]}
			component={(routerProps) => (
				<Layout settings={layoutSettings} {...routerProps}>
					<Component notify={notify} {...routerProps} />
				</Layout>
			)}
		/>
	);
};


export default function Router() {

	const { keycloak, initialized } = useKeycloak();

	console.log("init, ", keycloak)
	// keycloak.onTokenExpired = () => {
	// 	keycloak.logout();
	// }
	keycloak.onAuthLogout = () => {
		console.log("keycloak.initialized", keycloak.initialized, keycloak.authenticated)
		/** This code has been written because history.push didn't worked as expected.
		 *  Route changes but component rendering got failed */
		var url = window.location.href
		url = url.replace(url.split("#")[1], '/logout')
		window.location.href = url

		return;
	}
	keycloak.onAuthRefreshError = () => {
		var url = window.location.href
		url = url.replace(url.split("#")[1], '/logout')
		window.location.href = url

		return
	}

	if (initialized && !keycloak.authenticated) {
		keycloak?.login({ redirectUri: window.location.origin + '/login/#' });
	}
	if (initialized && keycloak.authenticated) {
		// if (localStorage.length !== 1) {
		// 	var url = window.location.href
		// 	url = url.replace(url.split("#")[1], '/')
		// 	window.location.href = url
		// 	storeKeyClockToken(keycloak.token);

		// }
		storeKeyClockToken(keycloak.token);
	}
	return (
		<Suspense fallback={<Loader />}>
			{
				<HashRouter history={history}>
					<Switch>
						<Route
							layoutSettings={{
								isUserRegistration: true,
							}}
							path="/logout" exact component={Logout}
						/>
						{
							constant.CHAT_BOT && initialized && keycloak.authenticated &&
							<chat-element user-details={
								JSON.stringify({
									token: keycloak?.token,
									refreshToken: keycloak?.refreshToken
								})} >

							</chat-element>
						}
					</Switch>
				</HashRouter>
			}
			{
				initialized && keycloak.authenticated &&
				<HashRouter history={history}>
					<Switch>
						<Route
							layoutSettings={{
								isUserRegistration: true,
							}}
							path="/" exact component={InitialPage}
						/>
						{/* <Route
							layoutSettings={{
								isUserRegistration: true,
							}}
							path="/logout" exact component={Logout}
						/> */}
						<RestrictedRoute path={constants.ROUTE.HOME_PAGE.HOME}
							layoutSettings={{
								sidebarSettings: {
									active: "home",
								},
							}}
							exact component={Home}
						/>
						<RestrictedRoute path={constants.ROUTE.USER.USER_PROFILE}
							layoutSettings={{
								isUserRegistration: true,
							}}
							exact component={UserProfile}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								isUserRegistration: true,
							}}
							path={constants.ROUTE.USER.ADD_USER}
							component={lazy(() => import("../Pages/User/AddUser"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								isUserRegistration: true,
							}}
							path={constants.ROUTE.LOCATION.LOCATION}
							component={lazy(() => import("../Pages/Location"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								isUserRegistration: true,
							}}
							path={constants.ROUTE.COUNTRY.COUNTRY}
							component={lazy(() => import("../Pages/Country"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								isUserRegistration: true,
							}}
							path={constants.ROUTE.REGISTRATION_FLOW.EMPLOYEE_INFORMATION}
							component={lazy(() => import("../Pages/RegistrationFlow/employeeInformation"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home",
								},
							}}
							path={constants.ROUTE.DETAILS_PAGE.DETAILS}
							component={lazy(() => import("../Pages/CountryDetails"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "globe",
								},
							}}
							path={constants.ROUTE.DETAILS_PAGE.CUSTOM_HOME_DETAILS}
							component={lazy(() => import("../Pages/CountryDetails"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home",
								},
							}}
							path={constants.ROUTE.COUNTRY_COMPARE.COMPARE}
							component={lazy(() => import("../Pages/CountryCompare"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.USERLIST}
							component={lazy(() => import("../Pages/Settings/User_and_Accounts"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_BRIEFS}
							component={lazy(() => import("../Pages/Settings/Briefs/Manage_Briefs_listing"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_QUERY_BY_ID}
							component={lazy(() => import("../Pages/Settings/Briefs/Manage_Qurey"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.VIEW_QUERY_BY_ID}
							component={lazy(() => import("../Pages/Settings/Briefs/View_Query"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.ADD_QUERY}
							component={lazy(() => import("../Pages/Settings/Briefs/Add_Query"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_ESTIMATE}
							component={lazy(() => import("../Pages/Settings/Purchases & Expert_Briefs/View_Estimate"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_ESTIMATE_BY_ID}
							component={lazy(() => import("../Pages/Settings/Purchases & Expert_Briefs/View_Estimate"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_QUERY}
							component={lazy(() => import("../Pages/Settings/Purchases & Expert_Briefs/View_Query"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_QUERY_BY_ID}
							component={lazy(() => import("../Pages/Settings/Purchases & Expert_Briefs/View_Query"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.ADD_USER}
							component={lazy(() =>
								import("../Pages/Settings/User_and_Accounts/SuperAdminAddUser")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.ADD_USER_ACCOUNTS}
							component={lazy(() =>
								import("../Pages/Settings/User_and_Accounts/SuperAdminAddUser")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.EDIT_USER_BY_ID}
							component={lazy(() =>
								import("../Pages/Settings/User_and_Accounts/SuperAdminEditUser")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.SEARCH_PAGE}
							component={lazy(() =>
								import("../Pages/Settings/SearchResultPage")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.ROLES_PAGE.ROLES}
							component={lazy(() => import("../Pages/Roles/Managerole"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "create-roles",
								},
							}}
							path={constants.ROUTE.ROLES_PAGE.CREATE_ROLES}
							component={lazy(() => import("../Pages/Roles/Createrole"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "edit-role",
								},
							}}
							path={constants.ROUTE.ROLES_PAGE.EDIT_ROLES}
							component={lazy(() => import("../Pages/Roles/EditRoles"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "view-role",
								},
							}}
							path={constants.ROUTE.ROLES_PAGE.VIEW_ROLES}
							component={lazy(() => import("../Pages/Roles/Viewroles"))}
						/>


						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.HOME}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/knowledgeHome")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={
								constants.ROUTE.SIDEBAR.SETTINGS.COUNTRY_CONFIGURATION
							}
							component={lazy(() =>
								import(
									"../Pages/Settings/Countries/CountryConfigurationList"
								)
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={
								constants.ROUTE.SIDEBAR.SETTINGS
									.COUNTRY_CONFIGURATION_VIEW
							}
							component={lazy(() =>
								import(
									"../Pages/Settings/Countries/CountryConfigurationView"
								)
							)}
						/>
						{/* newly created route */}

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.INSIGHTS_ANALYSIS}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/InsightsAndAnalysis")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.INSIGHTS_ANALYSIS_Name}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/InsightsAndAnalysis")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "globe",
								},
							}}
							path={constants.ROUTE.COUNTRY.ALL_COUNTRY}
							component={lazy(() =>
								import("../Pages/AllCountry/AllCountry")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "globe",
								},
							}}
							path={constants.ROUTE.COUNTRY.UN_FAVORITE_COUNTRIES}
							component={lazy(() =>
								import("../Pages/AllCountry/UnFavoriteCountries/index")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "globe",
								},
							}}
							path={
								constants.ROUTE.DETAILS_PAGE
									.CUSTOM_UN_FAV_COUNTRY_DETAILS
							}
							component={lazy(() =>
								import("../Pages/AllCountry/UnFavoriteCountries/index")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/ArticlePage")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE_Name}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/ArticlePage")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE_Country_Name}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/ArticlePage")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.FAQ}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/FrequentlyAsked")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home",
								},
							}}
							path={constants.ROUTE.SUBSCRIPTIONS}
							component={lazy(() => import("../Pages/Subscriptions"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.MY_ACCOUNT}
							component={lazy(() =>
								import("../Pages/Settings/MyAccount/index")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.FAVORITE_COUNTRIES}
							component={lazy(() =>
								import("../Pages/Settings/FavoriteCounries/index")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.ADD_COUNTRY}
							component={lazy(() =>
								import("../Pages/Settings/FavoriteCounries/AddCountry")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.PURCHASES}
							component={lazy(() => import("../Pages/Settings/Purchases & Expert_Briefs/Purchases"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.USERS}
							component={lazy(() => import("../Pages/Settings/Users/Users"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS}
							component={lazy(() => import("../Pages/Settings/Purchases & Expert_Briefs/index"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings",
								},
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS_BY_PAGE}
							component={lazy(() => import("../Pages/Settings/Purchases & Expert_Briefs/index"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home",
								},
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE}
							component={lazy(() =>
								import("../Pages/KnowledgeBase/ArticlePage")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "subscription",
								},
							}}
							path={constants.ROUTE.SUBSCRIPTION_PAGE.ALL}
							component={lazy(() =>
								import("../Pages/Subscription/Index")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "subscription",
								},
							}}
							path={constants.ROUTE.SUBSCRIPTION_PAGE.CREATE}
							component={lazy(() =>
								import("../Pages/Subscription/create")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "subscription",
								},
							}}
							path={constants.ROUTE.SUBSCRIPTION_PAGE.VIEW}
							component={lazy(() => import("../Pages/Subscription/view"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "subscription",
								},
							}}
							path={constants.ROUTE.SUBSCRIPTION_PAGE.EDIT}
							component={lazy(() => import("../Pages/Subscription/create"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "cart",
								},
							}}
							path={constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP}
							component={lazy(() =>
								import("../Pages/HRTemplates/HRTemplateDocShop")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "cart",
								},
							}}
							path={constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART}
							component={lazy(() =>
								import("../Pages/HRTemplates/InYourCart")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "cart",
								},
							}}
							path={constants.ROUTE.HR_TEMPLATE_PAGE.REVIEW_PAYMENT}
							component={lazy(() =>
								import("../Pages/HRTemplates/docShopPayment")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "cart",
								},
							}}
							path={constants.ROUTE.HR_TEMPLATE_PAGE.CONFIRM_PAYMENT}
							component={lazy(() =>
								import("../Pages/HRTemplates/docShopConfirm")
							)}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "cart",
								},
							}}
							path={constants.ROUTE.HR_TEMPLATE_PAGE.PAYMENT_SUCCESS_Name}
							component={lazy(() =>
								import("../Pages/HRTemplates/docShopSuccess")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "cart",
								},
							}}
							path={constants.ROUTE.HR_TEMPLATE_PAGE.PAYMENT_FAILED}
							component={lazy(() =>
								import("../Pages/HRTemplates/docShopSuccess")
							)}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "cart",
								},
							}}
							path={constants.ROUTE.HR_TEMPLATE_PAGE.PAYMENT_SUCCESS}
							component={lazy(() =>
								import("../Pages/HRTemplates/docShopSuccess")
							)}
						/>

						{/* HR Template */}
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home"
								}
							}}
							path={constants.ROUTE.HR_TEMPLATE.LIST}
							component={lazy(() => import("../Pages/HRDocument/TemplateList"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home"
								}
							}}
							path={constants.ROUTE.HR_TEMPLATE.ARCHIVE}
							component={lazy(() => import("../Pages/HRDocument/Archive"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home"
								}
							}}
							path={constants.ROUTE.HR_TEMPLATE.ADD_NEW_TEMPLATE}
							component={lazy(() => import("../Pages/HRDocument/AddEditTemplate"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.HR_TEMPLATE.VIEW_EDIT_NEW_TEMPLATE}
							component={lazy(() => import("../Pages/HRDocument/AddEditTemplate"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.ADD_ACCOUNT}
							component={lazy(() => import("../Pages/Settings/User_and_Accounts/AddAccount"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.USER_LIST_BY_PAGE}
							component={lazy(() => import("../Pages/Settings/User_and_Accounts/index"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.EDIT_ACCOUNT}
							component={lazy(() => import("../Pages/Settings/User_and_Accounts/EditAccount"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.VIEW_ACCOUNT}
							component={lazy(() => import("../Pages/Settings/User_and_Accounts/EditAccount"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.REACTIVATE_ACCOUNT}
							component={lazy(() => import("../Pages/Settings/User_and_Accounts/EditAccount"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.USER_ADD_EDIT}
							component={lazy(() => import("../Pages/Settings/Users/UserAddEdit"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.FOURM_HOME}
							component={lazy(() => import("../Pages/Fourm"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							// path={constants.ROUTE.BUY_MORE_HOURS.REVIEW_PAYMENT}
							path='/buy-more-hours-review-and-pay/:refNo/:id'
							component={lazy(() => import("../Pages/AddMoreHoursPayment/addMoreHoursPayment"))} />
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							// path={constants.ROUTE.BUY_MORE_HOURS.REVIEW_PAYMENT}
							path='/buy-more-hours-review-and-pay/:fromCards'
							component={lazy(() => import("../Pages/AddMoreHoursPayment/addMoreHoursPayment"))} />

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "settings"
								}
							}}
							// path={constants.ROUTE.BUY_MORE_HOURS.REVIEW_PAYMENT}
							path={constants.ROUTE.BUY_MORE_HOURS.REVIEW_PAYMENT}
							component={lazy(() => import("../Pages/AddMoreHoursPayment/addMoreHoursPayment"))} />

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "home"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.EGSFOURM_HOME}
							component={lazy(() => import("../Pages/Fourm/indexegs"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book"
								}
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.ALERTS_COUNTRY_PAGE}
							component={lazy(() => import("../Pages/Alerts"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book"
								}
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.ALERTS_HOME_PAGE}
							component={lazy(() => import("../Pages/Alerts"))}
						/>

						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "book"
								}
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.MANAGE_ALERTS}
							component={lazy(() => import("../Pages/Alerts/manageAlerts"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "charts"
								}
							}}
							path={constants.ROUTE.SIDEBAR.SETTINGS.PEOPLE_ANALYTICS}
							component={lazy(() => import("../Pages/Settings/PeopleAnalytics/index"))}
						/>
						<RestrictedRoute
							exact
							layoutSettings={{
								sidebarSettings: {
									active: "books"
								}
							}}
							path={constants.ROUTE.KNOWLEDGE_BASE.PRODUCT_UPDATES}
							component={lazy(() => import("../Pages/KnowledgeBase/ProductUpdates/index.js"))}
						/>

					</Switch>

				</HashRouter>

			}

		</Suspense>
	);
}
