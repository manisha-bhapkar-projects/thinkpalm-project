import React from 'react';

const EditFeatures = (props) => {
    let selected_features = [];
    let selected_sub_list = [];
    let selected_sub_obj = [];
    console.log(props);
    console.log(props.selected_feature_data);
    if (props.selected_feature_data != null && props.selected_feature_data != undefined) {
        props.selected_feature_data.forEach(e => {
            selected_features.push(e.id);
            if (e.attributes.length > 0) {
                e.attributes.forEach((d) => {
                    selected_sub_list.push(d.id);
                    let obj = {
                        id: d.id,
                        value: d.value
                    }
                    selected_sub_obj.push(obj);
                    console.log(selected_sub_obj);
                })
            }
        });
        console.log(selected_features);
    }

    const isFeatureChecked = (e) => {
        return <label className="tab-checkbox">{e.name}
            <input type="checkbox" checked="checked" onChange={(e) => props.data_event(e)} value={e.id} />
            <span className="checkmark" />
        </label>;
    }

    let features_html = "";
    if (props.feat_data != null || props.feat_data != undefined) {
        features_html = props.feat_data.map((e, i) => {
            let isChecked = false;
            let defaultValue_text = "";
            if (selected_features.includes(e.id)) {
                isChecked = true;
            }
            let sub_temp = "";
            if (e.attributes.length > 0) {
                sub_temp = e.attributes.map((d, i) => {
                    let isRadioChecked = false;
                    if (selected_features.includes(e.id)) {
                        isRadioChecked = true;
                    }
                    selected_sub_obj.map((oe) => {
                        if (d.id == oe.id) {
                            defaultValue_text = oe.value;
                        }
                    })
                    return (<div className="sub-checkbox-container">
                        <label htmlFor={`${d.id}radio`} className="tab-checkbox">

                            <input type="checkbox" value={d.id} id={`${d.id}radio`} data-value={e.id} key={`${d.id}radio_key`} defaultChecked={isRadioChecked} onClick={(e) => props.sub_event(e)} name={`radio-group${e.id}`} />
                            {/* <label htmlFor={d.id} /> */}
                            <span className="checkmark" />

                            {/* </span> */}
                        </label>
                        {/* <span>
                            <input type="radio" value={d.id} id={`${d.id}radio`} data-value={e.id} key={`${d.id}radio_key`} defaultChecked={isRadioChecked} onClick={(e) => props.sub_event(e)} name={`radio-group${e.id}`} />
                            <label htmlFor={`${d.id}radio`} />
                        </span> */}
                        <span>
                            <input type="number" data-value={d.id} defaultValue={defaultValue_text} onChange={(e) => props.onInputChange(e)} className="form-control" />
                        </span>
                        <span>
                            {d.name}
                        </span>
                    </div>)
                });
                return (
                    <div className="checkbox-wrapper" key={`${e.id}feat_list`}>
                        {isChecked ? isFeatureChecked(e) : <label className="tab-checkbox">{e.name}
                            <input type="checkbox" onChange={(e) => props.data_event(e)} value={e.id} />
                            <span className="checkmark" />
                        </label>}
                        {sub_temp}
                    </div>
                )
            } else {
                return (
                    <div className="checkbox-wrapper" key={`${e.id}feat_list`}>
                        <label className="tab-checkbox">{e.name}
                            <input type="checkbox" defaultChecked={isChecked} onChange={(e) => props.data_event(e)} value={e.id} />
                            <span className="checkmark" />
                        </label>
                        {sub_temp}
                    </div>
                )
            }

        });
    }
    return (
        <React.Fragment>
            {features_html}

        </React.Fragment>
    )
}

export default EditFeatures;
