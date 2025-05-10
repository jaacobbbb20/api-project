import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { FaBars } from 'react-icons/fa';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='navbar'>
      <div className='nav-left'>
        <a href="/" className='logo'>HousingSite</a>
      </div>
      <div className='nav-right'>
        <FaBars className='hamburger-icon' />
        {isLoaded && (
          <ProfileButton user={sessionUser} />
        )}
      </div>
    </nav>
  );
}


export default Navigation;