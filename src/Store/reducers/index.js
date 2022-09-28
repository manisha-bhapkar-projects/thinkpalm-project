import user from "./user"
import country from "./country"
import knowledgeBase from "./knowledgeBase"
import superAdminUserReducer from "./superAdminUser"
import searchResultReducer from "./searchResult"
import subscriptionData from './subscription'
import notification from "./notification"
import HRTemplate from "./HRTemplate"
import myAccountReducer from "./myAccount";
import favoriteCountriesReducer from "./favoriteCountries";
import purchaseExpertReducer from "./Purchase_ExpertBriefs";
import AddMoreHours from "./AddMoreHours";
import alertsReducer from "./alertsReducer";
import manageAlertReducer from "./ManageAlerts";

const reducers = {
    user,
    country,
    superAdminUserReducer,
    searchResultReducer,
    notification,
    knowledgeBase,
    myAccountReducer,
    favoriteCountriesReducer,
    subscriptionData,
    HRTemplate,
    purchaseExpertReducer,
    AddMoreHours,
    alertsReducer,
    manageAlertReducer
};

export default reducers;