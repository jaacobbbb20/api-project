import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupFormModal.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sessionUser) {
      closeModal();
    }
  }, [sessionUser, closeModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }

    setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup-background">
      <div className="signup-card">
        <div className="signup-content">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <label className="signup-label">
              First Name
              <input
                className="input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            {errors.firstName && <p className="error">{errors.firstName}</p>}

            <label className="signup-label">
              Last Name
              <input
                className="input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            {errors.lastName && <p className="error">{errors.lastName}</p>}

            <label className="signup-label">
              Email
              <input
                className="input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {errors.email && <p className="error">{errors.email}</p>}

            <label className="signup-label">
              Username
              <input
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            {errors.username && <p className="error">{errors.username}</p>}

            <label className="signup-label">
              Password
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && <p className="error">{errors.password}</p>}

            <label className="signup-label">
              Confirm Password
              <input
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}

            <button
              className="button"
              type="submit"
              disabled={username.length < 4 || password.length < 6}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupFormModal;
