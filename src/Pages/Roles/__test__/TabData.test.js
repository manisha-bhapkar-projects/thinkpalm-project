import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../../test/testUtils';
import Tabdata from '../Tabdata'


const setup = (defaultProps) => {
    return shallow(<Tabdata {...defaultProps} />);
}

describe("Header Component",()=>{
    let wrapper;
    let defaultProps={
        feat_data:[{
            featureGroup: {id: 1, featureGroupName: 'Client Account Management'},
            features:[{id: 1, featureName: 'Purchase additional consulting hours', keycloakId: '20d53bec-8227-4030-b936-006c461deb98', keycloakScope: 'purchase_additional_consulting_hours'},
                        {id: 2, featureName: 'Purchase additional licenses', keycloakId: '5ab4389f-feb7-4ded-8b66-a29df67c868b', keycloakScope: 'purchase_additional_licenses'},
                    {id: 3, featureName: 'Purchase new HR templates', keycloakId: '9c7d691e-8c93-4bcd-81a5-f87fb502c01b', keycloakScope: 'purchase_new_hr_templates'},
                        {id: 4, featureName: 'Access and download previous purchases', keycloakId: '639b15ad-acf6-44de-a6d6-69d5ca1d9636', keycloakScope: 'access_and_download_previous_purchases'},
                        {id: 5, featureName: 'Assign users to open licenses', keycloakId: 'e4dbdfc0-bf0b-4966-8cd6-1a8a3bafc4ff', keycloakScope: 'assign_users_to_open_licenses'},
                        {id: 6, featureName: 'Remove users from licenses', keycloakId: 'a5d42a4d-ac59-4b58-8233-7e129a4e9ffd', keycloakScope: 'remove_users_from_licenses'},
                        {id: 7, featureName: 'Upgrade subscription level', keycloakId: '4b888470-c2a5-49d3-8277-0707bb03956c', keycloakScope: 'upgrade_subscription_level'}]
        },
    {
        featureGroup: {id: 2, featureGroupName: 'Features Access'},
        features:[{id: 12, featureName: 'EGS Documents & Guides (Country Manuals)', keycloakId: 'f4ae7f63-6eff-4110-a0b9-a75ffecae1dd', keycloakScope: 'egs_documents_&_guides_(country_manuals)'},
                    {id: 13, featureName: 'Insights & Analysis', keycloakId: 'b0720281-5293-445b-861f-3abe552f2bb2', keycloakScope: 'insights_&_analysis'},
                    {id: 14, featureName: 'Labor & Employment', keycloakId: '6044f621-fca9-4995-89a8-e4e112c0a472', keycloakScope: 'labor_&_employment'},
                    {id: 15, featureName: 'Country compare​', keycloakId: 'f8b75619-342a-4f49-9389-b59ef2bc5908', keycloakScope: 'country_compare'},
                    {id: 16, featureName: 'Access/contribute to Global HR Forum', keycloakId: '8e5ddc21-f39c-4c7b-b87c-0bfa3d2d8c2d', keycloakScope: 'access/contribute_to_global_hr_forum'},
                    {id: 17, featureName: 'Analytics page', keycloakId: '5d2c5dbe-3ef6-44b7-99f8-b427e42d711f', keycloakScope: 'analytics_page'},
                    {id: 18, featureName: 'Compliance checklist', keycloakId: '4751eb3b-3ca4-4b51-a406-e74360f1e6b8', keycloakScope: 'compliance_checklist'},
                    {id: 19, featureName: 'Employee lifecycle management​', keycloakId: 'dc0dd02d-3e79-4af5-9317-80f25de7b13e', keycloakScope: 'employee_lifecycle_management'},
                    {id: 20, featureName: 'Indicators & Trends', keycloakId: 'e5600cf4-f831-4cd0-85f2-5be8e2a00f5e', keycloakScope: 'indicators_&_trends'},
                    {id: 21, featureName: 'Personalized notifications', keycloakId: 'b56b5568-67da-4f9d-97ee-5424a73de718', keycloakScope: 'personalized_notifications'},
                    {id: 39, featureName: 'Assign to Expert', keycloakId: '56244314-9622-43d7-8e30-5637e6f21245', keycloakScope: 'assign_to_expert'},
                    {id: 40, featureName: 'Manage Query', keycloakId: '9c551da7-9a7e-4b8e-8c31-6de658d8c54e', keycloakScope: 'manage_query'}]
    }],
    data_selected:[1, 2, 5, 6, 7, 8, 9, 10, 13, 15, 14, 22, 23, 24, 25, 26, 27, 28, 29, 17, 18, 19, 16, 21, 20, 30, 31, 32, 33, 34, 35, 36, 37, 38, 3, 4, 42, 41, 12, 47, 11, 39, 40],
    box_click_fun:jest.fn()
    }
    beforeEach(() => {
        wrapper = setup(defaultProps);
    });

    test('Render Header Component  Without Error',()=>{
        const tabData=findByTestAttr(wrapper,'tabData')
        expect(tabData.length).toBe(1)
        const name=findByTestAttr(wrapper,'name')
        expect(name.first().simulate('change').length).toBe(1)
        const title=findByTestAttr(wrapper,'title')
        expect(title.first().simulate('click').length).toBe(1)
        let wrapper1=setup({})
        const listed1=findByTestAttr(wrapper1,'tabData')
       expect(listed1.length).toBe(1)
    })

})