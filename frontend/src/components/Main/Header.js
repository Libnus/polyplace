import React from "react";
import {NavLink} from 'react-router-dom';
import "../../assets/styles/main.css";

const Header = () => {
  return (
    <div className="header">
      <h1 style={{ left: "20%", color: "white" }}>PolyPlace</h1>

      <nav>
        <div className="nav-elements">
          <ul>
            <li> <a href="/">Home</a></li>
            <li><a href="/buildings">Reservations</a></li>
            <li><a href="/rooms">Staff</a></li>
            <li><a href="/history">History</a></li>
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default Header;
