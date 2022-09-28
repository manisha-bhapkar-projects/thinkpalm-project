import React, { useEffect, useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import FilterIcon from '../../assets/images/filter.svg';
import './FilterDropdown.css';
import close from '../../assets/images/close.svg';
import { getExpertEmailList } from '../../Store/reducers/Purchase_ExpertBriefs';
import { useDispatch, useSelector } from 'react-redux';

const FilterDropDwon = ({
  data,
  userFilter,
  setUserFilter,
  selectedRole,
  briefFlag,
  assigneeFilter,
  setAssigneeFilter,
  statusFilter,
  setStatusFilter,
  initialValues,
  setInitialValues,
  FilterAPIRequest
}) => {
  const [flag, setFlag] = useState(false);
  const [filter, setFilter] = useState(false);
  const [toggleId, setToggleId] = useState();
  const dispatch = useDispatch();

  const expertEmailList = useSelector(
    (state) => state?.purchaseExpertReducer?.expertEmailList
  );

  useEffect(() => {
    dispatch(getExpertEmailList());
  }, []);


  const handleClick = () => {
    setFlag(!flag);
  };

  const onSelectFilter = (e, itemId) => {
    let roles = [...userFilter.roles];
    if (e.target.checked) {
      roles.push(itemId);
    } else {
      roles = roles.filter((rls) => rls != itemId);
    }
    setUserFilter({ ...userFilter, roles });
  };

  const onSelectUserStatus = (e, itemId) => {
    let showUsersStatusBy = [...userFilter.showUsersStatusBy];
    if (e.target.checked) {
      showUsersStatusBy = [itemId];
    } else if (showUsersStatusBy.includes(itemId)) {
      showUsersStatusBy = [];
    }
    setUserFilter({ ...userFilter, showUsersStatusBy });
  };

  const resetCurrentFilter = () => {
    setFlag(!flag);
    setUserFilter({ ...userFilter, roles: [], showUsersStatusBy: [] });
  };

  const resetBriefsFilter = () => {
    setAssigneeFilter({ assignIds : [] });
    setStatusFilter({statusId : [] });
    setInitialValues({StartDate: '', EndDate: '' });
    FilterAPIRequest({StartDate: "", EndDate: "", assigneeIds: [], statusIds: []});
  }

  const onSelectAssigneeFilter = (e, assigneeID) => {
    let temp = [...assigneeFilter.assignIds];
    if (e.target.checked) {
      temp.push(assigneeID);
    } else {
      temp = temp.filter((id) => id != assigneeID);
    }
    setAssigneeFilter({ assignIds : temp });
    FilterAPIRequest({ assigneeIds: temp.join(",")});

  };

  const onSelectStatusFilter = (e, statusId) => {
    let temp = [...statusFilter.statusId];
    if (e.target.checked) {
      temp.push(statusId);
    } else {
      temp = temp.filter((id) => id != statusId);
    }
    setStatusFilter({ statusId: temp });
    FilterAPIRequest({ statusIds: temp.join(",")});
  };

const handleChangeInput = (e) => {
  const {name, value} = e.target;

  setInitialValues({
    ...initialValues,
    [name]: value,
  });

  if(initialValues.StartDate && name === 'EndDate' && value) {
    FilterAPIRequest({StartDate: initialValues.StartDate, EndDate: value})
  }
};

const handleAccordianToggle = (e, id) => {
  if(id === toggleId) {
    setToggleId(-1);
  } else {
    setToggleId(id);
  }
}
  return (
    <>
      <button
        className="btn btn-filter border-0"
        onClick={handleClick}
        data-test="accountFilter"
      >
        {flag ? <img src={close} /> : <img src={FilterIcon} />}
      </button>
      {flag ? (
        <div className="bg-white filter-dropdown"
        >
          <h4>Filters</h4>
          {briefFlag ? (
            <div data-test="briefsFilter">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle 
                  onClick={(e) => handleAccordianToggle(e, 0)} 
                  as={Card.Header} 
                  className={`${toggleId === 0 ? 'minus' : ''}`} 
                  eventKey="0">
                    Date Submitted
                  </Accordion.Toggle>
                  <Accordion.Collapse
                    eventKey="0"
                    className="max-height-collapse custom-scroll"
                  >
                    <Card.Body>
                      <ul data-test="dateInput">
                        <li className="calendar-control">
                          <label>From</label>
                          <input 
                            type="date" 
                            name='StartDate'
                            value={initialValues?.StartDate}
                            onChange={handleChangeInput}
                            placeholder=""
                            data-test="inputDate" 
                          />
                        </li>
                        <li className="calendar-control">
                          <label>To</label>
                          <input 
                            type="date"
                            name='EndDate' 
                            value={initialValues?.EndDate}
                            onChange={handleChangeInput}
                            data-test="inputDate" 
                          />
                        </li>
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} 
                  eventKey="1"
                  onClick={(e) => handleAccordianToggle(e, 1)} 
                  className={`${toggleId === 1 ? 'minus' : ''}`} 
                  >
                    Assignee
                  </Accordion.Toggle>
                  <Accordion.Collapse
                    eventKey="1"
                    className="max-height-collapse custom-scroll"
                    
                  >
                    <Card.Body>
                      <ul data-test="assigneeFilter">
                        {expertEmailList && expertEmailList.length
                          ? expertEmailList.map((assignee, index) => {
                              return (
                                <li key={index}>
                                  <input
                                    type="checkbox"
                                    value={assignee.userId}
                                    onChange={(e) =>
                                      onSelectAssigneeFilter(
                                        e,
                                        assignee.userId
                                      )
                                    }
                                    id={assignee.userId}
                                    // defaultChecked={assigneeFilter?.assignIds?.includes(
                                    //   assignee.userId
                                    // )}
                                    checked={assigneeFilter?.assignIds?.includes(
                                      assignee.userId
                                    )}
                                    
                                  />
                                  <label htmlFor={assignee.userId}>
                                    {assignee.userName}
                                  </label>
                                </li>
                              );
                            })
                          : ''}
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card >
                  <Accordion.Toggle as={Card.Header} eventKey="2"
                    onClick={(e) => handleAccordianToggle(e, 2)} 
                    className={`${toggleId === 2 ? 'minus' : ''}`}
                    >
                    Status
                  </Accordion.Toggle>
                  <Accordion.Collapse
                    eventKey="2"
                    className="max-height-collapse custom-scroll"
                  
                  >
                    <Card.Body>
                      <ul data-test="statusFilter">
                        {data && data.length
                          ? data.map((status) => {
                              return (
                                <li key={status.id}>
                                  <input
                                    type="checkbox"
                                    value={status.id}
                                    onChange={(e) =>
                                      onSelectStatusFilter(e, status.id)
                                    }
                                    id={status.id}
                                    // defaultChecked={statusFilter?.statusId?.includes(status.id)}
                                    checked={statusFilter?.statusId?.includes(status.id)}

                                    
                                    data-test="statusCheckbox"
                                  />
                                  <label htmlFor={status.id}>
                                    {status.status}
                                  </label>
                                </li>
                              );
                            })
                          : ''}
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              <div
                  className="reset-filter-hr-template"
                  data-testid="reset-filter"
                  onClick={resetBriefsFilter}
                  data-test="BriefsResetFilter"
                >
                  Reset Filters
                </div>
            </div>
          ) : (
            <div data-test="rolesFilter">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Roles
                  </Accordion.Toggle>
                  <Accordion.Collapse
                    eventKey="0"
                    className="max-height-collapse custom-scroll"
                  >
                    <Card.Body>
                      <ul data-test="rolesList">
                        {data && data.length
                          ? data.map((roles) => {
                              return (
                                <li key={roles.id}>
                                  <input
                                    type="checkbox"
                                    value={roles.id}
                                    onChange={(e) => onSelectFilter(e, roles.id)}
                                    id={roles.id}
                                    // defaultChecked={userFilter?.roles?.includes(
                                    //   roles.id
                                    // )}
                                    checked={userFilter?.roles?.includes(
                                      roles.id
                                    )}
                                    data-test="checkbox"
                                  />{' '}
                                  <label htmlFor={roles.id}>
                                    {roles.roleName}
                                  </label>
                                </li>
                              );
                            })
                          : ''}
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <ul className="suboption">
                <li>
                  <input
                    type="checkbox"
                    id="deactivate-id"
                    // defaultChecked={userFilter?.showUsersStatusBy?.includes(
                    //   'deactivated'
                    // )}
                    checked={userFilter?.showUsersStatusBy?.includes(
                      'deactivated'
                    )}
                    onChange={(e) => onSelectUserStatus(e, 'deactivated')}
                    data-test="input"
                  />
                  <label htmlFor="deactivate-id">Hide Deactivated Users</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="activate-id"
                    // defaultChecked={userFilter?.showUsersStatusBy?.includes(
                    //   'activated'
                    // )}
                    checked={userFilter?.showUsersStatusBy?.includes(
                      'activated'
                    )}
                    onChange={(e) => onSelectUserStatus(e, 'activated')}
                    data-test="checkbox1"
                  />
                  <label htmlFor="activate-id">Show Deactivated Users</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="client-id"
                    // defaultChecked={userFilter?.showUsersStatusBy?.includes(
                    //   'client'
                    // )}
                    checked={userFilter?.showUsersStatusBy?.includes('client')}
                    onChange={(e) => onSelectUserStatus(e, 'client')}
                    data-test="checkbox2"
                  />
                  <label htmlFor="client-id">Show Client Users Only</label>
                </li>
              </ul>
              <div
                className="reset-filter-hr-template"
                data-testid="reset-filter"
                onClick={resetCurrentFilter}
                data-test="resetFilter"
              >
                Reset Filters
              </div>
            </div>
          )}

        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default FilterDropDwon;
