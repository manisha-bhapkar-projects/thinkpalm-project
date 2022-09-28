import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(<App />, document.getElementById("root"));
// const renderApp = () => ReactDOM.render(<App />, document.getElementById('root'));
// UserService.initKeycloak(renderApp);
// HttpService.configure();

reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
