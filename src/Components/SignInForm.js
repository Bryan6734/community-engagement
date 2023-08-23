import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";

function SignInForm({ isSigningIn, setIsSigningIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <div className="field">
        <p>Email</p>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field">
        <p>Password</p>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="sign-in-submit">
        <button className="submit" type="submit">
          Sign In
        </button>
        <button type="button" onClick={() => setIsSigningIn(!isSigningIn)}>
          Create an Account
        </button>
      </div>
    </form>
  );
}

export default SignInForm;
