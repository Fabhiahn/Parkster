// src/components/LoginPage.js
import React, { useState } from "react";
import './LoginPage.css'; 

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");  

    const handleLogin = () => {
        if (username && password) {
          // Call Flask login endpoint
          fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Login successful:", data);
              // Redirect or handle success
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                    // Redirect to the table page
                    window.location.href = '/table';
    
                }
            })
            .catch((error) => console.error("Error logging in:", error));
        } else {
          alert("Please fill in all fields.");
        }
      };

      const handleSignUp = () => {
        if (username && password && email) {
          fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email }),
          })
            .then((response) => response.json())
            .then((data) => {
                console.log("Signup successful:", data);
                window.location.href = '/';
            })
            .catch((error) => console.error("Error signing up:", error));
        } else {
          alert("Please fill in all fields.");
        }
      };
      return (
        <div className="container">
          <div className="form">
            <h1 className="title">Welcome to Parkster, an app to help you find parking spots in Amsterdam</h1>
            
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            {isSignUp && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            )}
            
            <div className="button-container">
              <button onClick={handleLogin} className="button">
                Login
              </button>
              <button onClick={() => setIsSignUp(!isSignUp)} className="button">
                {isSignUp ? "Cancel" : "Sign Up"}
              </button>
                {/* Sign-Up button (only visible in Sign-Up mode) */}
                {isSignUp && (
                    <button onClick={handleSignUp} className="button">
                    Submit Sign Up
                    </button>
                )}
            </div>
          </div>
        </div>
      );
    };
export default LoginPage;
