import React, { useState } from 'react';

const Tabdata = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const onTitleClick = (i) => {
        setActiveIndex(i);
    }
    const featur_data = props.feat_data;
    let feat_temp = "";
    let active = "";
    let feat_temp_sub = "";
    if (featur_data != null) {
        feat_temp = featur_data.map((e, i) => {
            active = i === activeIndex ? "active" : "";
            let feat_temp_name = e.featureGroup.featureGroupName;

            return <a key ={i} className={`nav-link  ${active} pointer link`} id="v-pills-home-tab" data-toggle="pill"  role="tab" aria-controls="v-pills-home" aria-selected="true" onClick={() => { onTitleClick(i) }} data-test="title">{feat_temp_name}</a>

        })
        feat_temp_sub = featur_data.map((e, i) => {
            active = i === activeIndex ? "active" : "";
            let sub_feat_temp = e.features.map((e, i) => {
                return (
                    <div className="checkbox-wrapper" key={i}>
                        <label className="tab-checkbox ">{e.featureName}
                            <input type="checkbox"   value={e.id} onChange={e => { props.box_click_fun(e) }} data-test="name" />
                            <span className="checkmark" />
                        </label>
                    </div>
                )
            })
            return (
                <div key={i} className={`custom_tab_fet tab-pane fade show ${active}`} id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    {sub_feat_temp}
                </div>
            )

        })
    }



    return (
        <React.Fragment>
            <div className="col-xl-4 col-lg-5" data-test="tabData">
                <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    {feat_temp}
                </div>
            </div>
            <div className="col-xl-8 col-lg-7">
                <div className="tab-content" id="v-pills-tabContent">
                    {feat_temp_sub}
                </div>
            </div>

        </React.Fragment>
    )
}

export default Tabdata;