import Keycloak from 'keycloak-js';
import config from "../src/Config/index"

const keyCloakUrl = config.keycloakUrl;


// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
    "realm": "expandopedia",
    "url": keyCloakUrl,
    "ssl-required": "external",
    "resource": "expandopedia-client",
    "public-client": true,
    "verify-token-audience": true,
    "confidential-port": 0,
    "clientId": "expandopedia-client"
});

export default keycloak;
