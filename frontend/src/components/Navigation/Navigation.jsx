import { useSelector } from "react-redux";
import HeaderButton from "./HeaderButton";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">

      <div className="nav-left">
        <NavLink to='/' className="logo">
          HousingSite
        </NavLink>
      </div>

      <div className="nav-right">
        {isLoaded && sessionUser && (
          <NavLink to="/spots/new" className="create-spot-link">
            Create a New Spot
          </NavLink>
        )}
        {isLoaded && <HeaderButton user={sessionUser} />}
      </div>
    </nav>
  );
}

export default Navigation;
