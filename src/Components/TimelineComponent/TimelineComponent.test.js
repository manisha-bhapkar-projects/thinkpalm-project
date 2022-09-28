import { mount, shallow } from 'enzyme';
import BasicTimeline from './TimelineComponent';
import Store from "../../Store"
import Timeline from "@material-ui/lab/Timeline";
import { Provider } from 'react-redux';
import TimelineItem from '@material-ui/lab/TimelineItem';
//   const mockStore = configureMockStore({red});
//  const store = mockStore();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
      pathname: "localhost:3000/example/path"
    })
  }));
const setup = () => {
    return mount(<Provider store={Store}><BasicTimeline   /></Provider>);
}

describe("TimeLine Component",()=>{
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    test('Render TimeLine Component  Without Error',()=>{
        
        expect(wrapper.find(Timeline)).toHaveLength(1)
    })
    test('Render TimelineItem className',()=>{
        expect(wrapper.find(TimelineItem).first().hasClass('Custom-lineItem')).toBeTruthy();
    })
})