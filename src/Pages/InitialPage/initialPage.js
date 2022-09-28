import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import apiService from "../../services/apiService";
import { storeUserProfile } from "../../utils/storage/index";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../Store/reducers/user";
import { Link, useHistory } from "react-router-dom";
import constants from "../../utils/constants";
import Loader from "../../Components/Loader";
import { useKeycloak } from '@react-keycloak/web'
import { getKeyClockToken_Data } from "../../utils/storage/index";


const InitialPage = () => {
    const { keycloak, initialized } = useKeycloak();
    const keyclockData = getKeyClockToken_Data();
    const token_data = keyclockData ? jwt_decode(keyclockData) : undefined;
    // let token_data = keycloak?.idTokenParsed;
    let keyClockId = token_data.sub
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoader] = useState(true);


    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        jobTitle: "",
        companyName: "",
        filePathUri: "",
        preferredName: "",
        industryName: "",
        isPrimaryUser: "",
        isAccountOwner: "",
        roleName: "",
        isAdUser: token_data?.aud?.includes("broker") || false
    });

    useEffect(() => {
        localStorage.setItem("userProfileDetails", JSON.stringify(initialValues));
    }, [initialValues])

    const checkRoute = (res) => {
        const { data: { isAccountOwner, roleName } } = res;

        const initialVal = {
            ...initialValues,
            companyName: res?.data?.company?.companyName,
            industryName: res?.data?.company?.industryName,
            emailId: res?.data?.emailId,
            firstName: res?.data?.userProfile?.firstName,
            preferredName: res?.data?.userProfile?.preferredName,
            lastName: res?.data?.userProfile?.lastName,
            jobTitle: res?.data?.userProfile?.jobTitle,
            isPrimaryUser: res?.data?.isPrimaryUser,
            isAccountOwner: res?.data?.isAccountOwner,
            imageUrl: res?.data?.userProfile?.imageUrl,
            roleName: res?.data?.roleName,
            userId: res?.data?.userProfile?.userId,
            id: res?.data?.userProfile?.id,
            isAdUser: token_data?.aud?.includes("broker") || false,
            // requestParams: res?.data?.userProfile
        };


        setInitialValues(initialVal);
        if (res?.data?.roleName && res?.data?.userProfile) {
            console.log('isAccountOwner', res.data)
            let newDataProfile = res.data.userProfile;
            newDataProfile.roleName = res.data.roleName;
            newDataProfile.company = res.data.company;
            newDataProfile.isAccountOwner = res.data.isAccountOwner;
            newDataProfile.isAdmin = res.data.isAdmin;
            newDataProfile.isPrimaryUser = res.data.isPrimaryUser;
            newDataProfile.isAdUser = token_data?.aud?.includes("broker") || false;

            storeUserProfile(res.data.userProfile ? newDataProfile : {});
            dispatch(setUserProfile(res.data.userProfile ? newDataProfile : {}));
        }

        if (
            initialVal.companyName &&
            initialVal.industryName &&
            initialVal.emailId &&
            initialVal.firstName &&
            initialVal.preferredName &&
            initialVal.lastName &&
            !initialVal.isPrimaryUser
        ) {
            // Routes to home page if not primary user
            setLoader(false);
            history.push(constants.ROUTE.HOME_PAGE.HOME);
        } else {
            setLoader(false);

            history.push(constants.ROUTE.USER.USER_PROFILE)
        }
    }
    const callBrokerAPI = () => {
        if (token_data && !token_data?.UserId && token_data?.aud?.includes("broker")) {
            apiService.getInternalUserAPI().then(res => {
                callHomeComponent();

            })
        }
    }
    const callHomeComponent = () => {
        // api call to get user details and if redirects to home if user is not first time user.
        apiService.getUserDetails(keyClockId).then(res => {
            console.log(res);
            checkRoute(res)
        })
    }
    useEffect(() => {
        if (token_data) {
            if (token_data && !token_data?.UserId && token_data?.aud?.includes("broker")) {
                callBrokerAPI()
            } else {
                callHomeComponent()
            }
        }
    }, [])

    if (loading)
        return (
            <div className="white-overlay">
                <div className="msg-wrapper-loader">
                    <Loader />
                </div>
            </div>
        );
    else
        return (
            <></>
        )
}
export default InitialPage;
