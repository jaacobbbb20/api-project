import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaBars } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const ulClassName = `profile-dropdown${showMenu ? "" : " hidden"}`;

  return (
    <div className="profile-wrapper">
      <button className="nav__menu-toggle" onClick={toggleMenu}>
        <FaBars />
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={dropdownRef}>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </div>
  );
}

export default ProfileButton;
