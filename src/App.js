import React from "react";
import Router from "./Router";
import "./components/@vuexy/rippleButton/RippleButton";
import dotenv from "dotenv";
import "react-perfect-scrollbar/dist/css/styles.css";
import "prismjs/themes/prism-tomorrow.css";
//Environmental variables handling
dotenv.config();

const App = (props) => {
  return <Router />;
};

export default App;
