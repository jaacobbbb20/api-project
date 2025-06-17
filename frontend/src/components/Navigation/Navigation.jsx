import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav>
      <ul className="navbar">
        <li>
          <NavLink to="/" className="navbar__logo">
            Housing-Site
          </NavLink>
        </li>

        <li className="navbar__right">
          {isLoaded && sessionUser && (
            <NavLink to="/spots/new" className="navbar__create-link">
              Create a New Spot
            </NavLink>
          )}
          {isLoaded && <ProfileButton user={sessionUser} />}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
