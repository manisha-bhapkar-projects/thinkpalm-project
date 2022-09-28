import React, { useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import FilterIcon from "../../assets/images/filter.svg";
import "./FilterDropdown.css";
import close from "../../assets/images/close.svg";

const HRTemplateFilterDropdown = ({ data, languages, resetFilter, selectedLanguages, handleClickSelect, selectedType }) => {
  const [flag, setFlag] = useState(false);
  const [filter, setFilter] = useState(false);

  const handleClick = () => {
    setFlag(!flag);
  };

  return (
    <>
      <button className="btn btn-filter border-0" data-testid="open-filter-dropdown" onClick={handleClick} data-test="hrtemp">
        {flag ? <img src={close} /> : <img src={FilterIcon} />}
      </button>
      {flag ?
        <div className="bg-white filter-dropdown">
          <h4>Filters</h4>
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Document Type
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0" className="max-height-collapse custom-scroll"
              >
                <Card.Body>
                  <ul>
                    {data && data.length
                      ? data.map((cats, i) => {
                        return (
                          <li key={Math.random().toString(36).substr(2, 5)} style={{ cursor: 'pointer' }}>
                            <input type="checkbox" data-testid={"cats-check-btn" + i} value={cats.id}
                              onChange={(e) => handleClickSelect(cats, e, 'document')}
                              selected={selectedType}
                              id={cats.id}
                              checked={selectedType.includes(cats.id)} data-test="hrCheck" /> 
                              <label htmlFor={cats.id}>{cats.categoryName}</label>
                          </li>
                        );
                      })
                      : ""}
                  </ul>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          {/* <Accordion defaultActiveKey="1">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Language
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1" className="max-height-collapse custom-scroll">
                <Card.Body>
                  <ul>
                    {languages && languages.map((language, i) => {
                      return (
                        <li key={Math.random().toString(36).substr(2, 5)} style={{ cursor: 'pointer' }}>
                          <input type="checkbox" data-testid={"langs-eng-check-btn" + i} value={language.id}
                            onChange={(e) => handleClickSelect(language, e, 'language')}
                            selected={selectedLanguages}
                            id={language.id}
                            checked={selectedLanguages.includes(language.id)} />
                            <label htmlFor={language.id}>{language.language_Name}</label>
                        </li>
                      );
                    })}
                    <li style={{ cursor: 'pointer' }}>
                      <input type="checkbox" data-testid="langs-check-btn" value={0}
                        onChange={(e) => handleClickSelect('all', e, 'language')}
                        selected={selectedLanguages}
                        id="local"
                        checked={selectedLanguages.includes('all')} />
                        <label htmlFor="local">Local</label>
                    </li>
                  </ul>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion> */}
          <div className="reset-filter-hr-template" data-testid="reset-filter" onClick={resetFilter}>Reset Filters</div>
        </div> : ""}

    </>
  );
};

export default HRTemplateFilterDropdown;
