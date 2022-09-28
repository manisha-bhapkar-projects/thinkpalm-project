import { shallow } from "enzyme";
import { findByTestAttr, checkProps } from "../../test/testUtils";
import ComingSoon from './index'


const setup = (defaultProps) => {
  const setupProps = { ...defaultProps };
  return shallow(<ComingSoon {...setupProps} />);
};

describe("Render ComingSoon without error", () => {
    let wrapper;
    const defaultProps = {
        direction:""
       };
    beforeEach(() => {
      wrapper = setup(defaultProps);
    });
    test("Render ComingSoon Component  Without Error", () => {
      const comingSoon = findByTestAttr(wrapper, "comingSoon");
      expect(comingSoon.length).toBe(1);
    });
  });

  describe("Render ComingSoon with props passed", () => {
    let wrapper;
      const defaultProps = {
          direction:"arrow-top"
         };
      beforeEach(() => {
        wrapper = setup(defaultProps);
      });
    test("Render Comingsoon Component  With props top", () => {
      const defaultProps = {
        direction:"top"
       };
     let wrapper1=setup(defaultProps)
      const comingSoon = findByTestAttr(wrapper1, "comingSoon");
      expect(comingSoon.length).toBe(1);
    });
    test("Render Comingsoon Component  With props bottom", () => {
      const defaultProps = {
        direction:"bottom"
       };
     let wrapper1=setup(defaultProps)
      const comingSoon = findByTestAttr(wrapper1, "comingSoon");
      expect(comingSoon.length).toBe(1);
    });
    test("Render Comingsoon Component  With props right", () => {
      const defaultProps = {
        direction:"right"
       };
     let wrapper1=setup(defaultProps)
      const comingSoon = findByTestAttr(wrapper1, "comingSoon");
      expect(comingSoon.length).toBe(1);
    });
    test("Render Comingsoon Component  With props left", () => {
      const defaultProps = {
        direction:"left"
       };
     let wrapper1=setup(defaultProps)
      const comingSoon = findByTestAttr(wrapper1, "comingSoon");
      expect(comingSoon.length).toBe(1);
    });
  });