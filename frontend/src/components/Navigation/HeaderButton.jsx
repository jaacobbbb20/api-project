import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { FaBars } from 'react-icons/fa';
import './HeaderButton.css'
import { useNavigate } from 'react-router-dom';

function HeaderButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const closeMenu = (e) => {
    if (!ulRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const handleManageSpots = () => {
    setShowMenu(false);
    navigate('/spots/current');
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='profile-button-wrapper'>
      <div className='header-buttons'>
        <FaBars 
          className='hamburger-icon' 
          onClick={toggleMenu}
        />
        <FaUserCircle
          className='profile-icon'
          onClick={toggleMenu}
        />
      </div>
      {showMenu && (
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <li className='greeting'>Hello, {user.username}</li>
              <li className='email'>{user.email}</li>
              <hr />
              <li>
                <button className='manage-spots-button' onClick={handleManageSpots}>
                  Manage Spots
                </button>
              </li>
              <hr />
              <li>
                <button className="logout-button" onClick={logout}>
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
                />
              </li>
              <li>
                <OpenModalMenuItem
                  itemText="Log In"
                  modalComponent={<LoginFormModal />}
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