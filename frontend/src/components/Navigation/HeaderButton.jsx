import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./HeaderButton.css";

function HeaderButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (!menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(sessionActions.logout());
    setShowMenu(false);
    navigate("/");
  };

  const handleManageSpots = () => {
    setShowMenu(false);
    navigate("/spots/current");
  };

  return (
    <div className="profile-button-wrapper">
      <div className="header-buttons">
        <FaBars className="hamburger-icon" onClick={toggleMenu} />
        <FaUserCircle className="profile-icon" onClick={toggleMenu} />
      </div>

      {showMenu && (
        <ul className="profile-dropdown" ref={menuRef}>
          {user ? (
            <>
              <li className="greeting">Hello, {user.username}</li>
              <li className="email">{user.email}</li>
              <hr />
              <li>
                <button className="menu-button" onClick={handleManageSpots}>
                  Manage Spots
                </button>
              </li>
              <hr />
              <li>
                <button className="menu-button" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <OpenModalMenuItem
                  itemText="Sign Up"
                  modalComponent={<SignupFormModal />}
                  className="menu-button"
                />
              </li>
              <li>
                <OpenModalMenuItem
                  itemText="Log In"
                  modalComponent={<LoginFormModal />}
                  className="menu-button"
                />
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default HeaderButton;