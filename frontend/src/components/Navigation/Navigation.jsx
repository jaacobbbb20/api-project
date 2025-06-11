import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

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
          {isLoaded && sessionUser && <ProfileButton user={sessionUser} />}

          {isLoaded && !sessionUser && (
            <ul className="dropdown-menu">
              <li>
                <NavLink to="/login" className="dropdown-link">
                  Log In
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="dropdown-link">
                  Sign Up
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
