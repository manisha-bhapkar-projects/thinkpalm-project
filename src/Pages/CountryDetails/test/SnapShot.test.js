import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findByTestAttr, checkProps } from '../../../test/testUtils';

import SnapShot from '../Snapshot'
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import React from 'react';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);
let store = mockStore({
    
})
const defaultprops = {
    snapdata:[{
        countryId: 162,
        superTopicSnapshotContent: [],
        upertopicContent: "<p>The U.S. has a progressive tax system, which means that as you move up the pay scale, you also move up the tax scale. There are seven tax brackets for most ordinary income</p>",
        supertopicContentId: "60ed566f9aa3a32e646ab012",
        supertopicId: "60ed506fbb1db26aa277def2",
        supertopicName: "Taxes",
        topics:[{
            countryId: 162,
            subTopics: [],
            topicContent: "<p>Employers and employees are required to contribute to social security. Employers contribute <span class=\"snapshot\">7,000 $ plus a percentage based on salary, and employees contribute between 3% to 10%.</span><span>&nbsp;</span></p><p>The contribution rates break down as follows:</p><ul><li><span>Employees contribute 3% towards social security</span>,<span>&nbsp;5% of the income up to 500,000 drams</span>, <span class=\"snapshot\">plus a fee of up to 1.5%</span>. This increases to 10% for income above 500,000 drams.</li><li>Employers contribute 7,000 drams a month towards social security, 15% of the employee’s income from 20,000 drams to 100,000 drams, and then 5% of the income above 100,000 drams.</li></ul>",
            topicContentId: "60ed566f9aa3a32e646ab014",
            topicId: "60ed50a3d2fe4059ca4aa884",
            topicName: "Social Security & Payroll Taxes",
            topicSnapshotContent: ['7,000 $ plus a percentage based on salary, and employees contribute between 3% to 10%.', 'plus a fee of up to 1.5%']
        },]
    },{
        countryId: 162,
        superTopicSnapshotContent: ['Birth and care of a new-born child;'],
        supertopicContent: "<p>The Family and Medical Leave Act (FMLA) provides employees with up to&nbsp;12 weeks of unpaid leave&nbsp;per year. FMLA leave is designed to help employees maintain a healthy work life balance. Common uses for an employee to use FMLA leave are:</p><ul><li><span class=\"snapshot\">Birth and care of a new-born child;</span></li><li>Adoption of a child;</li><li>Care for an immediate family member; and</li><li>Medical leave when an employee is suffering from a serious medical condition.</li></ul><p>Employees are qualified for FMLA leave once they have worked for an employer for 12 months, for at least 1,250 hours within those 12 months. The employer must also have more than 50 or more employees within a 75-mile radius.</p>",
        supertopicContentId: "60ed566e9aa3a32e646ab00e",
        supertopicId: "60ed5021d2fe4059ca4aa882",
        supertopicName: "Maternity, Paternity & Family Leave",
        topics: []
    }],
    settoSpecificsId:jest.fn(),
    searchSnapShot:true,
    snapShot:{snapShot:"snapshot"}
}
jest.mock('axios');

const setup = (historyMock) => {
    return mount(<Provider store={store}><Router history={historyMock}><SnapShot {...defaultprops} /></Router></Provider>);
}
jest.mock('@react-keycloak/web', () => ({
    useKeycloak: () => {
        return {
            keycloak: false,
            initialize: false
        }
    },
}));

describe("snapShot Component", () => {
    let wrapper;
    let useEffect
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn(),createHref:jest.fn() };
    
    beforeEach(() => {
        wrapper = setup(historyMock, defaultprops);
      
        
    });
  
    test('render snapShot without error', () => {
      
     
        
        const snapShot = findByTestAttr(wrapper, 'snapShot')
        expect(snapShot.length).toBe(1)
        const snapClick = findByTestAttr(wrapper, 'snapClick')
        expect(snapClick.simulate ('click').length).toBe(1)
        
    })
})