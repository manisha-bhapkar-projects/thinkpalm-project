import { shallow } from "enzyme";
import { findByTestAttr, checkProps } from "../../test/testUtils";
import CustomeDropDown from "./CustomeDropDown";

const defaultProps = {
  data: [],
  value: "",
  placeholder: "",
  filterDropdown: false,
};
const setup = (props) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<CustomeDropDown {...setupProps} />);
};

describe("Render CustomeDropDown without error", () => {
  let wrapper;
  let props = {};
  beforeEach(() => {
    wrapper = setup(props);
  });
  test("Render DropDown Component  Without Error", () => {
    const dropDown = findByTestAttr(wrapper, "dropDown");
    expect(dropDown.length).toBe(1);
  });
});
describe("CustomeDropDown Component with data", () => {
  let wrapper;
  const props = {
    data: [{ id: 1, value: "test" }],
    value: "",
    placeholder: "testqq",
  };
  beforeEach(() => {
    wrapper = setup(props);
  });
  test("Render text of dropdown item Component  Without Error", () => {
    const dropDownItem = findByTestAttr(wrapper, "dropF");
    expect(dropDownItem.text()).toBe("test");
  });
  test("Render class of dropdown item Compont  Without Error", () => {
    let wrapper1 = setup({ ...props, filterDropdown: true });
    const dropDownItem = findByTestAttr(wrapper1, "dropF");
    expect(dropDownItem.hasClass("filter")).toBeTruthy();
  });
});

describe("CustomeDropDown Component without data", () => {
  let wrapper;
  const props = { data: [], value: "cat", placeholder: "testqq" };
  beforeEach(() => {
    wrapper = setup(props);
  });

  test("Render dropdown Component  Without Error", () => {
    const dropDownItem = findByTestAttr(wrapper, "dropT");
    expect(dropDownItem.text()).toBe("");
  });
});
