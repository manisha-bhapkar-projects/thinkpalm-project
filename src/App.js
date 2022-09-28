
// import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./assets/css/main.css";
import "./assets/css/login.css";
import "react-notifications/lib/notifications.css";
import "./assets/scss/bootstrap-grid.scss";
import "./assets/scss/bootstrap-reboot.scss";
import "./assets/scss/bootstrap.scss";
// import "./assets/scss/custome.scss";
import "./assets/scss/searchResult.scss";
import "./assets/scss/responsive.scss";
import "./assets/scss/main.scss";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { NotificationContainer } from "react-notifications";
import NotificationWrapper from "./utils/commonNotifications";
import { createBrowserHistory } from "history";
import Router from "./Router";
import store from "./Store";
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from "./keycloak";

const eventLogger = (event, error) => {
	console.log("keycloak event>>", event);
}

const tokenLogger = (tokens) => {
	console.log('onKeycloakTokens', tokens)
	if (tokens) {


	}
}
const options = {
	onLoad: 'check-sso',
	// redirectUri: window.location.origin + '/login',
	pkceMethod: 'S256',
}

function App() {
	// console.log("process", keycloak)

	return (
		<ReactKeycloakProvider
			authClient={keycloak}
			initOptions={options}
			onEvent={eventLogger}
			onTokens={tokenLogger}
		>
			<Provider store={store}>
				<NotificationWrapper>
					<Router />
				</NotificationWrapper>

			</Provider>
		</ReactKeycloakProvider>
	);
}

export default App;