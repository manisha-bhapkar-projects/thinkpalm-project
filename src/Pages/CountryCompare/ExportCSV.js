import React from "react";
import Download from "../../assets/images/download.png";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import constants from "../../utils/constants";
import { Tooltip } from "react-bootstrap";
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from '../../utils/utils';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
export  const exportToCSV = (csvData, fileName,compareCountry,userTabs) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
  if(compareCountry){
    mixpanel.track('Content Downloads', {"Content Country Name":contentCountryName(csvData),
      'User Details':userDetailsMixpnel()})
  }else if(userTabs==="Users"){
    mixpanel.track('Click on Download Users', {
      'User Details':userDetailsMixpnel()})
  }
 
};
const contentCountryName=(data)=>{
  let country={}
  data.forEach((item,index)=>{
      country[`Content Country Name${index+1}`]=item?.Snapshot
  })
  return country
}

export const ExportCSV = ({ csvData, fileName,compareCountry,userTabs }) => {
  return (
    <OverlayTrigger
      overlay={(props) => (
        <Tooltip id={`Download-Button`} {...props} data-test="overlay">
          Click here to download
        </Tooltip>
      )}
      data-test="Export"
    >
      <a style={{cursor: "pointer"}}  onClick={(e) => exportToCSV(csvData, fileName,compareCountry,userTabs)} data-test="download">
        
        <img src={Download} alt=""/>
      </a>
    </OverlayTrigger>
  );
};
