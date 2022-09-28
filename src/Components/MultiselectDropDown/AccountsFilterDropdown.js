import React, { useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import FilterIcon from "../../assets/images/filter.svg";
import "./FilterDropdown.css";
import close from "../../assets/images/close.svg";

const AccountsFilterDropdown = ({ data, accountFilter, subscriptionList, setAccountFilter }) => {
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    setFlag(!flag);
  };

  const resetCurrentFilter = () => {
    setFlag(!flag);
    setAccountFilter({ ...accountFilter, subscriptions: [], showUsersStatusBy: [] });
  }

  const onSelectFilter = (e, itemId) => {
    let subscriptions = [...accountFilter.subscriptions];

    if (e.target.checked) {
      subscriptions.push(itemId);
    } else {
      subscriptions = subscriptions.filter((subs) => subs != itemId);
    }

    setAccountFilter({ ...accountFilter, subscriptions });
  };

  const onSelectUserStatus = (e, itemId) => {
    let showUsersStatusBy = [...accountFilter.showUsersStatusBy];

    if (e.target.checked) {
      showUsersStatusBy = [itemId];
    } else if (showUsersStatusBy.includes(itemId)) {
      showUsersStatusBy = [];
    }

    setAccountFilter({ ...accountFilter, showUsersStatusBy });
  };

  return (
    <>
      <button className="btn btn-filter border-0" onClick={handleClick} data-test="accountFilter">
        {flag ? <img src={close} /> : <img src={FilterIcon} />}
      </button>
      {flag ?
        <div className="bg-white filter-dropdown" >
          <h4>Filters</h4>
          <Accordion defaultActiveKey="1">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Subscription
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <ul>
                    {
                      subscriptionList && subscriptionList.map((item) => (
                        <li key={item.id}>
                          <input
                            type="checkbox"
                            id={item.id}
                            value={item.id}
                            onChange={(e) => onSelectFilter(e, item.id)}
                            defaultChecked={accountFilter?.subscriptions?.includes(item.id)}
                            checked={accountFilter?.subscriptions?.includes(item.id)}
                            data-test="checkbox"
                          /> <label for={item.id}>{item.name}</label>
                        </li>
                      ))
                    }
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
                defaultChecked={accountFilter?.showUsersStatusBy?.includes('deactivated')}
                checked={accountFilter?.showUsersStatusBy?.includes('deactivated')}
                onChange={(e) => onSelectUserStatus(e, 'deactivated')} data-test="input"/> 
                <label for="deactivate-id">Show Deactivated Accounts Only</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="activate-id"
                defaultChecked={accountFilter?.showUsersStatusBy?.includes('activated')}
                checked={accountFilter?.showUsersStatusBy?.includes('activated')}
                onChange={(e) => onSelectUserStatus(e, 'activated')} data-test="checkbox1"/>
                <label for="activate-id">Show Active Accounts Only</label>
            </li>
          </ul>
          <div className="reset-filter-hr-template" data-testid="reset-filter" onClick={resetCurrentFilter} data-test="resetFilter">Reset Filters</div>
        </div> : ""}

    </>
  );
};

export default AccountsFilterDropdown;
