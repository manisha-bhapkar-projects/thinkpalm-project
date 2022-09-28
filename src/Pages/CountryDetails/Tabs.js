import React, { useEffect, useState } from "react";
import TabPane from "./TabPane";

const Tabs = (props) => {
  console.log(props);
  const { children } = props;
  const [tabHeader, setTabHeader] = useState([]);
  const [tabsHeader, setTabsHeader] = useState([]);
  const [childContent, setChildConent] = useState({});
  const [active, setActive] = useState("");
  useEffect(() => {
    const headers = [];
    const subheaders = [];
    const childCnt = {};
    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;
      const { name } = element.props;
      headers.push(name);
      childCnt[name] = element.props.children;
    });
    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;
      const { topic_names_list } = element.props;
      subheaders.push(topic_names_list);
    });
    setTabsHeader(subheaders);
    setTabHeader(headers);
    setActive(headers[0]);
    setChildConent({ ...childCnt });
    console.log(childCnt);
  }, [props, children]);

  const changeTab = (name) => {
    setActive(name);
  };

 const setSubHeading = (i) =>{
    let subheads = [];
    if(tabsHeader[i].length>0){
    tabsHeader[i].map(e=> subheads.push(<li>{e}</li>));
    }
    let sample_html = <>
    <div className="round yellow_bg"></div>
    <ul>
      {subheads}
    </ul>
    </>
    return sample_html;
  }

  return (
    <div className="row">
      <div className="col-lg-4 scrollscpy_overflow">
        <ul className="tab-header">
          {tabHeader.map((item,i) => (
             <li
                onClick={() => changeTab(item)}
                key={item}
                className={item === active ? "active" : ""}
              >
                {item}
                {setSubHeading(i)} 
              </li>
            
           ))}
        </ul>
      </div>
        <div className="col-lg-8">
        <div className="tab-content scrollscpy_overflow">
        {Object.keys(childContent).map((key) => {
          if (key === active) {
            return <div className="scrollspy-para">{childContent[key]}</div>;
          } else {
            return null;
          }
        })}
      </div>
        </div>
      
    </div>
  );
};

Tabs.propTypes = {
  children: function (props, propName, componentName) {
    const prop = props[propName];

    let error = null;
    React.Children.forEach(prop, function (child) {
      if (child.type !== TabPane) {
        error = new Error(
          "`" + componentName + "` children should be of type `TabPane`."
        );
      }
    });
    return error;
  }
};

export default Tabs;
