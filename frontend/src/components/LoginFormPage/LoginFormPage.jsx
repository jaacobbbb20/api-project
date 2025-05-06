import { useState } from "react";
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import './LoginForm.css';

const LoginFormPage = () => {
	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user);
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});

	if (sessionUser) return <Navigate to='/' replace={true} />;

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});
		return dispatch(sessionActions.login({ credential, password })).catch(
			async (res) => {
				const data = await res.json();
				if (data?.errors) setErrors(data.errors);
			}
		);
	};

	const isDisabled = credential.length < 4 || password.length < 6;

	return (
		<div className='container'>
			<div className='header'>
				<div className='text'>Log In</div>
				<div className='underline'></div>
			</div>

			<form onSubmit={handleSubmit}>
				<div className='inputs'>
					<div className="input">
						<label>
							Username or Email
							<input
								type="text"
								value={credential}
								onChange={(e) => setCredential(e.target.value)}
								required
							/>
						</label>
					</div>

					<div className="input">
						<label>
							Password
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</label>
					</div>
				</div>

				{errors.credential && <p className="error-message">{errors.credential}</p>}

				<button type="submit" disabled={isDisabled}>Log In</button>

				<button 
					type="demouser"
					onClick={() =>
						dispatch(sessionActions.login({
							credential: 'Demo-lition',
							password: 'password'
						}))
					}
				>
					Continue as a Guest
				</button>
			</form>
		</div>
	);
};

export default LoginFormPage;
