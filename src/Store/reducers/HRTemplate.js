import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { format } from "lodash";
import fetchClient from "../../utils/axiosConfig";
import constants from "../../utils/constants";
import { notifyAction } from "./notification";

export const getAllTemplates = createAsyncThunk(
  "HrTemplateReducer/getAllTemplates",
  async (payload = {}, reduxInfo) => {

    let API_URL = `${constants.API.HR_TEMPLATE.GET_ALL_TEMPLATES}`;
    const bodyParam = {
      "showDeleted": false,
      "showInactive": true
    };

    if (payload.category && payload.category.length > 0) {
      bodyParam.categoryIds = payload.category.join(",");
    }

    if (payload.language && payload.language.length > 0) {
      bodyParam.languageIds = payload.language.join(",");
    }

    if (payload.pageNumber && payload.pageNumber != '') {
      bodyParam.page = payload.pageNumber;
    }

    if (payload.pageSize && payload.pageSize != '') {
      bodyParam.pageSize = payload.pageSize;
    }

    if (payload.sortBy && payload.sortBy != '') {
      bodyParam.sortBy = payload.sortBy;
      bodyParam.sortBydesc = payload.sort;
    }

    if (payload.searchText) {
      bodyParam.searchText = payload.searchText;
    }

    let res = await fetchClient
      .get(API_URL, {
        params: { ...bodyParam },
      })
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);


// for archive list
export const getAllArchives = createAsyncThunk(
  "HrTemplateReducer/getAllArchives",
  async (payload = {}, reduxInfo) => {

    let API_URL = `${constants.API.HR_TEMPLATE.GET_ALL_TEMPLATES}`;
    const bodyParam = {
      "showDeleted": false,
      "showInactive": true
    };

    if (payload.category && payload.category.length > 0) {
      bodyParam.categoryIds = payload.category.join(",");
    }

    if (payload.language && payload.language.length > 0) {
      bodyParam.languageIds = payload.language.join(",");
    }

    if (payload.pageNumber && payload.pageNumber != '') {
      bodyParam.page = payload.pageNumber;
    }

    if (payload.pageSize && payload.pageSize != '') {
      bodyParam.pageSize = payload.pageSize;
    }

    if (payload.sortBy && payload.sortBy != '') {
      bodyParam.sortBy = payload.sortBy;
      bodyParam.sortBydesc = payload.sort;
    }

    if (payload.searchText) {
      bodyParam.searchText = payload.searchText;
    }

    let res = await fetchClient
      .post(API_URL, bodyParam)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);

export const callPurchasedDocumentList = createAsyncThunk(
  "HRTemplate/callPurchasedDocumentList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_ALL_PURCHASED_DOCUMENT_LIST}`)
      .then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);
export const getTemplateDetails = createAsyncThunk(
  "HRTemplate/getTemplateDetails",
  async (payload = {}) => {
    console.log("payload", payload)
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_TEMPLATE}${payload}`)
      .then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);


export const getPurchaseList = createAsyncThunk(
  "HRTemplate/getPurchaseList",
  async (payload = {}) => {
    let params = {
      page: payload.page,
      pageSize: payload.pageSize,
      sortby: payload.sortField,
      sortbydesc: payload.sortOrder,
      countryIds: payload.countryIds?.map((x) => x).join(","),
      categoryIds: payload.categorIds?.map((x) => x).join(","),
    };

    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_PURCHASE_LIST}`, {
        params: params
      })
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);

export const getAllDocumentList = createAsyncThunk(
  "HRTemplate/getAllDocumentList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_ALL_DOCUMENT_LIST}`, {
        params: {
          page: payload.page,
          pageSize: payload.pageSize,
          sortby: "countrythentitle",
          languageIds: payload.languageIds?.map((x) => x).join(","),
          countryIds: payload.countryIds?.map((x) => x).join(","),
          categoryIds: payload.categorIds?.map((x) => x).join(","),
          skipPagination: payload.skipPagination,
          sortBydesc: false,
          searchterm: payload.searchterm
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const getOrderPreview = createAsyncThunk(
  "HRTemplate/getOrderPreview",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.ORDER_PREVIEW}${payload.userId}`)
      .then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);
export const getAllStates = createAsyncThunk(
  "HRTemplate/getAllStates",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.STATE.GET_STATE_LIST}${payload.countryId}`)
      .then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);

export const ReviewOrder = async (payload) => {
  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.ORDER_PREVIEW}`, payload)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      return err?.response?.data
    });
  return res;
}

export const checkoutCart = async (data) => {
  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.CHECKOUT_CART}`, data)
    .then((res) => res.data)
    .catch((err) => {
      return err?.response?.data
    });
  return res;
};

