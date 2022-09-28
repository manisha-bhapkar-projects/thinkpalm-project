const envVariables = {
    development: {
        apiUrl: "https://saas-qa.expandopedia.com/qa/",
        keycloakUrl: "https://saas-qa.expandopedia.com/auth"
    },
    testing: {
        apiUrl: "https://saas-qa.expandopedia.com/qa/",
        keycloakUrl: "https://saas-qa.expandopedia.com/auth"

    },
    staging: {
        apiUrl: "https://saas-qa.expandopedia.com/qa/",
        keycloakUrl: "https://saas-qa.expandopedia.com/auth"

    },
    production: {
        apiUrl: "https://saas-qa.expandopedia.com/qa/",
        keycloakUrl: "https://saas-qa.expandopedia.com/auth"

    }
}

const commonConfig = {
    // variables common to all environments
}

const ENV = process.env.REACT_APP_ENV || "development"

export default {
    ...envVariables[ENV],
    ...commonConfig
}