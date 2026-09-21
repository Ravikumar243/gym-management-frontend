import { render } from "preact";

import "./index.css";

import { App } from "./app.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Provider } from "react-redux";

import { store } from "./redux/store";


render(

  <Provider store={store}>

    <App />

  </Provider>,

  document.getElementById("app")

);