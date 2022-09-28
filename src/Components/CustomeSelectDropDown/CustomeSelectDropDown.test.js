import { shallow } from "enzyme";
import { findByTestAttr, checkProps } from "../../test/testUtils";
import CustomeSelectDropdown from './CustomeSelectDropdown'

const defaultProps = {
    data: undefined,
    placeholder:"",
    Prefilled:"test"
  };
const setup = (props) => {
    const setupProps = { ...defaultProps,...props };
  return shallow(<CustomeSelectDropdown {...setupProps} />);
};

describe("Select-Dropdown Component",()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper=setup()
    })

    test("render select dropdown without error",()=>{
        const selectDropDown=findByTestAttr(wrapper,'select-dropdown');
        expect(selectDropDown.length).toBe(1)
        
    })
})
describe("Select-Dropdown Component without data",()=>{
    let wrapper;
    let props={
        placeholder:'testLabel'
    }
    beforeEach(()=>{
        wrapper=setup(props)
    })

    test("render option without error",()=>{
        expect(wrapper.find('option').text()).toBe(' ')
    })
})
describe("SelectDropDown Component with data", () => {
    let wrapper;
    const props = {
      data: [{ id: 1, value: "test" }],
    };
    beforeEach(() => {
      wrapper = setup(props);
    });
 test('render the option when data prop have value',()=>{
    const optionDiv=findByTestAttr(wrapper,'option')
    expect(optionDiv.text()).toBe("test")
    expect(wrapper.find('option').length).toBe(2)
 })

})
