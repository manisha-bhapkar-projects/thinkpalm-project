import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from 'react-router';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

/* Component */
import Checkbox from '../../../Components/Inputs/Checkbox';
import ImageRender from '../imageRender';

/* Action */
import {
  callUpdateEmployeeCountListAPI,
  getSingleCountryData,
} from '../../../Store/reducers/favoriteCountries';

const initialEmpType = {
  'Permanent(Full-time)Local': {
    Salaried: 0,
    Hourly: 0,
  },
  'Permanent(Full-time)Expat': {
    Salaried: 0,
    Hourly: 0,
  },
  'Permanent(Part-time)Local': {
    Salaried: 0,
    Hourly: 0,
  },
  'Permanent(Part-time)Expat': {
    Salaried: 0,
    Hourly: 0,
  },
  'Temporary/Interns': {
    Salaried: 0,
    Hourly: 0,
  },
  Consultants: {
    Salaried: 0,
    Hourly: 0,
  },
  Contractors: {
    Salaried: 0,
    Hourly: 0,
  },
};

function FavouriteCountryEditModal({
  isOpen,
  onCancelClickListner,
  dialogClassName,
  rowData,
  notify,
}) {
  const country_Id = rowData?.countryId;
  const [employeeTypes, setEmployeeTypes] = useState(initialEmpType);
  const [selectedEmpType, setSelectedEmpType] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const history = useHistory();

  const dispatch = useDispatch();

  const employeeType = useSelector(
    (state) => state?.favoriteCountriesReducer?.employeeType
  );
  const countryUpdated = useSelector(
    (state) => state?.favoriteCountriesReducer?.countryUpdated
  );
  const countryUpdatedError = useSelector(
    (state) => state?.favoriteCountriesReducer?.countryUpdatedError
  );
  const countryUpdatedPending = useSelector(
    (state) => state?.favoriteCountriesReducer?.countryUpdatedPending
  );
  const singleCountryData = useSelector(
    (state) =>
      state?.favoriteCountriesReducer?.singleCountryData
        ?.employeeCountryCount?.[0]?.employeeTypes
  );
  const CountryDataPending = useSelector(
    (state) => state?.favoriteCountriesReducer?.CountryDataPending
  );

  const id = useSelector(
    (state) =>
      state?.favoriteCountriesReducer?.singleCountryData
        ?.employeeCountryCount?.[0].id
  );

  const totalEmpCount = useSelector(
    (state) =>
      state?.favoriteCountriesReducer?.singleCountryData
        ?.employeeCountryCount?.[0]?.employeeCount
  );

  const userId = useSelector((state) => state?.user?.userProfile?.userId);

  useEffect(async () => {
    dispatch(getSingleCountryData({ userId, country_Id }));
  }, [userId, country_Id]);

  useEffect(async () => {
    let tempEmpType = { ...initialEmpType },
      tempSelectedEmpType = [];

    if (singleCountryData?.length > 0) {
      singleCountryData?.forEach((type) => {
        const type_name = employeeType?.find(
          (emptype) => emptype.id === type.employeeTypeId
        );
        if (type_name) {
          tempEmpType = {
            ...tempEmpType,
            [type_name.name]: {
              Salaried: type.salariedCount,
              Hourly: type.hourlyCount,
            },
          };

          if (type.salariedCount > 0 || type.hourlyCount > 0) {
            tempSelectedEmpType.push(type.employeeTypeId);
          }
        }
      });
    }

    employeeType?.forEach((type) => {
      tempEmpType = {
        ...tempEmpType,
        [type.name]: { ...tempEmpType[type.name], employeeTypeId: type.id },
      };
    });

    setSelectedEmpType(tempSelectedEmpType);
    setEmployeeTypes(tempEmpType);
  }, [singleCountryData, employeeType]);

  const handleEmployeeTypeCount = (typeName, type, countNumber, id) => {
    const tempSelectedEmpType = [...selectedEmpType];

    if (employeeTypes[typeName][type] + countNumber >= 0) {
      setEmployeeTypes((prevState) => ({
        ...prevState,
        [typeName]: {
          ...prevState[typeName],
          [type]: prevState[typeName][type] + countNumber,
        },
      }));

      if (employeeTypes[typeName][type] + countNumber > 0) {
        if (!tempSelectedEmpType.includes(id)) {
          tempSelectedEmpType.push(id);
        }
      } else {
        if (tempSelectedEmpType.includes(id)) {
          const index = tempSelectedEmpType.indexOf(id);
          tempSelectedEmpType.splice(index, 1);
        }
      }
    }

    setSelectedEmpType(tempSelectedEmpType);
  };
  useEffect(() => {
    if (countryUpdated === 200) {
      notify('Country Updated Successfully');
      onCancelClickListner();
      setEmployeeTypes(initialEmpType);
      dispatch(callUpdateEmployeeCountListAPI({ success: true }));
    } else if (countryUpdatedError && countryUpdatedError.length) {
      notify(countryUpdatedError);
    }
  }, [countryUpdatedError, countryUpdated]);

  useEffect(() => {
    setTotalCount(totalEmpCount);
    let total_count = 0;
    Object.keys(employeeTypes).map(function (key, val) {
      total_count += employeeTypes[key].Salaried + employeeTypes[key].Hourly;
      setTotalCount(total_count);
    });
  }, [employeeTypes]);

  const handleChangeValue = (typeName, type, countNumber, id) => {
    let count = 0;
    const tempSelectedEmpType = [...selectedEmpType];

    if (countNumber === '') {
      count = 0;
    } else {
      count = parseInt(countNumber.match(/[0-9]/gm).join(''));
    }
    if (count > 0) {
      if (!tempSelectedEmpType.includes(id)) {
        tempSelectedEmpType.push(id);
      }
    } else {
      if (tempSelectedEmpType.includes(id)) {
        const index = tempSelectedEmpType.indexOf(id);
        tempSelectedEmpType.splice(index, 1);
      }
    }

    setEmployeeTypes({
      ...employeeTypes,
      [typeName]: {
        ...employeeTypes[typeName],
        [type]: count,
      },
    });
    setSelectedEmpType(tempSelectedEmpType);
  };

  const handleSubmit = (e, item, index) => {
    if (selectedEmpType.length === 0) {
      notify('Please select employee count');
      return;
    }

    const data = Object.keys(employeeTypes).reduce((acc, curr) => {
      if (selectedEmpType.includes(employeeTypes[curr].employeeTypeId)) {
        acc.push({
          EmployeeTypeId: employeeTypes[curr].employeeTypeId,
          SalariedCount: employeeTypes[curr].Salaried,
          HourlyCount: employeeTypes[curr].Hourly,
          UserId: userId,
          CountryId: country_Id,
        });
      }

      return acc;
    }, []);

    let temp = {
      userid: userId,
      employeeCountryCount: [
        {
          id: id,
          countryID: country_Id,
          employeeCount: 0,
          EmployeeTypes: data,
        },
      ],
    };
    dispatch(callUpdateEmployeeCountListAPI({ data: temp }));
  };

  const handleSelectEmpType = (e, id) => {
    let tempSelectedEmpType = [...selectedEmpType];

    if (e.target.checked) {
      tempSelectedEmpType = [...tempSelectedEmpType, id];
    } else {
      const index = tempSelectedEmpType.indexOf(id);
      tempSelectedEmpType.splice(index, 1);
    }

    setSelectedEmpType(tempSelectedEmpType);
  };
  return (
    <Modal
      show={isOpen}
      onHide={() => {
        onCancelClickListner();
        setEmployeeTypes(initialEmpType);
      }}
      backdrop="static"
      keyboard={false}
      centered={true}
      contentClassName="right-top-modal"
      dialogClassName={dialogClassName}
      data-test="Expert-Modal"
    >
      <Modal.Title>Employee Information</Modal.Title>
      <span className="sub-details">
        A break down of employee type helps us provide you with relevant legal
        and compliance updates.
      </span>
      <Modal.Body className="doc-modal-body ask-body-container modal-input-wrapper">
        <div className="">
          <div className="selected-coutry">
            <div className="flag">
              <ImageRender url={rowData?.flag_Upload_Id} />
            </div>
            <span>{rowData?.countryName}</span>
            <span className="spinner-btn">
              {CountryDataPending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                ''
              )}
            </span>
          </div>
          <div data-test="emp" className="rt-modal-container">
            <div className="col-12 table-header">
              <div className="row">
                <div className="col-md-6 pl-0">
                  <h3>Employee Type</h3>
                </div>
                <div className="col-md-3 text-center">
                  <h3>Salaried</h3>
                </div>
                <div className="col-md-3 text-center">
                  <h3>Hourly</h3>
                </div>
              </div>
            </div>
            {Object.keys(employeeTypes).map((typeName,index) => {
              
              return (
                <div className="inline-form-container" key={index} >
                  <div className="col-md-6 pl-0">
                    <Checkbox
                      className="checkbox"
                      checked={selectedEmpType.includes(
                        employeeTypes[typeName]?.employeeTypeId
                      )}
                      onChange={(e) =>
                        handleSelectEmpType(
                          e,
                          employeeTypes[typeName]?.employeeTypeId
                        )
                      }
                      data-test="check"
                    />

                    <div className="label-checkbox">{typeName}</div>
                  </div>
                  <div className="col-md-3">
                    {![
                      'Consultants',
                      'Temporary/Interns',
                      'Contractors',
                    ].includes(typeName) && (
                      <div className="number-container">
                        <button
                          name="salariedLocal"
                          className="minus"
                          onClick={() =>
                            handleEmployeeTypeCount(
                              typeName,
                              'Salaried',
                              -1,
                              employeeTypes[typeName]?.employeeTypeId
                            )
                          }
                          data-test="salariedLocalMinus"
                        ></button>
                        <button
                          name="salariedLocal"
                          className="plus"
                          onClick={() =>
                            handleEmployeeTypeCount(
                              typeName,
                              'Salaried',
                              1,
                              employeeTypes[typeName]?.employeeTypeId
                            )
                          }
                          data-test="salariedLocalAdd"
                        ></button>
                        <input
                          type="text"
                          className="form-control"
                          name="permanent-full-time-local"
                          value={employeeTypes[typeName].Salaried}
                          onChange={(e) =>
                            handleChangeValue(
                              typeName,
                              'Salaried',
                              e.target.value,
                              employeeTypes[typeName]?.employeeTypeId
                            )
                          }
                          data-test="change"
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="hourlyLocal"
                        className="minus"
                        onClick={() =>
                          handleEmployeeTypeCount(
                            typeName,
                            'Hourly',
                            -1,
                            employeeTypes[typeName]?.employeeTypeId
                          )
                        }
                        data-test="hourlyLocalMinus"
                      ></button>
                      <button
                        name="hourlyLocal"
                        className="plus"
                        onClick={() =>
                          handleEmployeeTypeCount(
                            typeName,
                            'Hourly',
                            1,
                            employeeTypes[typeName]?.employeeTypeId
                          )
                        }
                        data-test="hourlyLocalAdd"
                      ></button>
                      <input
                        type="text"
                        className="form-control"
                        name="permanent-full-time-local"
                        value={employeeTypes[typeName].Hourly}
                        onChange={(e) =>
                          handleChangeValue(
                            typeName,
                            'Hourly',
                            e.target.value,
                            employeeTypes[typeName]?.employeeTypeId
                          )
                        }
                        data-test="change2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="count-footer">
              <span>Total employee count</span>
              <span>{totalCount}</span>
            </div>
          </div>
        </div>
        <div className="btn-container">
          <button
            type="button"
            className="secondary-gray-button"
            onClick={() => {
              onCancelClickListner();
              setEmployeeTypes(initialEmpType);
            }}
            data-test="cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary-button footer-button"
            onClick={handleSubmit}
            data-test="submit"
          >
            {countryUpdatedPending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Save'
            )}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default FavouriteCountryEditModal;