export const callSaveCardForFutureUse =
  async (data) => {
    let res = await fetchClient
      .post(`${constants.API.HR_TEMPLATE.SAVE_CREDIT_CARD}`, data)
      .then((res) => res.data)
      .catch(console.error);
    return res ? res : false;
  }

export const getSavedCards = createAsyncThunk(
  "HRTemplate/getSavedCards",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_SAVED_CREDIT_CARD}${payload.userId}`)
      .then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);

export const callDeleteSavedCard =
  async (payload) => {
    let res = await fetchClient
      .delete(`${constants.API.HR_TEMPLATE.DELETE_SAVED_CARD}`, {
        data: payload
      })
      .then((res) => res.data)
      .catch(console.error);
    return res ? res : false;
  }


export const savedCardPayementApi = async (data) => {
  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.PAYMENT_SAVED_CARD}`, data)
    .then((res) => res.data)
    .catch((err) => {
      return err?.response?.data
    });
  return res;
};
export const sendEmailToUserAfterPaymentAPI = async (data) => {
  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.EMAIL_PURCHASE_DETAILS}`, data)
    .then((res) => res.data)
    .catch((err) => {
      return err?.response?.data
    });
  return res;
};

export const downloadSuccessfulInvoice = async (data) => {
  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.DOWNLOAD_INVOICE_HR_TEMPLATE}`, data,
      {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      }
    )
    .then((res) => res.data)
    .catch(console.error);
  return res ? res : false;
};

export const paymentAPI = async (data) => {

  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.PAYMENT_API}`, data)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      return err?.response?.data
    });
  return res;
};
export const paymentFailedAPI = async (data) => {
  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.PAYMENT_FAILED_API}`, null, {
      params: {
        cartId: data.cartId,
        reason: data.reason,
      }
    })
    .then((res) => res.data)
    .catch(console.error);
  return res ? res : false;
};



export const getLanguageList = createAsyncThunk(
  "HRTemplate/getLanguageList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_LANGUAGE_LIST}`, {
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  });

export const addAndUpdateTemplate = async (payload, id) => {
  let res = {};
  if (id) {
    res = await fetchClient
      .put(`${constants.API.HR_TEMPLATE.UPDATE_TEMPLATE}`, { ...payload })
      .then((res) => res.data)
      .catch((error) => {
        return {
          status: error?.response.status,
          data: error?.response?.data?.errors?.join(","),
          statusText: error?.response.statusText,
          error: true
        };
      });
  } else {
    res = await fetchClient
      .post(`${constants.API.HR_TEMPLATE.ADD_NEW_TEMPLATE}`, { ...payload })
      .then((res) => res.data)
      .catch((error) => {
        return {
          status: error?.response.status,
          data: error?.response?.data?.errors?.join(","),
          statusText: error?.response.statusText,
          error: true
        };
      });
  }

  return res;
};

export const getTemplateById = createAsyncThunk(
  "HrTemplateReducer/getTemplateById",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.ADD_NEW_TEMPLATE}${payload.id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);

