import { shallow } from "enzyme";
import { findByTestAttr, checkProps } from "../../../test/testUtils";
import { ExportCSV } from "../ExportCSV";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const setup = (props) => {
  return shallow(<ExportCSV {...props} />);
};


describe("Render ExportCsv without error", () => {
    let wrapper;
    let props={
        compareCountry:true,
        csvData:[
            {
            Bonus_Payments: undefined,
            Employee_Termination_Severance: undefined,
            Maternity_Leave: undefined,
            Public_Holidays: "New Year's Day;31 Dec 2020 – 1 Jan 2021;Shrove Monday;Mon, 15 Feb, 2021"},
            {
                Bonus_Payments: undefined,
                Employee_Termination_Severance: undefined,
                Maternity_Leave: undefined,
                Public_Holidays: "New Year's Day;31 Dec 2020 – 1 Jan 2021;Shrove Monday;Mon, 15 Feb, 2021" 
            }],
            fileName:"country"
    }
    beforeEach(() => {
      wrapper = setup(props);
    });
    test("Render ExportCsv Component  Without Error", () => {
        global.URL.createObjectURL = jest.fn();
      const Export = findByTestAttr(wrapper, "Export");
      const download = findByTestAttr(wrapper,"download")
      expect(Export.length).toBe(1);
      expect(Export.simulate('overlay').length).toBe(1)
     
      expect(download.simulate('click').length).toBe(1)
    });
  });

 