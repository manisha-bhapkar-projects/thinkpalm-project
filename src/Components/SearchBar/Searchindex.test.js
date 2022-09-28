import { shallow,mount } from "enzyme";
import { Provider } from "react-redux";
import Select from 'react-select';
import { findByTestAttr, checkProps } from "../../test/testUtils";
import SearchBar from './index'
import configureStore from 'redux-mock-store';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from "../../keycloak";
import thunk from "redux-thunk";
const mockStore = configureStore([thunk]);

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/example/path"
  })
}));
const setup = (defaultProps,store) => {
  const setupProps = { ...defaultProps };
  return mount(<ReactKeycloakProvider authClient={keycloak}><Provider store={store}><SearchBar {...setupProps} /></Provider></ReactKeycloakProvider>);
};

describe("Render SearchBar without error by defaultprops", () => {
  
    let wrapper;
    const store = mockStore({
      searchResultReducer: {
        autoSuggestResults:[]
        }
    })
    
    const defaultProps = {
        setSearchPropValues:jest.fn()
       };
    beforeEach(() => {
      wrapper = setup(defaultProps,store);
    });
    test("Render searchbar Component  Without Error", () => {
      const searchBar = findByTestAttr(wrapper, "searchBar");
      expect(searchBar.length).toBe(1);
    });
    
  });
  describe("Render SearchBar without error by store and prorps", () => {
  
    let wrapper;
    const store = mockStore({
      searchResultReducer: {
        autoSuggestResults:[{id:1,data:"test",contentName:"country page"},{id:2,data:"test",contentName:"country page"}]
        }
    })
    const defaultProps = {
        setSearchPropValues:jest.fn(),
        placeholder:"test",
        theme :"dark"
       };
    beforeEach(() => {
      wrapper = setup(defaultProps,store);
    });
    test("Render searchbar Component  Without Error", () => {
      const searchBar = findByTestAttr(wrapper, "searchBar");
      expect(searchBar.length).toBe(1);
    });
    test("handle searchinput Without Error", () => {
      const searchInput = findByTestAttr(wrapper, "searchInput");
      expect(searchInput.simulate('change',{target:{value:"testdata"}}).length).toBe(1);
      
      searchInput.simulate('change',{target:{value:"test"}})
      expect(searchInput.simulate('keypress',{keyCode:13}).length).toBe(1);
      const imageDiv = findByTestAttr(wrapper, "imageDiv");
      expect(imageDiv.simulate('click').length).toBe(1);
      searchInput.simulate('change',{target:{value:"test"}})
    });
    
  });

  