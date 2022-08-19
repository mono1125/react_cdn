import React from "react";
import ReactDOM from "react-dom/client";
import "./bulma.min.css";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { CurrentSettings } from "./components/CurrentSettings";
import { Footer } from "./components/Footer";
import * as serviceWorker from "./serviceWorker";

// 参考: https://zenn.dev/nawomat/articles/f8be31b66bfc19
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Header />
    <Form />
    <CurrentSettings />
    <Footer />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
