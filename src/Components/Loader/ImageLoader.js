import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader"

import constants from "../../utils/constants";
/* Icon */
import watermarkImg from "../../assets/images/placeholder-img.svg";

const ImageRender = (props) => {
  const [defaultImage, setDefaultImage] = useState(true);
  const [loading, setLoading] = useState(true);

  const Loader = (props) => (
    <ContentLoader
      speed={2}
      width="100%"
      viewBox="0 0 100% 38"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      className={props.className}
      {...props}
    >
      <rect x="0" y="0" rx="2" ry="2" width="100%" height="88" />
    </ContentLoader>
  )

  const renderImage = () => {
    setLoading(true);
    if (props.url && props.url !== null && props.url !== "") {
      fetch(constants.API.COUNTRY.GET_FLAG_DOWNLOAD + props.url)
        .then(res => {
          if (res.status == 200) {
            setDefaultImage(false)
          } else {
            setDefaultImage(true);
          }
          setLoading(false);
        })
        .catch(err => {
          setDefaultImage(true);
          setLoading(false);
        })
    } else {
      setDefaultImage(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    renderImage();
  }, []);

  if (props.imageIsValid) {
    return defaultImage;
  }

  return (
    loading ? <Loader
      height={props.loaderHeight ? props.loaderHeight : 24}
      width={props.loaderWidth ? props.loaderWidth : "100%"}
      className={props.loaderClassName}
    />
      : <img
        src={(props.url && props.url != null && !defaultImage) ? (constants.API.COUNTRY.GET_FLAG_DOWNLOAD + props.url) : props.defaultImage ? props.defaultImage : watermarkImg}
        loading="lazy"
        className={(props.url && props.url != null && !defaultImage) ? props.className != undefined ? props.className : '' : props.className != undefined ? props.className : 'No-image'}
        alt={props.url}
      />
  );
};

export default ImageRender;