import { shallow,mount } from "enzyme";
import { findByTestAttr, checkProps } from "../../test/testUtils";
import CustomePagination from './CustomePagination'


const setup = (defaultProps) => {
  const setupProps = { ...defaultProps };
  return mount(<CustomePagination {...setupProps} />);
};

describe("Render customePagination without error", () => {
    let wrapper;
    const defaultProps = {
        totalLength:50,
        onPageChangedCalled:jest.fn(),
        limit:10,
        pageNumber:1,
        disabledJumpTo:false,
        paginationRowsPerPageOptions:[],
        handleDropdownChange:jest.fn(),
        notify:jest.fn(),
       };
    beforeEach(() => {
      wrapper = setup(defaultProps);
    });
    test("Render customePagination Component  Without Error", () => {
      const customePagination = findByTestAttr(wrapper, "customePagination");
      expect(customePagination.length).toBe(1);
    });
  });

  describe("Render customePagination with props passed", () => {
    let wrapper;
    const defaultProps = {
        totalLength:50,
        onPageChangedCalled:jest.fn(),
        limit:10,
        pageNumber:1,
        disabledJumpTo:false,
        paginationRowsPerPageOptions:[],
        handleDropdownChange:jest.fn(),
        notify:jest.fn(),
       };
    beforeEach(() => {
      wrapper = setup(defaultProps);
    });
    test("Render customePagination Component  With paginationRowsPerPageOptions", () => {
      let wrapper1= setup({...defaultProps,paginationRowsPerPageOptions:["one","two","three"],pageNumber:4})
      const customePaginationoption = findByTestAttr(wrapper1, "option");
      expect(customePaginationoption.length).toBe(3);
    });
    test("handle previous click without error", () => {
        let wrapper1= setup({...defaultProps,pageNumber:4})
        const previousPage = findByTestAttr(wrapper1, "previousPage");
        expect(previousPage.simulate('click').length).toBe(1);
      });
      test("handle jumpTo click without error", () => {
        let wrapper1= setup({...defaultProps,pageNumber:4})
        const jumpTo = findByTestAttr(wrapper1, "jumpTo");
        expect(jumpTo.simulate('change',{"target":{"value":2}}).length).toBe(1);
        expect(jumpTo.simulate('change',{"target":{"value":10}}).length).toBe(1);
        expect(jumpTo.simulate('change',{"target":{"value":0}}).length).toBe(1);
      });
      test("handle firstPage click without error", () => {
        let wrapper1= setup({...defaultProps,pageNumber:4})
        const firstPage = findByTestAttr(wrapper1, "firstPage");
        expect(firstPage.simulate('click').length).toBe(1);
      });
      test("handle lastpage click without error", () => {
        let wrapper1= setup({...defaultProps,pageNumber:4})
        const lastPage = findByTestAttr(wrapper1, "lastPage");
        expect(lastPage.simulate('click').length).toBe(1);
      });
      test("handle nextPage click without error", () => {
        let wrapper1= setup({...defaultProps,pageNumber:4})
        const nextPage = findByTestAttr(wrapper1, "nextPage");
        expect(nextPage.simulate('click').length).toBe(1);
      });
  });