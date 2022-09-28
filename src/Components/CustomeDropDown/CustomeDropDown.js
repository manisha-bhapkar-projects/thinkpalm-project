import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import  "./DropdownComponent.css";
function CustomeDropDown({
  data,
  value,
  drop,
  className,
  filterDropdown,
  noOptionsMessage,
  isDisabled,
  placeholder,
  inputClassName,
  noDisable,
  ...rest
}) {
  return (
    <div className="btn-subscription-con" data-test='dropDown'>
      <Dropdown
        drop={drop}
        className={`${inputClassName}`}
        focusFirstItemOnShow
        {...rest}
        alignRight
      >
        <Dropdown.Toggle
          disabled={isDisabled}
          id="dropdown-custom-components" 
          className={` ${className} `}
          variant="link"
           disabled={noDisable?false:true}
          data-test='toggle'
        >
          {value === ""
            ? placeholder
            : value}
        </Dropdown.Toggle>

        <Dropdown.Menu
          flip={false}
          className={` ${filterDropdown ? "filter" : ""}`}
        >
          {data?.length === 0 ? (
            <Dropdown.Item disabled className="no-option-message" data-test='dropT'>
              {noOptionsMessage}
            </Dropdown.Item>
          ) : (
            data?.map((x,index) => {
              return (
                <Dropdown.Item
                  key={index}
                  eventKey={x.id}
                  className={` ${
                    filterDropdown ? "filter" : ""
                  }`}
                  active={x.value == value}
                  // value={x.value}
                  // defaultValue={x.value}
                  data-test='dropF'
                >
                  {x.value}
                </Dropdown.Item>



              );
            })
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

CustomeDropDown.defaultProps = {
  value: "",
  drop: "down",
  filterDropdown: false,
  className: "",
  inputClassName: "",
  noOptionsMessage: "",
  isDisabled: false,
  placeholder: "Select",
};
CustomeDropDown.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  value: PropTypes.string,
  drop: PropTypes.oneOf(["up", "left", "right", "down"]),
  filterDropdown: PropTypes.bool,
  className: PropTypes.string,
  noOptionsMessage: PropTypes.string,
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default CustomeDropDown;
