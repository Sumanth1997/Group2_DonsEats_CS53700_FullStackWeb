import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../services/firebaseConfig'; // Import your Firebase configuration
import './../styles/SignupForm.css';


const auth = getAuth(app);
const db = getFirestore(app);

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role is 'user'
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [selectedRestaurant, setSelectedRestaurant] = useState(''); // New state for selected restaurant
    const restaurants = ["Don's at walb", "Bon Bons", "Einstein's bagels", "Javaspot"]; // Available restaurants


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // 1. Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update user profile with username
            await updateProfile(user, { displayName: username });

            // 3. Save user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
              username: username,
              role: role,
              restaurant: role === 'restaurantOwner' ? selectedRestaurant : 'student', // Conditional field
          });

            navigate('/login');


        } catch (error) {
            setError(error.message);  // Set the error message from Firebase
            console.error("Firebase signup error:", error);

        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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

        <div className="form-group">
          <label>Sign up as:</label>
          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="restaurantOwner"
                checked={role === 'restaurantOwner'}
                onChange={() => setRole('restaurantOwner')}
              />
              Restaurant Owner
            </label>
          </div>
        </div>

        {role === 'restaurantOwner' && (
                    <div className="form-group">
                        <label htmlFor="restaurant">Restaurant:</label>
                        <select
                            id="restaurant"
                            value={selectedRestaurant}
                            onChange={(e) => setSelectedRestaurant(e.target.value)}
                            required
                        >
                            <option value="">Select a restaurant</option> {/* Default option */}
                            {restaurants.map((restaurant) => (
                                <option key={restaurant} value={restaurant}>
                                    {restaurant}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

        <button type="submit">Sign Up</button>
        
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