export const addNewDocument = createAsyncThunk(
  "HrTemplateReducer/addNewDocument",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .post(`${constants.API.HR_TEMPLATE}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);

export const updateDocument = createAsyncThunk(
  "HrTemplateReducer/updateDocument",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .put(`${constants.API.HR_TEMPLATE.UPDATE_TEMPLATE}${payload.id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);

export const updateDocumentStatus = createAsyncThunk(
  "HrTemplateReducer/updateDocumentStatus",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .put(`${constants.API.HR_TEMPLATE.DEACTIVATE_TEMPLATE.replace("{id}", payload.id)}${payload.status}`)
      .then((res) => {
        if (payload.status) {
          reduxInfo.dispatch(
            notifyAction({ message: "document Activated Successfully" })
          );
        } else {
          reduxInfo.dispatch(
            notifyAction({ message: "document Deactivated Successfully" })
          );
        }
        return res.data;
      })
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);

export const getAllCategoriesList = createAsyncThunk(
  "HrTemplateReducer/getAllCategoriesList",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_ALL_DOCUMENTS}?skipPagination=true`)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);

export const getAllLanguages = createAsyncThunk(
  "HrTemplateReducer/getAllLanguages",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_ALL_LANGUAGE}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        }
      });
    return res;
  }
);

export const addNewLanguage = createAsyncThunk(
  "HrTemplateReducer/addNewLanguage",
  async (payload = {}, reduxInfo) => {
    // { 
    //   Language_Name : {mandatory :language name :string} 
    //   Language_Code :  {optional :  language  code:string} 
    //   Is_Active :       {optional : Boolean: default true}
    //   Order_Id :     {optional: int} 
    // }
    let res = await fetchClient
      .post(`${constants.API.HR_TEMPLATE.ADD_NEW_LANGUAGE}`, {
        Language_Name: payload.name
      })
      .then((res) => res.data)
      .catch((error) => {
        console.log('addNewLanguage', error)
        if (error?.response?.data?.errors?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.errors[0] })
          );
        } else {
          return {
            status: error?.response.status,
            data: error?.response?.data?.errors?.join(","),
            statusText: error?.response.statusText,
            error: true
          };
        }
      });
    return res;
  }
);

export const addNewTemplateType = async (payload) => {
  let res = await fetchClient
    .post(`${constants.API.HR_TEMPLATE.ADD_NEW_TEMPLATE_TYPE}`, {
      isActive: true,
      isDeleted: false,
      categoryName: payload.name,
      description: '',
      orderId: 0,
      parentCategoryId: null
    })
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response.statusText,
        error: true
      };
    });

  return res;
}

export const deleteDocument = async (id) => {
  let res = await fetchClient
    .delete(`${constants.API.HR_TEMPLATE.DELETE_TEMPLATE + id}`)
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response.statusText,
        error: true
      };
    });

  return res;
}

export const addToArchiveDocument = async (id) => {
  let res = await fetchClient
    .put(`${constants.API.HR_TEMPLATE.ADD_TO_ARCHIVES}${id}`)
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response.statusText,
        error: true
      };
    });

  return res;
}

export const getCartDetails = createAsyncThunk(
  "HrTemplateReducer/getCartDetails",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_CART_DETAILS}${payload.userId}`)
      .then((res) => res.data)
      .catch((err) => {
        return err?.response?.data
      });
    return res;
  }
);

export const getCategoryList = createAsyncThunk(
  "HrTemplateReducer/getCategoryList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_ALL_CATEGORY_LIST}`, {
        params: {
          skipPagination: true,
        },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getCountryList = createAsyncThunk(
  "HrTemplateReducer/getCountryList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_ALL_COUNTRIES}`)
      .then((res) => res.data)
      .catch(console.error); // implement a common error handler
    return res;
  }
);

export const addToCartAPI = createAsyncThunk(
  "HRTemplate/addToCartAPI",
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    }
    else {
      let res = await fetchClient
        .post(`${constants.API.HR_TEMPLATE.ADD_TO_CART}`,
          {
            // Product: {
            //   id: payload.id,
            //   ProductType: "document"
            // }
            ProductId: payload?.id,
            ProductType: "document"
          })
        .then((res) => res.data)
        .catch((error) => {
          if (error?.response?.data?.errors?.length > 0) {
            return reduxInfo.dispatch(
              notifyAction({ message: error?.response?.data?.errors[0] })
            );
          }
        });
      return res;
    }
  }

);

export const deleteCartItem = createAsyncThunk(
  "HRTemplate/deleteCartItem",
  async (payload = {}) => {
    if (payload.success) {
      return false;
    }
    else {
      let res = await fetchClient
        .delete(`${constants.API.HR_TEMPLATE.DELETE_CART_ITEM}${payload.id}`, {
        })
        .then((res) => res.data)
        .catch(console.error);
      return res;
    }
  }
);

// export const askQuestionPOPUpAPI1 = createAsyncThunk(
//   "HRTemplate/askQuestionPOPUpAPI",
//   async (payload = {}, reduxInfo) => {
//     if(payload.success){
//       return false;
//     }
//     else{
//       let res = await fetchClient
//       .post(`${constants.API.HR_TEMPLATE.ASK_QUESTION_POP_UP}`,payload) 
//       .then((res) => res.data)
//       .catch((error) => {
//         if (error?.response?.data?.errors?.length > 0) {
//           return reduxInfo.dispatch(
//             notifyAction({ message: error?.response?.data?.message })
//           );
//         }
//       });
//     return res;
//   }
//     }

// );
export const askQuestionPOPUpAPI = async (data, reduxInfo) => {

  let res = fetchClient
    .post(`${constants.API.HR_TEMPLATE.ASK_QUESTION_POP_UP}`, data)
    .then((res) => res.data)
    .catch((error) => {

    });

  return res ? res : false;
};

