import React, { useEffect } from "react";
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";
import "./MySelect.css";
const MySelect = ({
  data,
  labelKey,
  valueKey,
  updateDropdown,
  value,
  disabled,
  placeholder,
}) => {
  return (
    <div data-test="select">
      <div className="">
        <div className="">
          <Picky
            options={data}
            labelKey={labelKey}
            valueKey={valueKey}
            multiple={true}
            disabled={disabled}
            placeholder={placeholder}
            // includeFilter
            includeSelectAll
            value={value}
            onChange={updateDropdown}
            renderSelectAll={({
              // filtered,
              tabIndex,
              allSelected,
              toggleSelectAll,
              multiple,
            }) => {
              // Don't show if single select or items have been filtered.
              if (multiple) {
                return (
                  <div
                    tabIndex={tabIndex}
                    role="option"
                    className={allSelected ? "option" : "option"}
                    onClick={toggleSelectAll}
                    onKeyPress={toggleSelectAll}
                  >
                    <span className="ml-0">
                      <input
                        type="checkbox"
                        checked={value && data ? data.length === value.length:""}
                        // className={` ${value == "" || data == "" ? "disbale-ctrl" : ""}`}
                      />
                      All
                    </span>
                  </div>
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MySelect;
