import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/styles/main.css";
import {
  FaHome,
  FaTicketAlt,
  FaBuilding,
  FaCalendarAlt,
  FaUsers,
  FaHandMiddleFinger,
  FaHistory,
} from "react-icons/fa";

const Header = () => {
  return (
    <>
      <div className="header">
        {/*<h1 style={{ left: "20%", color: "white" }}>PolyPlace</h1>*/}
        <nav>
          <div className="nav-elements">
            <ul>
              <li>
                <a
                  className="logo"
                  style={{
                    left: "20%",
                    color: "white",
                    padding: "18.5px 16px",
                    backgroundColor: "#c93135",
                    boxShadow:
                      "0px 0px 0px 0px rgba(0, 0, 0, 0.5), inset 0px -3px 1px -2px rgba(0, 0, 0, 0.3)",
                    fontSize: "30px",
                    fontWeight: "900",
                  }}
                >
                  Polyplace
                </a>
              </li>
              <li>
                <a className="home" href="/">
                  <div
                    style={{
                      verticalAlign: "middle",
                      display: "inline-flex",
                      paddingRight: "4px",
                    }}
                  >
                    <FaHome />
                  </div>
                  Home
                </a>
              </li>
              <li>
                <a class="reservations" href="/buildings">
                  <div
                    style={{
                      verticalAlign: "middle",
                      display: "inline-flex",
                      paddingRight: "4px",
                    }}
                  >
                    <FaCalendarAlt />
                  </div>
                  Reservations
                </a>
              </li>
              <li>
                <a className="staff" href="/rooms">
                  <div
                    style={{
                      verticalAlign: "middle",
                      display: "inline-flex",
                      paddingRight: "4px",
                    }}
                  >
                    <FaUsers />
                  </div>
                  Staff
                </a>
              </li>
              <li>
                <a className="history" href="/history">
                  <div
                    style={{
                      verticalAlign: "middle",
                      display: "inline-flex",
                      paddingRight: "4px",
                    }}
                  >
                    <FaHistory />
                  </div>
                  History
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};
export default Header;
