import React from "react";
import Slider from "react-slick";
import country_img from "../../assets/images/Hero-Image-askan.jpg";
import flag_img from "../../assets/images/flag.svg";

import constants from "../../utils/constants";
import { useHistory } from "react-router-dom";
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from "../../utils/utils";
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const PopularCountryCarousel = (props) => {
  const { popularCountries = [], allCountry = [],countryList=[] } = props;
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: popularCountries.length < 4 ? popularCountries.length : 4,
    slidesToScroll: 4,
  };
  const history = useHistory();
  const onNavigateCountry = async (navigatePath) => {
    history.push(navigatePath)
  }
  const getCountryFlag = (country) => {
    if (allCountry && allCountry.length) {
      let imagContent =
        allCountry &&
        allCountry.find((e) => {
          return e.country_Name == country;
        });
      return imagContent.flag_Upload_Id;
    }
    return " ";
  };

  return (
    <div className="container-fluid">
      <Slider {...settings}>
        {popularCountries &&
          popularCountries.map((item, index) => {
            return (
              <div className="slick-card-gap" key={index}>
                <div className="country-card pointer" onClick={()=>{
                  let fav=false
                  countryList?.find((count)=>{
                    if(count.id===item.country.id){
                      fav=true
                     
                    }
                  })
                  if(fav){
                    onNavigateCountry({
                      pathname: `/details/${item.country.id}`,
                    })
                  }else{
                    onNavigateCountry({
                      pathname: `/unfavorite-countries/${item.countryName}/${item.countryId}`,
                      state:{
                        fromHome:true
                      }
                     
                    })
                  }
                  mixpanel.track('Popular countries', {'Country name' : item.countryName,
                  'User Details':userDetailsMixpnel()})
                }}>
                  <div className="country-image-wrapper">
                    <h3>
                      {item?.country?.flag_Upload_Id && (
                        <img
                          src={`${constants.IMAGE.DOWNLOAD}${item?.country?.flag_Upload_Id}`}
                        />
                      )}
                      {item.countryName}
                    </h3>
                  </div>
                  <div className="country-image">
                    {item?.country?.header_Image_Id && (
                      <img
                        src={`${constants.IMAGE.DOWNLOAD}${item?.country?.header_Image_Id}`}
                      />
                    )}
                  </div>
                  <div className="details-wrap fixed-height">
                    <span>
                      <div
                        className="override-para-style"
                        dangerouslySetInnerHTML={{
                          __html: item.supertopicContent,
                        }}
                      ></div>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </Slider>
    </div>
  );
};

export default PopularCountryCarousel;
