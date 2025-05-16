import { useSelector } from 'react-redux';
import HeaderButton from './HeaderButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='navbar'>
      <div className='nav-left'>
        <a href="/" className='logo'>HousingSite</a>
      </div>
      <div className='nav-right'>
        {isLoaded && (
          <a href="/spots/new" className='create-spot-link'>Create a New Spot</a>
        )}

        {isLoaded && (
          <HeaderButton user={sessionUser} />
        )}
      </div>
    </nav>
  );
}


export default Navigation;