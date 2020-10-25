import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../../../assets/img/logo/blends.png";

class SidebarHeader extends Component {
  render() {
    return (
      <div className="navbar-header">
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item mr-auto">
            <NavLink to="/" className="navbar-brand">
              <img src={Logo} alt="Blends" style={{ width: 37, height: 30 }} />
              <h2 className="brand-text mb-0">Blends</h2>
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default SidebarHeader;
