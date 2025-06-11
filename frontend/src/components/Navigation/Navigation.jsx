import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as sessionActions from "../../store/session"; // Make sure this path is correct
import { FaBars, FaUserCircle } from "react-icons/fa";
import "./Navigation.css";
import { useState } from "react";

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className="logo">
          Housing-site
        </NavLink>
      </div>
      <div className="nav-right">
        <button className="hamburger-icon">
          <FaBars />
        </button>

        <div className="profile-wrapper">
          <button className="profile-icon" onClick={toggleMenu}>
            <FaUserCircle />
          </button>

          {isLoaded && showMenu && (
            <ul className="dropdown-menu">
              {sessionUser ? (
                <>
                  <li className="dropdown-text">{sessionUser.username}</li>
                  <li className="dropdown-text">
                    {sessionUser.firstName} {sessionUser.lastName}
                  </li>
                  <li className="dropdown-text">{sessionUser.email}</li>
                  <li>
                    <button
                      className="dropdown-link"
                      onClick={() => {
                        setShowMenu(false);
                        dispatch(sessionActions.logout());
                      }}
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className="dropdown-link"
                      onClick={() => setShowMenu(false)}
                    >
                      Log In
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className="dropdown-link"
                      onClick={() => setShowMenu(false)}
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
