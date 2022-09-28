import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import SearchHeaderText from './SearchHeaderText'
import { Router } from 'react-router';
const setup = (props,) => {
   
    return shallow(<SearchHeaderText {...props}/>);
}

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
  }));

describe("SearchHeaderText Component",()=>{
    let wrapper;
    const defaultProps = {
        breadcrumb:true,
       };
      // const  = { push: jest.fn(), location: {}, listen: jest.fn() };
    beforeEach(() => {
        wrapper = setup(defaultProps,);
    });
    test('render searchHeader component without error',()=>{
        const header=findByTestAttr(wrapper,'header')
        const userClick=findByTestAttr(wrapper,'userClick')
        expect(userClick.simulate('click').length).toBe(1)
        expect(header.length).toBe(1)
    })
})
describe("SearchHeaderText Component with props",()=>{
    let wrapper;
    const defaultProps = {
        breadcrumb:true,
        
       };
      // const  = { push: jest.fn(), location: {}, listen: jest.fn() };
    beforeEach(() => {
        wrapper = setup(defaultProps,);
    });
    test('render searchHeader component without error with userlist',()=>{
        let wrapper1=setup({...defaultProps,userlistBreadcrumb:true},)
        const breadcrumb=findByTestAttr(wrapper1,'breadcrumb')
        expect(breadcrumb.length).toBe(1)
        const userlistBreadcrumb=findByTestAttr(wrapper1,'userlistBreadcrumb')
        expect(userlistBreadcrumb.length).toBe(1)
    })
    test('render searchHeader component without error with myAccount',()=>{
        let wrapper1=setup({...defaultProps,userlistBreadcrumb:false,myAccount:true,showSettings:true},)
        const myAccount=findByTestAttr(wrapper1,'myAccount')
        expect(myAccount.length).toBe(1)
    })
    test('render searchHeader component without error with favotiteCountries',()=>{
        let wrapper1=setup({...defaultProps,myAccount:false,favotiteCountries:true,titleHeader:true},)
        const favotiteCountries=findByTestAttr(wrapper1,'favotiteCountries')
        expect(favotiteCountries.length).toBe(1)
        const title=findByTestAttr(wrapper1,'title')
        expect(title.length).toBe(1)
    })
    test('render searchHeader component without error with addCountry',()=>{
        let wrapper1=setup({...defaultProps,myAccount:false,favotiteCountries:false,
            titleHeader:true,isArchive:false,addCountry:true},)
        const addCountry=findByTestAttr(wrapper1,'addCountry')
        const addClick=findByTestAttr(wrapper1,'addClick')
        expect(addCountry.length).toBe(1)
        expect(addClick.simulate('click').length).toBe(1)
        const title=findByTestAttr(wrapper1,'title')
        expect(title.length).toBe(1)
    })
    test('render searchHeader component without error with isArchive',()=>{
        let wrapper1=setup({...defaultProps,myAccount:false,
            favotiteCountries:false,titleHeader:true,isArchive:true,handleClickBack:jest.fn()},)
        const isArchive=findByTestAttr(wrapper1,'isArchive')
        const isArchiveClick=findByTestAttr(wrapper1,'isArchiveClick')
        expect(isArchive.length).toBe(1)
        expect(isArchiveClick.simulate('click').length).toBe(1)
        const title=findByTestAttr(wrapper1,'title')
        expect(title.length).toBe(1)
    })
    test('render searchHeader component without error with manageUsersAddEdit',()=>{
        let wrapper1=setup({...defaultProps,titleHeader:true,isArchive:false,manageUsersAddEdit:true,isEdit:true},)
        let wrapper2=setup({...defaultProps,titleHeader:true,isArchive:false,manageUsersAddEdit:true,isEdit:false},)
        const manageUsersAddEdit=findByTestAttr(wrapper1,'manageUsersAddEdit')
        const manageUsersAddEdit1=findByTestAttr(wrapper2,'manageUsersAddEdit')
        const managClick=findByTestAttr(wrapper1,'managClick')
        expect(manageUsersAddEdit.length).toBe(1)
        expect(manageUsersAddEdit1.length).toBe(1)
        expect(managClick.simulate('click').length).toBe(1)
        const title=findByTestAttr(wrapper1,'title')
        expect(title.length).toBe(1)
    })
    test('render searchHeader component without error with accountPage',()=>{
        let wrapper1=setup({...defaultProps,isArchive:false,accountPage:true},)
        const accountPage=findByTestAttr(wrapper1,'accountPage')
        expect(accountPage.length).toBe(1)
        const accPageClick=findByTestAttr(wrapper1,'accPageClick')
        expect(accPageClick.simulate('click').length).toBe(1)
        let wrapper2=setup({...defaultProps,isArchive:false,accountPage:true,title :"Edit",gotoView:jest.fn()},)
        let wrapper3=setup({...defaultProps,isArchive:false,accountPage:true,title :"Add"},)
        const accPageClick1=findByTestAttr(wrapper2,'accPageClick')
        expect(accPageClick1.simulate('click').length).toBe(1)
        const accPageClick2=findByTestAttr(wrapper3,'accPageClick')
        expect(accPageClick2.simulate('click').length).toBe(1)
    })
    test('render searchHeader component without error with HRTemplateBreadcrumb',()=>{
        let wrapper1=setup({...defaultProps,isArchive:false,HRTemplateBreadcrumb:true,handleClickBack:jest.fn()})
        const HRTemplateBreadcrumb=findByTestAttr(wrapper1,'HRTemplateBreadcrumb')
        const hrClick=findByTestAttr(wrapper1,'hrClick')
        expect(hrClick.length).toBe(1)
        expect(HRTemplateBreadcrumb.simulate('click').length).toBe(1)
       
    })
    test('render searchHeader component without error with HrTemplateHeader',()=>{
        let wrapper1=setup({...defaultProps,HrTemplateHeader:true,handleClickBack:jest.fn(),titleHeader:false})
        let wrapper2=setup({...defaultProps,HrTemplateHeader:true,titleHeader:false,pageTitle:"Add User",backToAccounts:true})
        let wrapper3=setup({...defaultProps,HrTemplateHeader:true,titleHeader:false,pageTitle:"Edit User"})
        const HrTemplateHeader=findByTestAttr(wrapper1,'HrTemplateHeader')
        const HrTemplateHeaderClick=findByTestAttr(wrapper1,'HrTemplateHeaderClick')
        const HrTemplateHeaderClick1=findByTestAttr(wrapper2,'HrTemplateHeaderClick')
        const HrTemplateHeaderClick2=findByTestAttr(wrapper3,'HrTemplateHeaderClick')
        expect(HrTemplateHeader.length).toBe(1)
        expect(HrTemplateHeaderClick.simulate('click').length).toBe(1)
        expect(HrTemplateHeaderClick1.simulate('click').length).toBe(1)
        expect(HrTemplateHeaderClick2.simulate('click').length).toBe(1)
       
    })
    test('render searchHeader component without error with accountUsers',()=>{
        let wrapper1=setup({...defaultProps,isArchive:false,accountUsers:true,onTextChange:jest.fn(),setSearchValue:jest.fn(),searchValue:"test"})
        const search=findByTestAttr(wrapper1,'search')
        const searchDiv=findByTestAttr(wrapper1,'searchDiv')
        expect(searchDiv.simulate('click').length).toBe(1)
        expect(search.simulate('change').length).toBe(1)
       
    })

    test('render searchHeader component without error with addQuery',()=>{
        let wrapper1=setup({...defaultProps,myAccount:false,favotiteCountries:false,
            titleHeader:true,isArchive:false,AddQuery:true},)
        const addQuery=findByTestAttr(wrapper1,'addQuery')
        expect(addQuery.length).toBe(1)
        const addClick=findByTestAttr(wrapper1,'addClick')
        expect(addClick.simulate('click').length).toBe(1)
       
    })
    
    
})