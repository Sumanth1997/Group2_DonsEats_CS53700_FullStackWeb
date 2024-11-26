import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../services/firebaseConfig';
import './../styles/LoginForm.css';
import { AuthContext } from '../services/AuthContext'; 

const auth = getAuth(app);
const db = getFirestore(app); 

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
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;


          // Get the user's role from Firestore
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);


          if (docSnap.exists()) {
              const userData = docSnap.data();
              user.role = userData.role; // Add role to the user object
              setUser(user); // Set user in context (including role)


              // Now navigate based on the role
              if (user.role === 'restaurantOwner') {
                  navigate('/dashboard');
              } else {
                  navigate('/');
              }

          } else {
              // Handle the case where user data is not found in Firestore
              console.error("User data not found in Firestore.");
              setError("User data not found."); // Set an appropriate error
          }


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
