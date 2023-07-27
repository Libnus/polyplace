import React from "react";
import { useContext } from "react";
import "../../assets/styles/main.css";
import UserSession from '../../UserSession';
import { FaHome, FaCalendarAlt, FaUsers, FaHistory } from "react-icons/fa";

const Header = () => {
    const user = useContext(UserSession);

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
                    href="page.hmtl"
                    style={{
                      left: "20%",
                      color: "white",
                      padding: "18.5px 16px",
                      backgroundColor: "#c93135",
                      boxShadow:
                        "0px 0px 0px 0px rgba(0, 0, 0, 0.5), inset 0px -3px 1px -2px rgba(0, 0, 0, 0.3)",
                      fontSize: "30px",
                      fontWeight: "900",
                      pointerEvents: "none",
                      cursor: "default",
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
                {user.checkRoles(['admin', 'staff']) && <li>
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
                </li>}
                {user.checkRoles(['admin', 'staff']) && <li>
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
                </li>}
              </ul>
            </div>
          </nav>
        </div>
      </>
    );
};
export default Header;
