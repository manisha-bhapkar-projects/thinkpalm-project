import ContentLoader from "react-content-loader"
import ImageLoader from "../../Components/Loader/ImageLoader";
import countryImage from "../../assets/images/Hero-image-Africa.jpg";
import flagIcon from "../../assets/images/flag.svg";
import pinIcon from "../../assets/images/white-pin.svg";

const Loader = (props) => (
    <ContentLoader
        speed={2}
        width="100%"
        height={88}
        viewBox="0 0 100% 38"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
        
    >
        <rect x="0" y="0" rx="2" ry="2" width="100%" height="88" />
    </ContentLoader>
)

export const CardLoader = (props) => (
    <div className="country-card" key={Math.random().toString(36).substr(2, 5)} data-test="Loader">
        <div className="country-image-wrapper">
            <Loader  />
        </div>
        <div className="country-image">
            <img src={countryImage} alt="" />
        </div>
        {/* countiesList */}
        <div className="country-compare-card">
            <h5 className="">Advantages</h5>
            <p><Loader /></p>
            <hr></hr>
            <h6 className="">Risk Factors</h6>
            <p><Loader /></p>
        </div>
    </div>
)

const getTopicDetailByName = (topics, name) => {
    if (topics && topics !== null && topics.length > 0 && name) {
        let superTopic = topics.find((topic) => topic.supertopicName === name);
        if (superTopic && superTopic.supertopicContent != null) {
            return <p dangerouslySetInnerHTML={{ __html: superTopic.supertopicContent }}></p>
        } else {
            return <p>No Data available</p>
        }
    }

    return <p>No Data available</p>;
};

export const CountryCard = ({ item, onNavigateCountryDetailsPage }) => {
    
        return (
            <div className="country-card" key={Math.random().toString(36).substr(2, 5)} onClick={() => onNavigateCountryDetailsPage(item)} data-test="CardDiv">
                <div className="country-image-wrapper">
                    <h3>
                        {item.countryName}
                        {
                            <ImageLoader
                                url={item.flag_Upload_Id}
                                defaultImage={flagIcon}
                                loaderWidth={38}
                                loaderClassName="customer-image-loader"
                                className="flag-icon"
                            />
                        }
                        {/* <img src={flagIcon} alt="" className="flag-icon" />  */}
                        {item.isFavourite && <img src={pinIcon} alt="" className="pin-icon" />}
                    </h3>
                </div>
                <div className="country-image">
                    {
                        <ImageLoader
                            url={item.header_Image_Id}
                            defaultImage={countryImage}
                        />
                    }
                    {/* <img src={countryImage} alt="" /> */}
                </div>
                <div className="country-compare-card" >
                    <h5 className="" >Advantages</h5>
                    {getTopicDetailByName(item.topics, "Advantages")}
                    {/* <p>Good Social Security Measures, employee
                    benefits, basic visa requirements and public
                    healthcare. A couple of other advantages of
                    expanding here.</p> */}
                    <hr></hr>
                    <h6 className="">Risk Factors</h6>
                    {getTopicDetailByName(item.topics, "Risk Factors")}
                    {/* <p>High Corporate Taxes, constand updates to
                    labour laws and legal framework, one other
                    factor for employers to consider before
                    expanding into this country.</p> */}
                </div>
            </div>
        )
    

   
}


