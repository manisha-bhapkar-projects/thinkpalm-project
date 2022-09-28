import React from 'react';
import PropTypes from 'prop-types';
import './TextFieldComponent.css';
import {
  textCharacterValidation,
  textAndNumberValidation,
  AllowTextAndNumberOnlyValidation
} from '../../utils/utils';

const TextFieldComponent = ({
  id,
  label,
  className,
  labelClassName,
  inputClassName,
  error,
  type,
  isDisabled,
  keyPress,
  helperText,
  helperTextClassName,
  isDisable,
  dataContent,
  title,
  testid,
  onClick,
  placeholder,
  icon,
  ...rest
}) => {
  return (
    <div className={` ${className} ${isDisabled && 'disabled'}`}>
      <input
        style={{ cursor: isDisable || isDisabled ? 'not-allowed' : 'text' }}
        id={id}
        onKeyPress={(e) => {
          if (keyPress === 'user') textCharacterValidation(e);
          else if (keyPress === 'account') textAndNumberValidation(e);
          else if (keyPress === "zipCode") AllowTextAndNumberOnlyValidation(e);
        }}
        type={type}
        data-testid={testid || 'test-input'}
        className={
          !error
            ? `floating__input   ${inputClassName} ${isDisabled && 'disabled'}`
            : `floating__input error ${inputClassName} ${isDisabled && 'disabled'
            }`
        }
        disabled={isDisable}
        autoComplete="off"
        data-test="input-field"
        {...rest}
        placeholder={placeholder}
      />
      {label ? (
        <label
          htmlFor={id}
          className={
            !error
              ? `floating__label ${labelClassName}`
              : `floating__label error ${labelClassName}`
          }
          data-content={dataContent}
          data-test="input-label"
        >
          {/* {label} */}
          <span className="hidden--visually">{label}</span>
        </label>
      ) : (
        ''
      )}
      {/* <i className="ph-eye" /> */}
      {error ? (
        <small className={`${helperTextClassName} errormsg`} data-test="small">
          {helperText}
        </small>
      ) : (
        ''
      )}
      {icon == true ? (
        <div onClick={onClick} data-test="iconDiv">
          <i className="fa fa-eye " />
        </div>
      ) : (
        ''
      )}
      {error ? <div className="errormsg">{helperText}</div> : ''}
    </div>
  );
};

TextFieldComponent.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  helperTextClassName: PropTypes.string,
  isDisable: PropTypes.bool,
};

TextFieldComponent.defaultProps = {
  className: '',
  label: '',
  labelClassName: '',
  inputClassName: '',
  error: false,
  helperText: '',
  helperTextClassName: '',
  isDisable: false,
};

export default TextFieldComponent;
