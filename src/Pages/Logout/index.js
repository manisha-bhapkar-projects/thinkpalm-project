import React, { useEffect } from "react";
import expandologo from "../../assets/images/expandologologout.png";
import check_circle from "../../assets/images/check-circle-fill.png"
import keycloak from './../../keycloak';
import { useHistory } from "react-router-dom";

const Logout = (props) => {
    const history = useHistory();

    useEffect(() => {
        localStorage.removeItem("key-clock-token");
        document.title = "Logout";

    }, [])

    const handleSubmit = (e) => {
        // e.preventDefault();
        if (!localStorage.getItem("key-clock-token")) {
            keycloak?.logout({ redirectUri: window.location.origin + '/login' });
        } else {
            // var url = window.location.href
            // url = url.replace(url.split("#")[1], '')
            // window.location.href = url
            history.push("/")
            window.location.reload()
            return
        }
    };



    return (
        <div className="logout-bg" data-test="logoutdiv">
            <div className="login-wrapper">
                <div className="login-box confirm-act-wrap">

                    <h3>For security purposes, you were logged out due to inactivity. Click to login below.
                        {/* <img src={check_circle} /> */}
                    </h3>
                    <div className="form">
                        <div className="floating">
                            <button
                                type="button"
                                data-test="buttonClick"
                                className="btn btn-primary btn-login-active"
                                onClick={handleSubmit}
                            >
                                Continue to Login
                            </button>
                        </div>
                    </div>
                </div>
                <div className="expando_logo">
                    <img src={expandologo} />
                </div>
            </div>
        </div>
    );
};



export default Logout;

