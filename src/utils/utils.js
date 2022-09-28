import { getKeyClockToken_Data, getUserProfile } from './storage';
import jwt_decode from 'jwt-decode';
import moment from "moment";

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const stripHtml_fun = (a) => {
  let stripedHtml = a?.replace(/<[^>]+>|&nbsp/g, '');
  return stripedHtml;
};

export const stripInlineStyles = (a) => {
  let stripedHtml = a?.replace(
    /style=('.*?')|(".*")|(\\".*\\")|(\\'.*\\')/gi,
    ''
  );
  return stripedHtml;
};

export const RestrictNumber = (value) => {
  let isInvalid = false;
  if (value == 1 || value == 2 || value == 3 || value == 4 || value == 5) {
    isInvalid = true;
  }
  return isInvalid;
};

export const limitNumber = (e, length) => {
  let isInvalid = false;
  const input = e.target.value;
  if (input.length > length) {
    isInvalid = true;
  }
  return isInvalid;
};

export const normalizePrice = (value) => {
  if (!value) {
    return '';
  }

  value = value.toString();

  if (value === '' || value.replace(/[^\d]/g, '').length < 1) {
    return '';
  }

  const onlyNums = value.replace(/[^\d]/g, '');
  return '$' + onlyNums;
};
const getOptions = (List, value, label) => {
  return List.map((item) => {
    return {
      value: item[value],
      label: item[label],
      ...item,
    };
  });
};
export const generateOptions = (list, value, label) => {
  return Object.keys(list).length !== 0 ? getOptions(list, value, label) : [];
};

export const getSelectedOption = (id, list) => {
  return (
    list?.length &&
    list.filter((item) => {
      if (item.value === id) return item;
      else return false;
    })
  );
};

export const permissionMapping = (testCaseOptional) => {
  const dev = testCaseOptional || false;
  if (dev) {
    // Enable dev variable true, to get all page access
    return [
      'purchase_additional_consulting_hours',
      'ask_an_expert_questionnaire',
      'purchase_new_hr_templates',
      'create/edit_any_user',
      'create/edit/delete_roles',
      'view_user_listing_page',
      'labor_&_employment',
      'employee_lifecycle_management',
      'compliance_checklist',
      'indicators_&_trends',
      'insights_&_analysis',
      'access_&_contribute_to_hr_professional_community_membership',
      'view_countries_listing_page',
      'add/edit_countries_from_listing_page',
      'manage_subscription_packages',
      'view_subscription_listing_page',
      'view_subscription_details_page',
      'set_subscription_prices',
      'access_to_all_country_pages',
      'view_role_listing_page',
      'favoriting_countries',
      'manage_query',
      'assign_to_expert',
      'view_query_management_page',
      'view_my_account_queries',
      'internal_user_forum_moderator',
      'internal_user_forum_admin',
      'egs_user_forum_moderator',
      'egs_user_forum_admin',
      'internal_forum_member',
      'egs_forum_member',
      'adding_employee_counts/types_to_favorited_countries',
      'submit_query',
      'view_my_account_queries',
      'internal_user_forum_moderator',
      'internal_user_forum_admin',
      'egs_user_forum_moderator',
      'egs_user_forum_admin'
    ];
  }
  const token_data = getKeyClockToken_Data();
  const userData = token_data ? jwt_decode(token_data) : undefined;
  // debugger;
  const scopeArray = userData?.scope?.split(' ');
  return scopeArray && scopeArray.length > 0 ? scopeArray : [];
};
export const textCharacterValidation = (e) => {
  const code = 'charCode' in e ? e.charCode : e.keyCode;
  if (
    // !(code === 46) && // dot
    // !(code === 45) && // hyphen
    // !(code > 47 && code < 58) // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)
  ) {
    // lower alpha (a-z)
    e.preventDefault();
  }
};
export const textAndNumberValidation = (e) => {
  const code = 'charCode' in e ? e.charCode : e.keyCode;
  if (
    // !(code === 46) && // dot
    // !(code === 45) && // hyphen
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123) &&
    code != 32 && // space
    code != 38 && //&
    code != 35 && //#
    code != 36 && //$
    code != 64 && //@
    code != 156 && //
    code != 190 && //
    code != 46 && // dot
    code != 44 && // comma
    code != 58 && // colon
    code != 59 && // semi-colon
    code != 45 // semi-colon
  ) {
    // lower alpha (a-z)
    e.preventDefault();
  }
};

export const AllowTextAndNumberOnlyValidation = (e) => {
  const code = 'charCode' in e ? e.charCode : e.keyCode;
  if (
    !(code == 32) && // space
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)
  ) {
    // lower alpha (a-z)
    e.preventDefault();
  }
};
export const downloadFile = (fileUrl, filename) => {
  const element = document.createElement("a");
  if (typeof element.download !== "undefined") {
    // browser support download attribute

    // element.setAttribute('href', 'http://192.168.2.237:3000/' + relativeUrl);
    element.setAttribute("href", fileUrl);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
  } else {
    // browser not support download attribute

    window.location.assign(
      window.location.href.split(window.location.hash)[0] + fileUrl
    );
  }
  document.body.removeChild(element);
};
export const userDetailsMixpnel = () => {
  const userProfile = getUserProfile()
  return {
    'User Name': `${userProfile?.firstName} ${userProfile?.lastName}`,
    'User Id': userProfile?.userId,
    'Account Reg Date': moment(userProfile?.createdAt).format("MMM DD, YYYY")
  }

}

export const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}