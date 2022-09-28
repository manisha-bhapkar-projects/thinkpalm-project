// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
// import '@testing-library/jest-dom/extend-expect';

import Enzyme from "enzyme";
import EnzymeAdapter from "@wojtekmaj/enzyme-adapter-react-17";
import 'jest-canvas-mock';

Enzyme.configure({ adapter: new EnzymeAdapter() });
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () { },
      removeListener: function () { },
    };
  };
const noop = () => { };
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
Object.defineProperty(window, 'scrollBy', { value: noop, writable: true });

var localStorageMock = (function () {
  var store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
class SVGPathElement extends HTMLElement { }
window.SVGPathElement = SVGPathElement