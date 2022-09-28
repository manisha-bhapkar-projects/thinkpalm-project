import checkPropTypes from 'check-prop-types';

/**
 * Return nodes with the given data-test attribute.
 * @param {shallowWrapper} wrapper - Enzyme shallow Wrapper 
 * @param {string} val - Value of data-test attribute for search 
 * @returns {ShallowWrapper}
 */

export const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test='${val}']`);
}



export const checkProps = (component, conformingProps) => {
    const propError = checkPropTypes(
        component.propTypes,
        conformingProps,
        'prop',
        component.name
    );
    expect(propError).toBeUndefined();        
}

// if you are enabling this, you should add the declaration for that
// ReferenceError: global is not defined
// global.matchMedia = global.matchMedia || function() {
//     return {
//         matches : false,
//         addListener : function() {},
//         removeListener: function() {}
//     }
//   }