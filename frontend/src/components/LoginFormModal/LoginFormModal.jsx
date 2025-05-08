import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Log In</div>
        <div className="underline"></div>
      </div>

      <form onSubmit={handleSubmit} className="inputs">
        {Object.values(errors).map((error, idx) => (
          <p className='error' key={idx}>{error}</p>
        ))}

        <label>
          Username or Email
          <input 
            type="text" 
            value={credential} 
            onChange={(e) => setCredential(e.target.value)} 
            required 
          />
        </label>

        <label>
          Password
          <input 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </label>

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;