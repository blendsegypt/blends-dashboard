import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../../../assets/img/logo/BlendsSideLogo.png";

class SidebarHeader extends Component {
  render() {
    return (
      <div className="navbar-header" style={{ height: "6rem" }}>
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item mr-auto">
            <NavLink to="/" className="navbar-brand">
              <img
                src={Logo}
                alt="Blends"
                style={{
                  width: 150,
                  height: 50,
                }}
              />
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default SidebarHeader;
