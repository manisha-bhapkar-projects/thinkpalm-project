import React from "react";

const CustomeSelectDropdown = ({
  id,
  name,
  placeholder,
  htmlFor,
  data_content,
  title,
  noFloating,
  value,
  data,
  onChange,
  Prefilled,
  ...rest

}) => {
  return (
    <div className={noFloating ? "select-dropdown" : "floating select-dropdown"} data-test='select-dropdown'>
      <select
        id={id}
        className="floating__input"
        name={name}
        type="text"
        value={Prefilled || value}
        onChange={onChange}
      >
        {/* If you want to set selected item parse the value to Prefilled  */}
        {/* <option value="" selected disabled>{placeholder ? placeholder : Prefilled}</option> */}
        <option value="" selected disabled> </option>
        {data
          ? data.map((x, index) => {
            return <option key={index} data-test='option'>{x.value}</option>;
          })
          : ""}
      </select>
      <label
        htmlFor={htmlFor}
        className="floating__label"
        data-content={data_content}

      >
        <span className="hidden--visually">{title}</span>
      </label>
    </div>
  );
};

export default CustomeSelectDropdown;
