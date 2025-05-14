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
          <HeaderButton user={sessionUser} />
        )}
      </div>
    </nav>
  );
}


export default Navigation;