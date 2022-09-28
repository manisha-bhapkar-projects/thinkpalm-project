import React, { useState, useEffect } from 'react';
import Select from 'react-select';

// REF: https://react-select.com/home#custom-styles

const ReactDropdown = ({
  id,
  name,
  placeholder,
  htmlFor,
  data_content,
  title,
  noFloating,
  value,
  data,
  testid,
  onChange,
  Prefilled,
  isClearable,
  isDisabled,
  isSearchable,
  showArrow,
  fromCountryConfigView,
  enableSearch,
  inputClassName,
  ...rest
}) => {
  const [state, setState] = useState(Prefilled);

  const onChangeValue = (item) => {
    setState(item);
    onChange(item);
  };

  useEffect(() => {
    if (Prefilled) {
      setState(Prefilled);
    } else if (Prefilled === '' || Prefilled === null) {
      setState({});
    }
  }, [Prefilled]);
  return (
    <div
      className={noFloating ? 'select-dropdown' : 'select-dropdown'}
      data-test="react-dropdown"
    >
      <Select
        className={`${inputClassName} floating-select ${fromCountryConfigView && 'fromCountryConfigView '
          }${fromCountryConfigView && (showArrow ? '' : 'hideArrow')}`}
        classNamePrefix="select"
        data-testid={testid}
        defaultValue={Prefilled}
        value={state}
        placeholder=""
        isDisabled={isDisabled ? true : false}
        isClearable={isClearable ? true : false}
        isSearchable={enableSearch !== undefined ? enableSearch : true}
        onChange={onChangeValue}
        name={name}
        id={id}
        options={data}
        data-test="select"
      />

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

export default ReactDropdown;
