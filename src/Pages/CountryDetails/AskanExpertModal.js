import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {
  callgetCountryListAPI,
  callgetEmployeeType,
  callgetIndustryListAPI,
  getSingleCountryData,
} from '../../Store/reducers/favoriteCountries';
import { useDispatch, useSelector } from 'react-redux';
import { askQuestionPOPUpAPI } from '../../Store/reducers/HRTemplate';
import close from '../../assets/images/search-close.svg';
import { uploadImageFile } from '../../Store/reducers/country';
import ReactDropdown from '../../Components/CustomeSelectDropDown/reactDropdown';
import { Spinner } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import constants from '../../utils/constants';
import {userDetailsMixpnel} from '../../utils/utils';
mixpanel.init(constants.MIXPANEL_TOKEN);
function AskanExpertModal({
  isOpen,
  onCancelClickListner,
  dialogClassName,
  notify,
  expertDetails,
  showHelp,
  setShowHelp,
  countryName,
  countryId,
}) {
  const [radioBtn, setRadioBtn] = useState('');
  const [queryRadioBtn, setQueryRadioBtn] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [successFulSubmit, setsuccessFulSubmit] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(' ');
  const [requiredCheck, setRequiredCheck] = useState();
  const [requiredCheck1, setRequiredCheck1] = useState();
  const [countryValidation, setCountryValidation] = useState('');
  const [industryValidation, setIndustryValidation] = useState('');
  const [agreementValidation, setAgreementValidation] = useState('');
  const [callQueryValidation, setCallQueryValidation] = useState('');
  const [clarifyValidation, setClarifyValidation] = useState('');
  const [employees, setEmployees] = useState();
  const [employeeValidation, setEmployeeValidation] = useState('');
  const [referenceNo, setReferenceNo] = useState();
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [perFulLocal, setperFulLocal] = useState({
    EmployeeType: 'Permanent (Full - Time) Local',
    EmpTypeId: '0397930e-fb1a-48c9-a4b3-cf4cd78a53e9',
    Salaried: 0,
    Hourly: 0,
  });
  const [perFulExpat, setperFulExpat] = useState({
    EmployeeType: 'Permanent (Full - Time) Expat',
    EmpTypeId: '118e2140-643a-4827-abc5-5af911891c93',
    Salaried: 0,
    Hourly: 0,
  });
  const [perPartLocal, setperPartLocal] = useState({
    EmployeeType: 'Permanent (Part - Time) Local',
    EmpTypeId: '1841c098-d8f3-46b3-b779-f2af14bf6312',
    Salaried: 0,
    Hourly: 0,
  });
  const [perPartExpat, setperPartExpat] = useState({
    EmployeeType: 'Permanent (Part - Time) Expat',
    EmpTypeId: 'ea8ec746-4ca7-4143-b37d-4c5795254e9e',
    Salaried: 0,
    Hourly: 0,
  });
  const [consultant, setCounsultant] = useState({
    EmployeeType: 'Consultant',
    EmpTypeId: 'f556d16a-cf04-44ba-bef0-de6d4ce89f23',
    Hourly: 0,
  });
  const [temporary, setTemporary] = useState({
    EmployeeType: 'Temporary/Interns',
    EmpTypeId: 'f2e27fb3-0e23-44a7-91f4-91ee7c58a7b4',
    Hourly: 0,
  });
  const [contractors, setcontractors] = useState({
    EmployeeType: 'Contractor',
    EmpTypeId: 'fea4f240-47c0-43fc-83d7-60ce3e277721',
    Hourly: 0,
  });
  const [initialValues, setInitialValues] = useState({
    ExpertName: '',
    ExpertContentId: '25a69d34-f3aa-11eb-9864-c025a51c2077',
    CountryId: '',
    industryId: '',
    HasAgreement: false,
    AgreementUploadId: '',
    areaToClarify: '',
    NeedKickOffCall: false,
    HasEmployeesInCountry: false,
    countryName: '',
  });
  const dispatch = useDispatch();
  const countries = useSelector(
    (state) => state?.favoriteCountriesReducer?.countryList
  );
  const industries = useSelector(
    (state) => state?.favoriteCountriesReducer?.industryList
  );
  const countryList =
    countries &&
    countries.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.country_Name,
      };
    });
  const industryList =
    industries &&
    industries.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.industryName,
      };
    });
  const userId = useSelector((state) => state?.user?.userProfile?.userId);
  const singleCountryData = useSelector(
    (state) =>
      state?.favoriteCountriesReducer?.singleCountryData
        ?.employeeCountryCount?.[0]?.employeeTypes
  );
  const CountryDataPending = useSelector(
    (state) => state?.favoriteCountriesReducer?.CountryDataPending
  );
  const employeeType = useSelector(
    (state) => state?.favoriteCountriesReducer?.employeeType
  );

  useEffect(() => {
    setInitialValues({
      ...initialValues,
      CountryId: countryId,
      countryName,
    });
  }, [countryId, countryName]);
  useEffect(() => {
    setperFulLocal({ ...perFulLocal, Salaried: 0, Hourly: 0 });
    setperFulExpat({ ...perFulExpat, Salaried: 0, Hourly: 0 });
    setperPartLocal({ ...perPartLocal, Salaried: 0, Hourly: 0 });
    setperPartExpat({ ...perPartExpat, Salaried: 0, Hourly: 0 });
    setTemporary({ ...temporary, Hourly: 0 });
    setCounsultant({ ...consultant, Hourly: 0 });
    setcontractors({ ...contractors, Hourly: 0 });
    singleCountryData?.map((count) => {
      if (count?.employeeTypeId === perFulLocal.EmpTypeId) {
        setperFulLocal({
          ...perFulLocal,
          Salaried: count?.salariedCount,
          Hourly: count?.hourlyCount,
        });
      } else if (count.employeeTypeId === perFulExpat.EmpTypeId) {
        setperFulExpat({
          ...perFulExpat,
          Salaried: count.salariedCount,
          Hourly: count.hourlyCount,
        });
      } else if (count.employeeTypeId === perPartLocal.EmpTypeId) {
        setperPartLocal({
          ...perPartLocal,
          Salaried: count.salariedCount,
          Hourly: count.hourlyCount,
        });
      } else if (count.employeeTypeId === perPartExpat.EmpTypeId) {
        setperPartExpat({
          ...perPartExpat,
          Salaried: count.salariedCount,
          Hourly: count.hourlyCount,
        });
      } else if (count.employeeTypeId === consultant.EmpTypeId) {
        setCounsultant({
          ...consultant,
          Salaried: count.salariedCount,
          Hourly: count.hourlyCount,
        });
      } else if (count.employeeTypeId === temporary.EmpTypeId) {
        setTemporary({
          ...temporary,
          Salaried: count.salariedCount,
          Hourly: count.hourlyCount,
        });
      } else if (count.employeeTypeId === contractors.EmpTypeId) {
        setcontractors({
          ...contractors,
          Salaried: count.salariedCount,
          Hourly: count.hourlyCount,
        });
      }
    });
  }, [singleCountryData]);

  useEffect(async () => {
    if (!countries?.length) {
      dispatch(callgetCountryListAPI());
    }
    if (!industries?.length) {
      dispatch(callgetIndustryListAPI());
    }

    let response = await dispatch(callgetEmployeeType());
    if (response&&countryId) {
      dispatch(getSingleCountryData({ userId, country_Id: countryId }));
    }

  }, []);

  useEffect(() => {
    if (CountryDataPending) {
      setperFulLocal({ ...perFulLocal, Salaried: 0, Hourly: 0 });
      setperFulExpat({ ...perFulExpat, Salaried: 0, Hourly: 0 });
      setperPartLocal({ ...perPartLocal, Salaried: 0, Hourly: 0 });
      setperPartExpat({ ...perPartExpat, Salaried: 0, Hourly: 0 });
      setTemporary({ ...temporary, Hourly: 0 });
      setCounsultant({ ...consultant, Hourly: 0 });
      setcontractors({ ...contractors, Hourly: 0 });
    }
  }, [CountryDataPending])
  const handleChangeCountry = async (value) => {
    setInitialValues({
      ...initialValues,
      CountryId: value.id,
      countryName: value.label,
    });
    await dispatch(getSingleCountryData({ userId, country_Id: value.id }));
  };
  const handleDone = () => {
    onCancelClickListner();
    setsuccessFulSubmit(false);
    setFileUpload(null);
    setRadioBtn('');
    setQueryRadioBtn('');
    setUploadMessage('');
    setRequiredCheck(false);
    setRequiredCheck1(false);
    setperFulLocal({ ...perFulLocal, Salaried: 0, Hourly: 0 });
    setperFulExpat({ ...perFulExpat, Salaried: 0, Hourly: 0 });
    setperPartLocal({ ...perPartLocal, Salaried: 0, Hourly: 0 });
    setperPartExpat({ ...perPartExpat, Salaried: 0, Hourly: 0 });
    setTemporary({ ...temporary, Hourly: 0 });
    setCounsultant({ ...consultant, Hourly: 0 });
    setcontractors({ ...contractors, Hourly: 0 });
    setTotalEmployee(0);
    setSubmitLoading(false);
    setInitialValues({
      ExpertName: 'David',
      ExpertContentId: '25a69d34-f3aa-11eb-9864-c025a51c2077',
      CountryId: '',
      industryId: '',
      HasAgreement: false,
      areaToClarify: '',
      AgreementUploadId: '',
      HasEmployeesInCountry: false,
    });
    setEmployees(false);
  };

  const handleChangeIndustry = (value) => {
    setInitialValues({
      ...initialValues,
      industryId: value,
      industryName: value.label,
    });
  };
  const handleCheckRadio = (e) => {
    setRadioBtn(e.target.value);
  };
  useEffect(() => {
    if (radioBtn === '0') {
      setUploadMessage('');
    }
  }, [radioBtn]);
  const handleCheckQueryRadio = (e) => {
    setQueryRadioBtn(e.target.value);
  };
  const handleSubmit = async () => {
    let id = '';
    if (fileUpload != null && fileUpload.size && fileUpload.size > 0) {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append('file', fileUpload);

      const response = await uploadImageFile(formData, true);
      if (response && response.data) {
        id = response.data.id;
      } else {
        notify(`Failed to upload the document!`);
        return false;
      }
    }
    if (initialValues.CountryId === '' || initialValues.CountryId == null) {
      setCountryValidation('Select any country');
    } else {
      setCountryValidation('');
    }
    if (!initialValues.industryId) {
      setIndustryValidation('Select any industry');
    } else {
      setIndustryValidation('');
    }
    if (!radioBtn) {
      setAgreementValidation('Choose Yes or No');
    } else {
      setAgreementValidation('');
    }
    if (!queryRadioBtn) {
      setCallQueryValidation('Choose Yes or No');
    } else {
      setCallQueryValidation('');
    }
    if (!initialValues.areaToClarify) {
      setClarifyValidation(
        ' Please specify the area you need clarification on.'
      );
    } else {
      setClarifyValidation('');
    }
    if (!employees && totalEmployee === 0) {
      setEmployeeValidation('Please enter the Employee Count');
    } else {
      setEmployeeValidation('');
    }
    if (
      initialValues.industryId &&
      initialValues.CountryId &&
      radioBtn &&
      queryRadioBtn &&
      initialValues.areaToClarify &&
      (employees || totalEmployee > 0)
    ) {
      setSubmitLoading(true);
      const askResponse = await askQuestionPOPUpAPI({
        ...initialValues,
        ExpertName: expertDetails?.supertopicName
          ? expertDetails.supertopicName
          : 'David',
        ExpertContentId: expertDetails?.supertopicContentId
          ? expertDetails?.supertopicContentId
          : '00000000-0000-0000-0000-000000000000',
        AgreementUploadId: id.length
          ? id
          : '00000000-0000-0000-0000-000000000000',
        CountryId: initialValues.CountryId,
        industryId: initialValues.industryId.value,
        HasAgreement: radioBtn === '1' ? true : false,
        NeedKickOffCall: queryRadioBtn === '1' ? true : false,
        HasEmployeesInCountry:totalEmployee>0?true:false,
        agreementUploadFileName:fileUpload?.name,
        EmployeesDetails: [
          perFulLocal,
          perFulExpat,
          perPartLocal,
          perPartExpat,
          consultant,
          temporary,
          contractors,
        ],
      });
      if (fileUpload === null && radioBtn === '1') {
        setUploadMessage('Please Upload the Agreement');
      } else if (askResponse && askResponse.responseCode === 200) {
        setsuccessFulSubmit(true);
        setReferenceNo(askResponse?.data?.referenceNo)
      } else {
        notify(`Invalid Input`);
      }
      mixpanel.track('Submit Query', {
        'Country Name':initialValues.countryName,
        'User Details':userDetailsMixpnel()
      })

    }
    setSubmitLoading(false);
  };
  const handleChangeValue = (e) => {
    if (e.target.name === 'areaToClarify') {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.value,
      });
    } else {
      if (e.target.name === 'permanent-full-time-local') {
        setperFulLocal({
          ...perFulLocal,
          [e.target.id]: parseInt(e.target.value),
        });
      } else if (e.target.name === 'permanent-full-time-expat') {
        setperFulExpat({
          ...perFulExpat,
          [e.target.id]: parseInt(e.target.value),
        });
      } else if (e.target.name === 'permanent-part-time-local') {
        setperPartLocal({
          ...perPartLocal,
          [e.target.id]: parseInt(e.target.value),
        });
      } else if (e.target.name === 'permanent-part-time-expat') {
        setperPartExpat({
          ...perPartExpat,
          [e.target.id]: parseInt(e.target.value),
        });
      } else if (e.target.name === 'temporary-or-interns') {
        setTemporary({ ...temporary, [e.target.id]: parseInt(e.target.value) });
      } else if (e.target.name === 'consultants') {
        setCounsultant({
          ...consultant,
          [e.target.id]: parseInt(e.target.value),
        });
      } else if (e.target.name === 'contractors') {
        setcontractors({
          ...contractors,
          [e.target.id]: parseInt(e.target.value),
        });
      }
    }
  };
  const resetFileUpload = () => {
    setFileUpload(null);
  };
  const acceptQuestion = (e) => {
    if (e.target.name === 'picture') {
      if (e.target.checked) {
        setRequiredCheck(true);
      } else {
        setRequiredCheck(false);
      }
    } else if (e.target.name === 'hours') {
      if (e.target.checked) {
        setRequiredCheck1(true);
      } else {
        setRequiredCheck1(false);
      }
    }
  };
  const noEmployees = (e) => {
    if (e.target.checked) {
      setEmployees(true);
      setInitialValues({ ...initialValues, HasEmployeesInCountry: false });
      setperFulLocal({ ...perFulLocal, Salaried: 0, Hourly: 0 });
      setperFulExpat({ ...perFulExpat, Salaried: 0, Hourly: 0 });
      setperPartLocal({ ...perPartLocal, Salaried: 0, Hourly: 0 });
      setperPartExpat({ ...perPartExpat, Salaried: 0, Hourly: 0 });
      setTemporary({ ...temporary, Hourly: 0 });
      setCounsultant({ ...consultant, Hourly: 0 });
      setcontractors({ ...contractors, Hourly: 0 });
    } else {
      setEmployees(false);
      setInitialValues({ ...initialValues, HasEmployeesInCountry: true });
    }
  };
  useEffect(() => {
    let totalSum = 0;
    if (perFulLocal.Salaried) {
      totalSum = totalSum + perFulLocal.Salaried;
    }
    if (perFulExpat.Salaried) {
      totalSum = totalSum + perFulExpat.Salaried;
    }
    if (perFulLocal.Hourly) {
      totalSum = totalSum + perFulLocal.Hourly;
    }
    if (perFulExpat.Hourly) {
      totalSum = totalSum + perFulExpat.Hourly;
    }
    if (perPartExpat.Salaried) {
      totalSum = totalSum + perPartExpat.Salaried;
    }
    if (perPartLocal.Salaried) {
      totalSum = totalSum + perPartLocal.Salaried;
    }
    if (perPartExpat.Hourly) {
      totalSum = totalSum + perPartExpat.Hourly;
    }
    if (perPartLocal.Hourly) {
      totalSum = totalSum + perPartLocal.Hourly;
    }
    if (temporary.Hourly) {
      totalSum = totalSum + temporary.Hourly;
    }
    if (consultant.Hourly) {
      totalSum = totalSum + consultant.Hourly;
    }
    if (contractors.Hourly) {
      totalSum = totalSum + contractors.Hourly;
    }
    setTotalEmployee(totalSum);
  }, [
    perFulLocal,
    perFulExpat,
    perPartExpat,
    perPartLocal,
    temporary,
    consultant,
    contractors,
  ]);
  const addEmployee = (e) => {
    if (e.target.name === 'salariedLocal') {
      setperFulLocal({ ...perFulLocal, Salaried: perFulLocal.Salaried + 1 });
    } else if (e.target.name === 'hourlyLocal') {
      setperFulLocal({ ...perFulLocal, Hourly: perFulLocal.Hourly + 1 });
    } else if (e.target.name === 'salariedExpat') {
      setperFulExpat({ ...perFulExpat, Salaried: perFulExpat.Salaried + 1 });
    } else if (e.target.name === 'hourlyExpat') {
      setperFulExpat({ ...perFulExpat, Hourly: perFulExpat.Hourly + 1 });
    } else if (e.target.name === 'partsalariedLocal') {
      setperPartLocal({ ...perPartLocal, Salaried: perPartLocal.Salaried + 1 });
    } else if (e.target.name === 'parthourlyLocal') {
      setperPartLocal({ ...perPartLocal, Hourly: perPartLocal.Hourly + 1 });
    } else if (e.target.name === 'partsalariedExpat') {
      setperPartExpat({ ...perPartExpat, Salaried: perPartExpat.Salaried + 1 });
    } else if (e.target.name === 'parthourlyExpat') {
      setperPartExpat({ ...perPartExpat, Hourly: perPartExpat.Hourly + 1 });
    } else if (e.target.name === 'temporary') {
      setTemporary({ ...temporary, Hourly: temporary.Hourly + 1 });
    } else if (e.target.name === 'consultant') {
      setCounsultant({ ...consultant, Hourly: consultant.Hourly + 1 });
    } else if (e.target.name === 'contractor') {
      setcontractors({ ...contractors, Hourly: contractors.Hourly + 1 });
    }
  };
  const minusEmployee = (e) => {
    if (e.target.name === 'salariedLocal' && perFulLocal.Salaried !== 0) {
      setperFulLocal({ ...perFulLocal, Salaried: perFulLocal.Salaried - 1 });
    } else if (e.target.name === 'hourlyLocal' && perFulLocal.Hourly !== 0) {
      setperFulLocal({ ...perFulLocal, Hourly: perFulLocal.Hourly - 1 });
    } else if (
      e.target.name === 'salariedExpat' &&
      perFulExpat.Salaried !== 0
    ) {
      setperFulExpat({ ...perFulExpat, Salaried: perFulExpat.Salaried - 1 });
    } else if (e.target.name === 'hourlyExpat' && perFulExpat.Hourly !== 0) {
      setperFulExpat({ ...perFulExpat, Hourly: perFulExpat.Hourly - 1 });
    } else if (
      e.target.name === 'partsalariedLocal' &&
      perPartLocal.Salaried !== 0
    ) {
      setperPartLocal({ ...perPartLocal, Salaried: perPartLocal.Salaried - 1 });
    } else if (
      e.target.name === 'parthourlyLocal' &&
      perPartLocal.Hourly !== 0
    ) {
      setperPartLocal({ ...perPartLocal, Hourly: perPartLocal.Hourly - 1 });
    } else if (
      e.target.name === 'partsalariedExpat' &&
      perPartExpat.Salaried !== 0
    ) {
      setperPartExpat({ ...perPartExpat, Salaried: perPartExpat.Salaried - 1 });
    } else if (
      e.target.name === 'parthourlyExpat' &&
      perPartExpat.Hourly !== 0
    ) {
      setperPartExpat({ ...perPartExpat, Hourly: perPartExpat.Hourly - 1 });
    } else if (e.target.name === 'temporary' && temporary.Hourly !== 0) {
      setTemporary({ ...temporary, Hourly: temporary.Hourly - 1 });
    } else if (e.target.name === 'consultant' && consultant.Hourly !== 0) {
      setCounsultant({ ...consultant, Hourly: consultant.Hourly - 1 });
    } else if (e.target.name === 'contractor' && contractors.Hourly !== 0) {
      setcontractors({ ...contractors, Hourly: contractors.Hourly - 1 });
    }
  };
  return (
    <Modal
      show={isOpen}
      onHide={onCancelClickListner}
      backdrop="static"
      keyboard={false}
      centered={true}
      contentClassName="custome-modal"
      dialogClassName={dialogClassName}
      data-test="Expert-Modal"
    >
      <Modal.Header className="modal-header ask-modal-header" closeButton>
        <Modal.Title>Ask a Question</Modal.Title>
        <div
          className="help_icon"
          onClick={() => {
            setShowHelp(!showHelp);
          }}
        >
          {showHelp && (
            <div className="hover-content">
              <h4>How it works</h4>
              <p>
                After submitting the form to explain your query, our experts
                will review and begin research.<br></br>
                <br></br>
                If you would prefer to chat with an expert first, you can
                indicate this on the form and our team will reach out to set up
                a time.<br></br>
                <br></br>
                If you wish to receive a direct response based on the
                information you provided in the form, our experts will get back
                to you within 3 business days with their findings. You will then
                receive an official brief on your query to keep for your
                records.<br></br>
                <br></br>
                Please note that our experts can only provide legal information
                to you and nothing should be construed as constituting legal
                advice. Depending on the aspect you’ve described in your query,
                the information provided to you may not be compiled by the
                expert on this form.
              </p>
              <span
                onClick={() => {
                  setShowHelp(false);
                }}
              >
                Close
              </span>
            </div>
          )}
        </div>
      </Modal.Header>
      <Modal.Body className="doc-modal-body ask-body-container">
        <div className="header_section d-none">
          <h4>Question For</h4>
          <div className="author_details_modal">
            <span>Expert Team Lead</span>
            <span>David Allen</span>
            <div className="author-image"></div>
          </div>
        </div>
        {!successFulSubmit ? (
          <div className="expert-form">
            {/* <h4>Ask an Expert Form</h4> */}
            <h5>
              Which country do you need legal information on?
              <span style={{ color: '#ffa366' }}>*</span> Specify Industry.
            </h5>
            <div className="row">
              <div className="col-md-5 floating">
                <ReactDropdown
                  id="countryName"
                  name="countryName"
                  htmlFor="countryName"
                  data_content="Select Country*"
                  title="country"
                  value={initialValues.countryName}
                  data={countryList || []}
                  isDisabled={false}
                  isSearchable={true}
                  Prefilled={{
                    id: initialValues.CountryId,
                    label: initialValues.countryName,
                  }}
                  onChange={handleChangeCountry}
                  data-test="countryDrop"
                />
                <span className="validation-msg">{countryValidation}</span>
              </div>
              <div className="col-md-5">
                <ReactDropdown
                  id="industryName"
                  name="industryName"
                  htmlFor="industryName"
                  data_content="Select Industry*"
                  title="industry"
                  isDisabled={false}
                  isSearchable={true}
                  value={initialValues.industryName}
                  data={industryList ? industryList : []}
                  Prefilled={initialValues.industryId}
                  onChange={handleChangeIndustry}
                  data-test="industryDrop"
                />
                <span className="validation-msg">{industryValidation}</span>
              </div>
            </div>
            <h3>
              Are you bound by the provisions of{' '}
              <span>Collective Bargaining Agreement</span> or any other
              agreement in your workplace or with a works council that bind your
              workplace and vary legal obligations? If YES, please upload
              agreement.<span style={{ color: '#ffa366' }}>*</span>
            </h3>
            <div className="swich-radio">
              <div className="switch-field">
                <input
                  type="radio"
                  id="radio-one"
                  name="switch-one"
                  value="0"
                  checked={radioBtn === '0'}
                  onChange={handleCheckRadio}
                  data-test="radioNo"
                />
                <label className="label" htmlFor="radio-one">
                  No
                </label>
                <input
                  type="radio"
                  id="radio-two"
                  name="switch-one"
                  value="1"
                  checked={radioBtn === '1'}
                  onChange={handleCheckRadio}
                  data-test="radioYes"
                />
                <label className="label" htmlFor="radio-two">
                  Yes
                </label>
                {radioBtn === '1' && fileUpload === null && radioBtn !== 0 ? (
                  <label
                    htmlFor="file-uploaded-input"
                    className="expert-upload"
                  >
                    <input
                      type="file"
                      id="file-uploaded-input"
                      name="file-uploaded"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setFileUpload(e.target.files[0]);
                        }
                      }}
                      accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                    Upload Agreement
                  </label>
                ) : fileUpload && radioBtn === '1' ? (
                  <div className="row">
                    <div>
                      <div className="file-uploaded-containers">
                        <div className="file-uploaded-label col-md-8">
                          {fileUpload?.name}
                        </div>
                        <div
                          className="file-uploaded-body col-md-4"
                          onClick={resetFileUpload}
                        >
                          <img
                            alt=""
                            src={close}
                            name="search-outline"
                            className="file-upload-remove cursor-pointer"
                          />
                          Remove
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <span className="validation-msg">{agreementValidation}</span>
              <span className="validation-msg">{uploadMessage}</span>
            </div>
            <h3>
              Based on the employee type listed below, how many employees do you
              currently employ here?
            </h3>
            <div className="agree-container">
              <div className="checkbox-wrapper">
                <label className="tab-checkbox ">
                  No employees in this country
                  <input
                    type="checkbox"
                    onChange={noEmployees}
                    checked={employees ? true : false}
                    disabled={totalEmployee > 0 || CountryDataPending ? true : false}
                    value=""
                    data-test="employeeCheck"
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
            {!employees ? (
              <div data-test="emp">
                <div className="col-12 table-header">
                  <div className="row">
                    <div className="col-md-6 pl-0">
                      <h3>
                        Employee Type
                        <span className="spinner-btn">
                          {CountryDataPending ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            ''
                          )}
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-3 text-center">
                      <h3>Salaried</h3>
                    </div>
                    <div className="col-md-3 text-center">
                      <h3>Hourly</h3>
                    </div>
                  </div>
                </div>
                <div className="inline-form-container">
                  <div className="col-md-6 pl-0">
                    Permanent (Full - Time) Local
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="salariedLocal"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="salariedLocalMinus"
                      ></button>
                      <button
                        name="salariedLocal"
                        className="plus"
                        onClick={addEmployee}
                        data-test="salariedLocalAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="permanent-full-time-local"
                        id="Salaried"
                        value={perFulLocal.Salaried}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="hourlyLocal"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="hourlyLocalMinus"
                      ></button>
                      <button
                        name="hourlyLocal"
                        className="plus"
                        onClick={addEmployee}
                        data-test="hourlyLocalAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="permanent-full-time-local"
                        id="Hourly"
                        value={perFulLocal.Hourly}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="inline-form-container">
                  <div className="col-md-6 pl-0">
                    Permanent (Full - Time) Expat
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="salariedExpat"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="salariedExpatMinus"
                      ></button>
                      <button
                        name="salariedExpat"
                        className="plus"
                        onClick={addEmployee}
                        data-test="salariedExpatAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="Salaried"
                        name="permanent-full-time-expat"
                        value={perFulExpat.Salaried}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="hourlyExpat"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="hourlyExpatMinus"
                      ></button>
                      <button
                        name="hourlyExpat"
                        className="plus"
                        onClick={addEmployee}
                        data-test="hourlyExpatAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="Hourly"
                        name="permanent-full-time-expat"
                        value={perFulExpat.Hourly}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="inline-form-container">
                  <div className="col-md-6 pl-0">
                    Permanent (Part - Time) Local
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="partsalariedLocal"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="salariedLocalPartMinus"
                      ></button>
                      <button
                        name="partsalariedLocal"
                        className="plus"
                        onClick={addEmployee}
                        data-test="salariedLocalPartAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="permanent-part-time-local"
                        id="Salaried"
                        value={perPartLocal.Salaried}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="parthourlyLocal"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="hourlyLocalPartMinus"
                      ></button>
                      <button
                        name="parthourlyLocal"
                        className="plus"
                        onClick={addEmployee}
                        data-test="hourlyLocalPartAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="permanent-part-time-local"
                        id="Hourly"
                        value={perPartLocal.Hourly}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="inline-form-container">
                  <div className="col-md-6 pl-0">
                    Permanent (Part - Time) Expat
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="partsalariedExpat"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="salariedExpatPartMinus"
                      ></button>
                      <button
                        name="partsalariedExpat"
                        className="plus"
                        onClick={addEmployee}
                        data-test="salariedExpatPartAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="permanent-part-time-expat"
                        id="Salaried"
                        value={perPartExpat.Salaried}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="number-container">
                      <button
                        name="parthourlyExpat"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="hourlyExpatPartMinus"
                      ></button>
                      <button
                        name="parthourlyExpat"
                        className="plus"
                        onClick={addEmployee}
                        data-test="hourlyExpatPartAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="Hourly"
                        name="permanent-part-time-expat"
                        value={perPartExpat.Hourly}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="inline-form-container">
                  <div className="col-md-6 pl-0">Temporary/Interns</div>
                  <div className="col-md-3">
                    <div className="number-container hourly-section">
                      <button
                        name="temporary"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="temporaryMinus"
                      ></button>
                      <button
                        name="temporary"
                        className="plus"
                        onClick={addEmployee}
                        data-test="temporaryAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="Hourly"
                        name="temporary-or-interns"
                        value={temporary.Hourly}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="inline-form-container">
                  <div className="col-md-6 pl-0">Consultant</div>
                  <div className="col-md-3">
                    <div className="number-container hourly-section">
                      <button
                        name="consultant"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="consultantMinus"
                      ></button>
                      <button
                        name="consultant"
                        className="plus"
                        onClick={addEmployee}
                        data-test="consultantAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="consultants"
                        id="Hourly"
                        value={consultant.Hourly}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="inline-form-container">
                  <div className="col-md-6 pl-0">Contractor</div>
                  <div className="col-md-3">
                    <div className="number-container hourly-section">
                      <button
                        name="contractor"
                        className="minus"
                        onClick={minusEmployee}
                        data-test="contractorMinus"
                      ></button>
                      <button
                        name="contractor"
                        className="plus"
                        onClick={addEmployee}
                        data-test="contractorAdd"
                      ></button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="contractors"
                        id="Hourly"
                        value={contractors.Hourly}
                        onChange={handleChangeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="count-footer">
                  <span>Total employee count</span>
                  <span>{totalEmployee}</span>
                </div>{' '}
                <span className="validation-msg">{employeeValidation}</span>
              </div>
            ) : (
              ''
            )}
            <h3>
              Our legal team can provide explanations and interpretations on the
              law. Please specify the area you need clarification on.
              <span style={{ color: '#ffa366' }}>*</span>
            </h3>
            <h6>
              Please do not disclose information that could be used to identify
              an individual under your employ.
            </h6>
            <div className="description-modal">
              <span>
                Characters left : {800 - initialValues.areaToClarify.length}
              </span>
              <textarea
                className="form-control"
                name="areaToClarify"
                value={initialValues.areaToClarify}
                onChange={handleChangeValue}
                maxLength={800}
              />
            </div>
            <span className="validation-msg">{clarifyValidation}</span>
            <h3>
              Would you like a kick off call to receive a direct response to
              your research?<span style={{ color: '#ffa366' }}>*</span>
            </h3>
            <div className="swich-radio">
              <div className="switch-field">
                <input
                  type="radio"
                  id="radio-one1"
                  name="switch-one1"
                  value="0"
                  checked={queryRadioBtn === '0'}
                  onChange={handleCheckQueryRadio}
                />
                <label className="label" htmlFor="radio-one1">
                  No
                </label>
                <input
                  type="radio"
                  id="radio-two1"
                  name="switch-one1"
                  value="1"
                  checked={queryRadioBtn === '1'}
                  onChange={handleCheckQueryRadio}
                />
                <label className="label" htmlFor="radio-two1">
                  Yes
                </label>
              </div>
              <span className="validation-msg">{callQueryValidation}</span>
            </div>
            <div className="agree-container">
              <div className="checkbox-wrapper">
                <label className="tab-checkbox ">
                  I understand that the expert pictured on the country page may
                  not necessarily be the individual who will conduct this
                  research.<span style={{ color: '#ffa366' }}>*</span>
                  <input
                    name="picture"
                    type="checkbox"
                    checked={requiredCheck ? true : false}
                    value=""
                    onChange={acceptQuestion}
                  />
                  <span className="checkmark" />
                </label>
              </div>
              <div className="checkbox-wrapper">
                <label className="tab-checkbox ">
                I accept that this query could take up to 10 of my allotted hours. If the estimated time to completion exceeds this amount, I will be notified and asked to approve.
                  <span style={{ color: '#ffa366' }}>*</span>
                  <input
                    type="checkbox"
                    name="hours"
                    checked={requiredCheck1 ? true : false}
                    value=""
                    onChange={acceptQuestion}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="successfull-page">
            <div>Your query was successfully submitted.</div>
            <div>Our team will be in touch soon.</div>
            <div>Your Reference # is <b>{referenceNo}</b></div>

            <div>
              <button
                type="button"
                className="done-button"
                onClick={handleDone}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="role_footer_model ask-expert-footer">
        {!successFulSubmit ? (
          <div
            className={
              (requiredCheck && requiredCheck1)&&!submitLoading ? 'btn-modal' : 'btn-dis-modal'
            }
          >
            <button
              data-test="sub"
              type="button"
              disabled={(requiredCheck && requiredCheck1)&&!submitLoading ? false: true}
              onClick={()=>{
                setSubmitLoading(true)
                handleSubmit()}}
            >
              {submitLoading ? <Spinner animation="border" size="sm" /> : null}
              Submit Query
            </button>
          </div>
        ) : (
          ''
        )}
      </Modal.Footer>
    </Modal>
  );
}
export default AskanExpertModal;
