import React from "react";
import { Navbar } from "reactstrap";
import { connect } from "react-redux";
import classnames from "classnames";

const UserName = (props) => {
  let username = "";
  if (props.userdata !== undefined) {
    username = props.userdata.name;
  } else if (props.user.login.values !== undefined) {
    username = props.user.login.values.name;
    if (
      props.user.login.values.loggedInWith !== undefined &&
      props.user.login.values.loggedInWith === "jwt"
    ) {
      username = props.user.login.values.loggedInUser.name;
    }
  } else {
    username = "Khalid Khalil";
  }

  return username;
};
const ThemeNavbar = (props) => {
  const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"];
  const navbarTypes = ["floating", "static", "sticky", "hidden"];
  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light":
              props.navbarColor === "default" ||
              !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) ||
              (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            scrolling: props.horizontal && props.scrolling,
          }
        )}
      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex"
              id="navbar-mobile"
              style={{ flexDirection: "column" }}
            ></div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth,
  };
};

export default connect(mapStateToProps, {})(ThemeNavbar);
