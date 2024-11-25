import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import app from '../services/firebaseConfig';
import './../styles/LoginForm.css';
import { AuthContext } from '../services/AuthContext'; 

const auth = getAuth(app);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);


        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password); // Get user credential
          setUser(userCredential.user) // set user in the context
          setTimeout(() => navigate('/'), 500);// Or wherever you want to redirect on success
        } catch (error) {
            setError(error.message); // Use the actual Firebase error message
            console.error("Firebase login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="login-container">
        {/* Conditionally render login/signup or user's name */}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
