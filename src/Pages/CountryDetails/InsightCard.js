import React from 'react';

const InsightCard = (props) =>{
    
    return(
        <React.Fragment>
            <div className="col-lg-4 gap-tp-20">
      <div className="country-card pt-4">
        <div className="card-header-wrap">
          <ion-icon name="document-outline" className="paper-fold" />
          Insights &amp; Analysis
          <a href>Show more</a>
        </div>
        <div className="details-wrap">
          <span>Article
            <div className="date-ctrl">Jan 2, 2022</div>
          </span>
          <span className="maintitle mt-1 mb-1">Internationally recognized human resources thought leader provides women with a framework to win in new </span>
        </div>
        <div className="details-wrap mt-4">
          <span>Whitepaper
            <div className="date-ctrl">Jan 2, 2022</div>
          </span>
          <span className="maintitle mt-1 mb-1">COVID -19 Implications on workplaces</span>
        </div>
        <div className="details-wrap mt-4">
          <span>Blog
            <div className="date-ctrl">Jan 2, 2022</div>
          </span>
          <span className="maintitle mt-1 mb-1 pr-0">How does France do it? </span>
        </div>
      </div>
    </div>
    
        </React.Fragment>
    )
}

export default InsightCard;