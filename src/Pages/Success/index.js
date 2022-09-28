import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import constants from "../../utils/constants";
import Arrow from "../../assets/images/curve-arrow.png";
import { getUserProfile } from "../../utils/storage";
import homeIcon from "../../assets/images/home.svg";
import WorkFromHome from "../../assets/images/dayflow-work-from-home.svg";
import close from "../../assets/images/feather_x.svg";



// import Joyride, { CallBackProps, STATUS, Step, StoreHelpers } from 'react-joyride';
import Tour from 'reactour'

const Success = (props) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isTourOpen, setIsTourOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let user_data = getUserProfile();
    setImageUrl(user_data.imageUrl);
    console.log("succ", user_data);
  }, []);

  const gotoHomePage = () => {
    sessionStorage.removeItem("showTutorial");
    if (props.onClose) props.onClose();
  };
  const steps = [
    {
      selector: '.home',
      action: node => {
        // by using this, focus trap is temporary disabled
        document.body.querySelector('[data-tour-elem = "left-arrow"]').disabled = false;
      },

      content: () => (
        <div className="position-relative pop-up-content">
          Welcome to your Home Page. Here you can find your pinned countries
          <div class="custom-arrow-left"></div>
        </div>
      )

    },
    {
      selector: '.table-view',
      content: () => (
        <div className="position-relative pop-up-content">
          Toggle between a table view and grid view to see all your pinned countries, however you may like.
          <div class="custom-arrow-right " style={{ "top": "-12px" }}></div>
        </div>
      )
    },
    {
      selector: '.globe',
      content: () => (
        <div className="position-relative pop-up-content">
          The All Countries page lists all countries covered by our researchers. Browse through the catalog to explore.
          <div class="custom-arrow-left"></div>
        </div>
      )
    },
    {
      selector: '.book',
      content: () => (
        <div className="position-relative pop-up-content">
          Go to the Knowledge Base to search through curated content, frequently asked questions, or the global HR forum to connect with other platform users across the globe.
          <div class="custom-arrow-left"></div>
        </div>
      )
    },
    {
      selector: '.cart',
      content: () => (
        <div className="position-relative pop-up-content">
          Our Doc Shop has all your HR Template needs covered. Search by country or document type to find templates you need. In multiple languages too!
          <div class="custom-arrow-left"></div>
        </div>
      )

    },
    {
      selector: '.dropright',
      content: () => (
        <div className="position-relative pop-up-content">
          Manage your account, purchases and subscription in Settings. You’re in control here, this is where you configure the fun stuff
          <div class="custom-arrow-left" style={{ "top": "148px" }}></div>
        </div>
      ),
    },
    {
      selector: '.profile-wrap',
      content: () => (
        <div className="position-relative pop-up-content">
          A quick way to manage your profile info, change password etc
          <div class="custom-arrow-right "></div>
        </div>
      ),
    },
    {
      selector: '.profile-wraps',
      // content: () => (
      //   <div className="position-relative">
      //     A quick way to manage your profile info, change password etc
      //     <div class="custom-arrow-right "></div>
      //   </div>
      // ),
    },


    // ...
  ];

  return (
    <>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        // onRequestClose={() => {
        //   debugger
        //   setIsTourOpen(false)
        // }}
        showNumber={false}
        showArrow={true}
        className="customClass"
        showNavigationNumber={false}
        showNavigation={false}
        prevButton={<p className="skip-tour my-3" onClick={() => setIsTourOpen(false)}>Skip Tour</p>}
        showCloseButton={false}
        disableInteraction={true}
        goToStep={currentStep}
        maskSpace={0}
        nextStep={target => {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          if (nextStep === 6) {
            document.getElementById("mask-main").children[1].setAttribute("class", "round-profile-pic")
            document.getElementsByClassName("customClass")[0].style.top = "0px"
            document.getElementsByClassName("customClass")[0].style.marginLeft = "-14px"
          } else if (nextStep === 1) {
            document.getElementsByClassName("customClass")[0].style.top = "-10px"
            document.getElementsByClassName("customClass")[0].style.marginLeft = "-12px"
          } else if (nextStep === 7) {
            setIsTourOpen(false)
          } else {
            document.getElementsByClassName("customClass")[0].style.top = "0px"
            document.getElementsByClassName("customClass")[0].style.marginLeft = "16px"
            document.getElementById("mask-main").children[1].removeAttribute("class", "round-profile-pic")

          }
        }}
        nextButton={<span class="btn btn-main w-auto" >Next</span>}
      />
      {
        !isTourOpen &&
        <div className="black-overlay">
          <div className="msg-wrapper">
            <img className="closeTour" src={close} onClick={gotoHomePage} />
            <h3>You’re all set.</h3>
            <div className="text-center ">

              <div>
                <img src={WorkFromHome} />
              </div>
              <p>
                We hope you’ll love our platform.
              </p>
              <span onClick={gotoHomePage} className="btn btn-primary">
                Get Started
              </span>
            </div>
          </div>
        </div>
      }

    </>
  );
};

export default Success;
