import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginFormModal.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isDisabled = credential.length < 4 || password.length < 6;

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

  const handleDemoLogin = () => {
    dispatch(
      sessionActions.login({
        credential: "Demo-lition",
        password: "password",
      })
    ).then(closeModal);
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <div className="login-content">
          <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
            <label className="user-email-card">
              Username or Email
              <input
                className="input"
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
            <label className="user-password-card">
              Password
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.credential && (
              <p className="error-text">{errors.credential}</p>
            )}
            <button className="button" type="submit" disabled={isDisabled}>
              Log In
            </button>
          </form>
          <button className="demo-button" onClick={handleDemoLogin}>
            Demo User
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginFormModal;
