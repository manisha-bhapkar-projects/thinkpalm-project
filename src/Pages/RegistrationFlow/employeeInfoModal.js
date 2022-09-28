import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import { useDispatch, useSelector } from "react-redux";

import close from "../../assets/images/search-close.svg";
import Checkbox from "../../Components/Inputs/Checkbox";
import constants from "../../utils/constants";

// import Flag from "../../../assets/images/Flag-India"
import Flag from "../../assets/images/Flag-India.jpg"
import watermarkImg from "../../assets/images/placeholder-img.svg";

import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ImageRender from "../Settings/imageRender";

function EmployeeInfoModal({
    isOpen,
    onCancelClickListener,
    dialogClassName,
    notify,
    employeesInfoList,
    setEmployeeInfoDetails,
    expertDetails,
    onSaveUserInfo,
    selectedItem,
}) {
    const [employeeInfo, setEmployeeInfo] = useState({})
    const [totalEmployeeCount, setTotalEmployeeCount] = useState(0)
    const [employeeType, setEmployeeType] = useState([])
    const [countryInfo, setCountryInfo] = useState({})

    const dispatch = useDispatch();
    useEffect(() => {
        setEmployeeInfo(JSON.parse(JSON.stringify(employeesInfoList)))
    }, [employeesInfoList])

    const handleChangeValue = (type, i, e) => {
        const empInfo = { ...employeeInfo };
        if (isNaN(Number(e.target.value))) return;

        if (type === 'salaried') {
            empInfo.employeeTypes[i].salariedCount = Number(e.target.value);
        } else if (type === 'hourly') {
            empInfo.employeeTypes[i].hourlyCount = Number(e.target.value);
        } else if (type === "checkbox") {
            empInfo.employeeTypes[i].isCheck = e;
        }

        if (empInfo.employeeTypes[i].salariedCount > 0 || empInfo.employeeTypes[i].hourlyCount > 0) {
            empInfo.employeeTypes[i].isCheck = true;
        } else {
            empInfo.employeeTypes[i].isCheck = false;
        }
        updateCountInfo(empInfo)
    };

    const updateCountInfo = () => {
        const empInfo = { ...employeeInfo };
        empInfo.employeeCount = 0;
        for (let _index = 0; _index < empInfo.employeeTypes.length; _index++) {
            const employeeItem = empInfo.employeeTypes[_index];
            if (employeeItem.salariedCount) {
                empInfo.employeeCount = Number(empInfo.employeeCount) + Number(employeeItem.salariedCount);
            }

            if (employeeItem.hourlyCount) {
                empInfo.employeeCount = Number(empInfo.employeeCount) + Number(employeeItem.hourlyCount);
            }
        }

        setEmployeeInfoDetails(empInfo);
    }

    const addEmployee = (type, i) => {
        const empInfo = { ...employeeInfo };
        if (type === 'salaried') {
            empInfo.employeeTypes[i].salariedCount = empInfo.employeeTypes[i].salariedCount + 1;
        } else if (type === 'hourly') {
            empInfo.employeeTypes[i].hourlyCount = empInfo.employeeTypes[i].hourlyCount + 1;
        }

        if (empInfo.employeeTypes[i].salariedCount > 0 || empInfo.employeeTypes[i].hourlyCount > 0) {
            empInfo.employeeTypes[i].isCheck = true;
        } else {
            empInfo.employeeTypes[i].isCheck = false;
        }

        updateCountInfo(empInfo)
    }

    const minusEmployee = (type, i) => {
        const empInfo = { ...employeeInfo };
        if (type === 'salaried') {
            empInfo.employeeTypes[i].salariedCount = (empInfo.employeeTypes[i].salariedCount - 1 > -1) ? empInfo.employeeTypes[i].salariedCount - 1 : 0;
        } else if (type === 'hourly') {
            empInfo.employeeTypes[i].hourlyCount = (empInfo.employeeTypes[i].hourlyCount - 1 > -1) ? empInfo.employeeTypes[i].hourlyCount - 1 : 0;
        }

        if (empInfo.employeeTypes[i].salariedCount > 0 || empInfo.employeeTypes[i].hourlyCount > 0) {
            empInfo.employeeTypes[i].isCheck = true;
        } else {
            empInfo.employeeTypes[i].isCheck = false;
        }

        updateCountInfo(empInfo)
    }
    return (
        <Modal
            show={isOpen}
            onHide={onCancelClickListener}
            backdrop="static"
            keyboard={false}
            centered={true}
            contentClassName="custome-modal"
            dialogClassName={dialogClassName}
            data-test="employeeInfoMoal"
        >
            <Modal.Header className="role_header_model" closeButton>
                <Modal.Title>Employee Information</Modal.Title>
            </Modal.Header>
            {/* </Modal.Header> */}
            <span className="title-desc">A break down of employee type helps us provide you with relevant legal and compliance updates.</span>
            <Modal.Body className="doc-modal-body ask-body-container">

                <div className="expert-form"  >
                    <div className="d-flex align-items-center flag-container">
                        <div
                            className={`flag ${(employeeInfo.flag_Upload_Id === "" || employeeInfo.flag_Upload_Id === null) && "no-flag"}`}
                        >
                            <img
                                src={employeeInfo.flag_Upload_Id != "" && employeeInfo.flag_Upload_Id != null ?
                                    constants.API.COUNTRY.GET_FLAG_DOWNLOAD + employeeInfo.flag_Upload_Id : watermarkImg}
                            />
                        </div>
                        <span>{employeeInfo.country_Name}</span>
                    </div>
                    <div data-test="emp">
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
                        {employeeInfo?.employeeTypes && employeeInfo.employeeTypes.map((type, _index) => {
                            
                            return (
                                <div className="inline-form-container" key={_index} >
                                    <div className="check-box-container col-md-6 pl-0">
                                        <Checkbox
                                            checkboxClass="checkbox emp-modal-checkbox"
                                            checked={type.isCheck || (type.salariedCount > 0 || type.hourlyCount)}
                                            onChange={({ target }) => handleChangeValue('checkbox', _index, target.checked)}
                                            data-test="countryCheck"
                                        />
                                        <div className="col-md-12 pl-4 list-item-title">
                                            {type.name}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        {
                                            ['Temporary/Interns', 'Consultants', 'Contractors'].includes(type.name) === false && (
                                                <div className="number-container">
                                                    <button name="salariedLocal" className="minus" onClick={() => minusEmployee('salaried', _index)} data-test="salariedLocalMinus" ></button>
                                                    <button name="salariedLocal" className="plus" onClick={() => addEmployee('salaried', _index)} data-test="salariedLocalAdd"></button>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="permanent-full-time-local"
                                                        id="Salaried"
                                                        value={type.salariedCount}
                                                        onChange={(e) => handleChangeValue('salaried', _index, e)}
                                                        data-test="salaried"
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="col-md-3">
                                        <div className="number-container">
                                            <button name="hourlyLocal" className="minus" onClick={() => minusEmployee('hourly', _index)} data-test="hourlyLocalMinus" ></button>
                                            <button name="hourlyLocal" className="plus" onClick={() => addEmployee('hourly', _index)} data-test="hourlyLocalAdd"></button>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="permanent-full-time-local"
                                                id='Hourly'
                                                value={type.hourlyCount}
                                                onChange={(e) => handleChangeValue('hourly', _index, e)}
                                                data-test="hourly"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="count-footer">
                            <span>Total employee count</span>
                            <span className="totalCount">{employeeInfo.employeeCount}</span>
                        </div>
                    </div>
                </div>
                <div className="employee-modal-footer">
                    <button
                        type="button"
                        className="primary-modal-btn"
                        onClick={onCancelClickListener}
                        data-test="cancel"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={() => onSaveUserInfo(employeeInfo)}
                        disabled={employeeInfo.employeeCount < 1}
                        className="info-modal-btn"
                        data-test="save"
                    >
                        Save
                    </button>
                </div>
            </Modal.Body>

        </Modal>
    )
}
export default EmployeeInfoModal;