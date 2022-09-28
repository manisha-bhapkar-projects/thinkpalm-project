import { shallow,mount } from "enzyme";
import Select from 'react-select';
import { findByTestAttr, checkProps } from "../../test/testUtils";
import ReactDropdown from './reactDropdown'


const setup = (defaultProps) => {
  const setupProps = { ...defaultProps };
  return mount(<ReactDropdown {...setupProps} />);
};

describe("Render reactDropdown without error by defaultprops", () => {
    let wrapper;
    const defaultProps = {
        id:"1",
        name:"test",
        placeholder:"test",
        htmlFor:"test",
        data_content:"test",
        title:"test",
        noFloating:false,
        value:"test",
        data:[],
        onChange:jest.fn(),
        Prefilled:"test",
        isClearable:false,
        isDisabled:false,
        isSearchable:true,
        showArrow:false,
        fromCountryConfigView:false
       };
    beforeEach(() => {
      wrapper = setup(defaultProps);
    });
    test("Render reactDropdown Component  Without Error", () => {
      const reactDropdown = findByTestAttr(wrapper, "react-dropdown");
      expect(reactDropdown.length).toBe(1);
    });
    test("Render reactDropdown Component  handle onchange", () => {
       
      const select = findByTestAttr(wrapper, "select");
      expect(select.first().simulate('change',{"target":{"value":"hello"}}).length).toBe(1);
    });
    
  });
  describe("Render reactDropdown with props", () => {
    let wrapper;
    const defaultProps = {
        id:"1",
        name:"test",
        placeholder:"test",
        htmlFor:"test",
        data_content:"test",
        title:"test",
        noFloating:true,
        value:"test",
        data:[{id:1,value:"test"}],
        onChange:jest.fn(),
        Prefilled:"",
        isClearable:true,
        isDisabled:true,
        isSearchable:true,
        showArrow:true,
        fromCountryConfigView:true
       };
    beforeEach(() => {
      wrapper = setup(defaultProps);
    }); 
    test("Render reactDropdown Component  handle onchange", () => {
       
        const select = findByTestAttr(wrapper, "select");
        expect(select.first().simulate('change',{"target":{"value":"hello"}}).length).toBe(1);
      });
    
   
  });
 