export const getPreviewPOPupDetails = createAsyncThunk(
  "HrTemplateReducer/getPreviewPOPupDetails",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_PREVIEW_DETAILS}${payload.previewFileId}`, {
        params: {
          // previewFileId : payload.previewFileId,
          showPreview: true
        }
      }
      )
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

const HRTemplate = createSlice({
  name: "HrTemplateReducer",
  initialState: {
    templatesList: [],
    templatesListCount: 0,
    templatesListLoading: false,
    /** for archive */
    archiveList: [],
    archiveListCount: 0,
    archiveListLoading: false,
    /**end */
    categoriesList: [],
    categoriesListLoading: false,
    languageList: [],
    countryListLoading: false,
    countryList: [],
    languageLoading: true,
    updateDocument: false,
    updateDocumentLoading: false,
    addNewDocumentStatus: true,
    _updateDocumentStatus: null,
    updateDocumentStatusLoading: false,
    addNewLanguageStatus: false,
    addNewLanguageLoading: false,
    addToArchivesStatus: false,
    addToArchivesLoading: false,
    getTemplateInfo: false,
    getTemplateInfoLoading: false,
    documentList: [],
    cartDetails: {},
    itemId: [],
    orderPreview: {},
    languageList: [],
    categoryList: [],
    checkoutCart: [],
    payment: [],
    cartSuccess: false,
    deleteCartSuccess: false,
    paymentSuccessfull: "",
    cartData: [],
    purListLoading: false
  },
  reducers: {

  },
  reducers: {},
  extraReducers: {
    [getAllTemplates.pending]: (state, action) => {
      state.templatesListLoading = true;
      state.templatesListCount = 0;
      state.templatesList = [];
    },
    [getAllTemplates.fulfilled]: (state, action) => {
      state.templatesListLoading = false;
      state.templatesListCount = action.payload?.data?.totalCount || 0;
      state.templatesList = action.payload?.data?.data || [];
    },
    /** for archive */
    [getAllArchives.pending]: (state, action) => {
      state.archiveListLoading = true;
      state.archiveListCount = 0;
      state.archiveList = [];
    },
    [getAllArchives.fulfilled]: (state, action) => {
      state.archiveListLoading = false;
      state.archiveListCount = action.payload?.data?.totalCount || 0;
      state.archiveList = action.payload?.data?.data || [];
    },
    [getTemplateById.pending]: (state, action) => {
      state.getTemplateInfoLoading = true;
      state.getTemplateInfo = false;
    },
    [getTemplateById.fulfilled]: (state, action) => {
      state.getTemplateInfoLoading = false;
      state.getTemplateInfo = action.payload?.data || false;
    },
    [getCountryList.pending]: (state, action) => {
      state.countryListLoading = true;
      state.countryList = [];
    },
    [getCountryList.fulfilled]: (state, action) => {
      state.countryListLoading = false;
      state.countryList = action.payload?.data || [];
    },
    [addNewDocument.pending]: (state, action) => {
      state.addNewDocumentStatus = false;
      state.addNewDocumentLoading = true;
    },
    [addNewDocument.fulfilled]: (state, action) => {
      state.addNewDocumentStatus = true;
      state.addNewDocumentLoading = false;
    },
    [updateDocument.pending]: (state, action) => {
      state.updateDocument = false;
      state.updateDocumentLoading = true;
    },
    [updateDocument.fulfilled]: (state, action) => {
      state.updateDocument = true;
      state.updateDocumentLoading = false;
    },
    [updateDocumentStatus.pending]: (state, action) => {
      state.updateDocumentStatusLoading = true;
      state._updateDocumentStatus = false;
    },
    [updateDocumentStatus.fulfilled]: (state, action) => {
      state.updateDocumentStatusLoading = false;
      state._updateDocumentStatus = true;
    },
    [getAllCategoriesList.pending]: (state, action) => {
      state.categoriesListLoading = true;
      state.categoriesList = [];
    },
    [getAllCategoriesList.fulfilled]: (state, action) => {
      state.categoriesList = action.payload?.data?.data || [];
      state.categoriesListLoading = false;
    },
    [getAllLanguages.pending]: (state, action) => {
      state.languageList = [];
      state.addNewLanguageStatus = false;
      state.addNewLanguageLoading = false;
      state.languageLoading = true;
    },
    [getAllLanguages.fulfilled]: (state, action) => {
      state.languageList = action.payload?.data || [];
      state.languageLoading = false;
    },
    [addNewLanguage.pending]: (state, action) => {
      state.addNewLanguageStatus = false;
      state.addNewLanguageLoading = true;
    },
    [addNewLanguage.fulfilled]: (state, action) => {
      state.addNewLanguageStatus = action.payload;
      state.addNewLanguageLoading = false;
    },
    [getOrderPreview.fulfilled]: (state, action) => {
      state.orderPreview = action.payload?.data || [];
    },
    [getAllDocumentList.pending]: (state, action) => {
      state.docListLoading = true;
    },
    [getAllDocumentList.fulfilled]: (state, action) => {
      state.docListLoading = false;
      state.documentList = action.payload?.data || [];
    },
    [getTemplateDetails.pending]: (state, action) => {
      state.templateDetailsLoading = true;
    },
    [getTemplateDetails.fulfilled]: (state, action) => {
      state.templateDetailsLoading = false;
      state.templateDetails = action.payload?.data || [];
    },
    [callPurchasedDocumentList.pending]: (state, action) => {
      state.purListLoading = true;
    },
    [callPurchasedDocumentList.fulfilled]: (state, action) => {
      state.purListLoading = false;
      state.userDocumentList = action.payload?.data || [];
      // state.purchasedocumentList = [];
    },
    [getCartDetails.pending]: (state, action) => {
      state.cartListLoading = true;
    },
    [getCartDetails.fulfilled]: (state, action) => {
      state.cartListLoading = false;
      let productId = []
      let countryId = []
      state.cartDetails = action.payload?.data || [];
      action.payload?.data?.items.forEach((e) => {
        countryId.push(e?.docProduct?.document.countryId);
        productId.push(e?.docProduct?.id)
      })
      state.countryId = countryId || []
      state.itemId = productId || []
    },
    [getLanguageList.fulfilled]: (state, action) => {
      state.languageList = action.payload?.data || [];
    },
    [getCategoryList.fulfilled]: (state, action) => {
      state.categoryList = action.payload?.data || [];
    },
    [checkoutCart.fulfilled]: (state, action) => {
      state.checkoutCart = action.payload?.data || [];
    },
    [paymentAPI.pending]: (state, action) => {
      state.paymentLoading = true
    },
    [paymentAPI.fulfilled]: (state, action) => {
      state.payment = action.payload?.data || [];
      state.paymentSuccessfull = action.payload?.message || "Failed Transaction";
    },
    [addToCartAPI.pending]: (state, action) => {
      state.cartSuccess = false;
    },
    [addToCartAPI.fulfilled]: (state, action) => {
      state.cartSuccess = action?.payload?.responseCode || undefined;
      state.cartData = action.payload?.data || [];
    },
    [deleteCartItem.pending]: (state, action) => {
      state.deleteCartSuccess = false;
    },
    [deleteCartItem.fulfilled]: (state, action) => {
      state.deleteCartSuccess = action?.payload?.responseCode || undefined;
      state.deleteCart = action.payload?.data || [];
    },
    [askQuestionPOPUpAPI.fulfilled]: (state, action) => {
      state.askQuestionRes = action.payload?.data || [];
    },
    [getPreviewPOPupDetails.fulfilled]: (state, action) => {
      state.previewData = action.payload?.data || [];
    },
    [getPurchaseList.pending]: (state, action) => {
      state.purchaseListLoading = true
    },

    [getPurchaseList.fulfilled]: (state, action) => {
      state.purchaseList = action?.payload?.data || [];
      state.purchaseListLoading = false
    },
    [getSavedCards.pending]: (state, action) => {
      state.savedCardLoading = true
      state.savedCard = [];
    },
    [getSavedCards.fulfilled]: (state, action) => {
      // state.savedCard = action?.payload?.data || [];
      state.savedCard = action?.payload?.data || [];
      state.savedCardLoading = false
    },
    [getAllStates.pending]: (state, action) => {
      state.stateLoading = true
      state.states = [];
    },
    [getAllStates.fulfilled]: (state, action) => {
      // state.savedCard = action?.payload?.data || [];
      state.states = action?.payload?.data || [];
      state.stateLoading = false
    },




  },
});

function download(arrayBuffer, type) {
  var blob = new Blob([arrayBuffer], { type: type });
  var url = URL.createObjectURL(blob);
  window.open(url);
}
export default HRTemplate.reducer;
