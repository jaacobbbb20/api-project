import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="nav">
      <div className="nav__left">
        <NavLink to="/" className="nav__logo">
          Housing-Site
        </NavLink>
      </div>

      <div className="nav__right">
        {isLoaded && (
          <div className="nav__menu">
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;