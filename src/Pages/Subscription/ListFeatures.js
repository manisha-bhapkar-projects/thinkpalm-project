import React from 'react';
import { limitNumber } from '../../utils/utils';

const ListFeatures = (props) => {
    const {
        feat_data,
        changeMainCheckBox,
        changeSubCheckBox,
        changeInput,
        changeRadioButton,
        countryCount,
        editFlag
    } = props;

    // console.log("featData>>", feat_data);

    // let features_html = "";
    const getCheckBoxComponent = () => {
        return feat_data?.map((item, id) => {
            if (item.controlType !== "optionbutton") {
                return (
                    <div className="checkbox-wrapper">

                        <label className={`tab-checkbox ${item.isSelected ? "selected" : "not-selected"}`}>
                            {item.name}
                            <input type="checkbox"
                                onChange={(e) => changeMainCheckBox(e)}
                                value={item.id}
                                checked={item.isSelected}
                            />
                            <span className="checkmark" />
                        </label>
                        {
                            item.attributes.length > 0 && item.attributes.map((ix, idx) => {
                                return (
                                    <div className="sub-checkbox-container">
                                        <label htmlFor={ix.id} className="tab-checkbox">
                                            <input type="checkbox"
                                                value={ix.id}
                                                id={ix.id}
                                                data-value={item.id}
                                                onChange={(e) => changeSubCheckBox(e)}
                                                name={`radio-group${item.id}`}
                                                checked={ix.isSelected}

                                            />
                                            <span className="checkmark" />
                                        </label>
                                        <span>
                                            <input type="number"
                                                id={ix.id}
                                                min="0"
                                                onKeyPress={(e) => (e.charCode == 45 || e.charCode == 43) && e.preventDefault()}
                                                onPaste={(e) => e.preventDefault()}
                                                data-value={item.id}
                                                value={ix.value}
                                                onChange={(e) => changeInput(e)}
                                                className="form-control"
                                            />
                                        </span>
                                        <span>
                                            {ix.name}
                                        </span>
                                    </div>
                                )
                            })

                        }
                    </div>

                )

            }
        })
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
                                id={item.id}
                                value={item.id}
                                onChange={(e) => changeRadioButton(e, i)}
                                checked={item.isSelected}
                                defaultChecked={!editFlag && (i === 0 && true)}
                            />
                            <label class={`tab-checkbox ${item.isSelected ? "selected" : "not-selected"}`} for={item.id}> {item.name}</label>
                            {
                                item.attributes.length > 0 && item.attributes.map((ix, idx) => {
                                    return (
                                        <div className={`mx-5 country-box ${item.isSelected ? "selected" : "not-selected"}`}>
                                            Specify number of countries
                                            <input id="input__username"
                                                type="number"
                                                min="0"
                                                disabled={!item.isSelected}
                                                data-value={item.id}
                                                id={ix.id}
                                                value={ix.value}
                                                onChange={(e) => changeInput(e, item.controlType)}
                                                onKeyPress={(e) => { limitNumber(e, 2) && e.preventDefault() }}
                                                className="floating__input mx-4 my-2 country-count-box hide-arrows"
                                            />
                                        </div>

                                    )
                                })
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
