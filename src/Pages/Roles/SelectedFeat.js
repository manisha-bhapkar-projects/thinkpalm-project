import React, { useState } from 'react';

const SelectedFeat = (props) => {
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

            return <a key={i} className={`nav-link  ${active} pointer link`} id="v-pills-home-tab" data-toggle="pill" role="tab" aria-controls="v-pills-home" aria-selected="true" onClick={() => { onTitleClick(i) }} data-test="title">{feat_temp_name}</a>

        })
        if (props.data_selected != null) {
            feat_temp_sub = featur_data.map((e, i) => {
                active = i === activeIndex ? "active" : "";
                let sub_feat_temp = e.features.map((e, i) => {
                    if (props.data_selected.indexOf(e.id) > -1) {
                        return (
                            <div className="checkbox-wrapper" key={i}>
                                <label className="tab-checkbox">{e.featureName}
                                    <input type="checkbox" defaultChecked="true" value={e.id} onClick={e => { props.box_click_fun(e) }} data-test="name"/>
                                    <span className="checkmark" />
                                </label>
                            </div>
                        )
                    } else {
                        return (
                            <div className="checkbox-wrapper" key={i}>
                                <label className="tab-checkbox">{e.featureName}
                                    <input type="checkbox" value={e.id} onClick={e => { props.box_click_fun(e) }} data-test="listed" />
                                    <span className="checkmark" />
                                </label>
                            </div>
                        )
                    }
                })
                return (
                    <div key ={i} className={`custom_tab_fet tab-pane fade show ${active}`} id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        {sub_feat_temp}
                    </div>
                )

            })
        }
    }


    return (
        <React.Fragment>
            <div className="col-lg-3 col-md-4 d-none d-md-block" data-test="selecetd">
                <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    {feat_temp}
                </div>
            </div>
            <div className="col-lg-9 col-md-8">
                <div className="tab-content" id="v-pills-tabContent">
                    {feat_temp_sub}
                </div>
            </div>

        </React.Fragment>
    )
}

export default SelectedFeat;