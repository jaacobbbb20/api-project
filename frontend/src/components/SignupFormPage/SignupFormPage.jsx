import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import '../SignupFormPage/SignupForm.css'

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState({});
  const [username, setUsername] = useState({});
  const [firstName, setFirstName] = useState({});
  const [lastName, setLastName] = useState({});
  const [password, setPassword] = useState({});
  const [confirmPassword, setConfirmPassword] = useState({});
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

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
          password
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "The passwords do not match"
    });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <label>
            Email
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          {errors.email && <p className="error-message">{errors.email}</p>}

          <label>
            Username
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          {errors.username && <p className="error-message">{errors.username}</p>}

          <label>
            First Name
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </label>
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}

          <label>
            Last Name
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </label>
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}

          <label>
            Password
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {errors.password && <p className="error-message">{errors.password}</p>}

          <label>
            Confirm Password
            <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;