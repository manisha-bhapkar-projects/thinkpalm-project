import React, { Component, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import constants from "../../utils/constants";
import SearchHeaderText from "../../Components/SearchHeaderText/SearchHeaderText";

import Loader from "../../Components/Loader";

const Fourm = () => {
  var FORUM_URL = "";
  if (process.env.NODE_ENV == "development") {
    FORUM_URL = constants.FOURM.GLOBAL_FORUM_DEV;
  } else if (process.env.NODE_ENV == "testing") {
    FORUM_URL = constants.FOURM.GLOBAL_FORUM_TESTING;
  } else if (process.env.NODE_ENV == "staging") {
    FORUM_URL = constants.FOURM.GLOBAL_FORUM_STAGING;
  } else if (process.env.NODE_ENV == "production") {
    FORUM_URL = constants.FOURM.GLOBAL_FORUM_PRODUCTION;
  }

  const styles = {
    "padding-left": "0px",
    overflow: "hidden",
  };
  const disabledStyles = {
    "padding-left": "0px",
    overflow: "hidden",
    pointerEvents: "none",
  };
  const [loading, setLoading] = useState(true);
  const data = () => {
    var iframe = document.getElementById("flarum_iframe");

    setTimeout(() => {
      setLoading(false);

    }, 10000);
  };

  return (
    <>
      <div data-test="my-account">
        <SearchHeaderText
          data-testid="handleSubmit"
          cartIconWhite="dark"
        />
        {loading && (
          <div className="custom-loader h-full-loader">
            <Loader />
          </div>
        )}

        <div className="" style={!loading ? styles : disabledStyles}>
          <iframe
            id="flarum_iframe"
            src={FORUM_URL}
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            width="100%"
            style={{ height: "calc(100vh - 6px)" }}
            onLoad={data}
          />
        </div>
      </div>
    </>
  );
};

export default Fourm;
