import React from 'react';
import { limitNumber } from '../../utils/utils';

const ListFeatures = (props) => {
    console.log("list>>", props);

    // let features_html = "";
    const getCheckBoxComponent = () => {
        if (props.feat_data != null || props.feat_data != undefined) {
            return props.feat_data.map((e, i) => {
                let sub_temp = "";
                if (e.attributes.length > 0 && e.controlType !== "optionbutton") {
                    sub_temp = e.attributes.map((d, i) => {
                        return (<div className="sub-checkbox-container">
                            {/* <span> */}
                            <label htmlFor={d.id} className="tab-checkbox">

                                <input type="checkbox"
                                    value={d.id}
                                    id={d.id}
                                    data-value={e.id}
                                    onChange={(e) => props.sub_event(e)}
                                    name={`radio-group${e.id}`}
                                />
                                {/* <label htmlFor={d.id} /> */}
                                <span className="checkmark" />

                                {/* </span> */}
                            </label>
                            <span>
                                <input type="number"
                                    data-value={d.id}
                                    onChange={(e) => props.onInputChange(e)}
                                    className="form-control"
                                />
                            </span>
                            <span>
                                {d.name}
                            </span>
                        </div>)
                    });
                    return (
                        <div className="checkbox-wrapper">
                            <label className="tab-checkbox">{e.name}
                                <input type="checkbox" onChange={(e) => props.data_event(e)} value={e.id} />
                                <span className="checkmark" />
                            </label>
                            {sub_temp}
                        </div>
                    )
                } else if (e.controlType !== "optionbutton") {
                    return (
                        <div className="checkbox-wrapper">
                            <label className="tab-checkbox">{e.name}
                                <input type="checkbox" onChange={(e) => props.data_event(e)} value={e.id} />
                                <span className="checkmark" />
                            </label>
                            {sub_temp}
                        </div>
                    )
                }

            });
        }
    }

    const getRadioComponent = () => {
        if (props.feat_data != null || props.feat_data != undefined) {
            return props.feat_data.map((item, i) => {
                if (item.controlType === "optionbutton") {
                    return (
                        <div class="pb-3">
                            <input
                                class="form-check-input"
                                type="radio"
                                name="radio-btn"
                                id={i}
                                value={item.id}
                                onChange={(e) => props.data_event(e, "radio", props.radioButtonData)}
                                defaultChecked={item.id === 26 && true}
                            />
                            <label class="tab-checkbox" for={i}> {item.name}</label>
                            {
                                item.attributes.length > 0 && (
                                    <div className="mx-5">
                                        Specify number of countries
                                        <input id="input__username"
                                            type="number"
                                            min="0"
                                            data-value={i}
                                            value={props.countryCount}
                                            onChange={(e) => props.setCountryCount(e, item.attributes[0].id)}
                                            onKeyPress={(e) => { limitNumber(e, 4) && e.preventDefault() }}
                                            className="floating__input mx-4 my-2 country-count-box hide-arrows"
                                        />
                                    </div>
                                )
                            }
                        </div>

                    )


                }
            })
        }
    }

    return (
        <React.Fragment>
            <div className="radio-wrapper ">
                {getRadioComponent()}
            </div>

            {getCheckBoxComponent()}

        </React.Fragment>
    )
}

export default ListFeatures;
