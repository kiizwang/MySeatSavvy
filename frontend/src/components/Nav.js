import React from 'react';
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <div className="nav">
        <div className="logo">
          <h1 className="logo-seat">Seat</h1>
          <h1 className="logo-savvy">Savvy</h1>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" exact activeClassName="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav