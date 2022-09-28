import React, { useState } from "react";

const ListedFeatures = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onTitleClick = (i) => {
    setActiveIndex(i);
  };
  const featur_data = [];
  const featur_data1 = props.feat_data;
  let feat_temp = "";
  let active = "";
  let feat_temp_sub = "";
  if (props.feat_data != null) {
    featur_data1.map((e, i) => {
      let flag = false;
      e.features.map((ef, j) => {
        if (
          props.feat_data_set != null &&
          props.feat_data_set.indexOf(ef.id) > -1
        ) {
          if (!flag) featur_data.push(e);
          flag = true;
        }
      });
    });
    feat_temp = featur_data.map((e, i) => {
      active = i === activeIndex ? "active" : "";
      let feat_temp_name = e.featureGroup.featureGroupName;

      return (
        <a
          className={`nav-link ${active} pointer link`}
          id="v-pills-home-tab"
          data-toggle="pill"
          role="tab"
          aria-controls="v-pills-home"
          aria-selected="true"
          onClick={() => {
            onTitleClick(i);
          }}
         data-test="name"
         key={i}
        >
          {feat_temp_name}
        </a>
      );
    });
    if (props.feat_data_set != null) {
      feat_temp_sub = featur_data.map((e, i) => {
        active = i === activeIndex ? "active" : "";
        let sub_feat_temp = e.features.map((e, i) => {
          if (props.feat_data_set.indexOf(e.id) > -1) {
            return (
              <div className="checkbox-wrapper list_only" key={i}>
                <label className="tab-checkbox">{e.featureName}</label>
              </div>
            );
          }
        });
        return (
          <div
            className={` tab-pane list_only_data fade show ${active}`}
            id="v-pills-home"
            role="tabpanel"
            aria-labelledby="v-pills-home-tab"
            key={i}
          >
            {sub_feat_temp}
          </div>
        );
      });
    }
  }
  return (
    <React.Fragment>
      <div className="col-xl-4 col-lg-5 col-md-12 d-none d-md-block" data-test="listed">
        <div
          className="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          {feat_temp}
        </div>
      </div>
      <div className="col-xl-8 col-lg-7 col-md-12">
        <div className="tab-content" id="v-pills-tabContent">
          {feat_temp_sub}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ListedFeatures;
