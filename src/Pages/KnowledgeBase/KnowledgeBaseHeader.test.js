import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../../test/testUtils';
import KnowledgeBaseHeader from './KnowledgeBaseHeader';


const setup = (props) => {
    return shallow(<KnowledgeBaseHeader {...props} />);
}

describe("knowledgebase header Component",()=>{
    let wrapper;
    const defaultProps={
       param:{data:"test"},
        className:"hrader"
    }
    beforeEach(() => {
        wrapper = setup(defaultProps);
    });

    test('Render knowledgebase header Component  Without Error',()=>{
        const knowledge=findByTestAttr(wrapper,'knowledge')
        expect(knowledge.length).toBe(1)
       
    })
    test('Render knowledgebase header Component  With bannerheader',()=>{
        
        let wrapper1 = setup({...defaultProps,bannerHeader:true})
        const knowledge1=findByTestAttr(wrapper1,'knowledge')
        expect(knowledge1.length).toBe(1)
        
    })
    test('Render knowledgebase header Component  With docshop',()=>{
        let wrapper2 = setup({...defaultProps,doc_shop:true})
        const knowledge2=findByTestAttr(wrapper2,'knowledge')
        expect(knowledge2.length).toBe(1)
    })
    test('Render knowledgebase header Component  With insight',()=>{
        let wrapper3 = setup({...defaultProps,insight:true})
        const knowledge3=findByTestAttr(wrapper3,'knowledge')
        expect(knowledge3.length).toBe(1)
    })
})