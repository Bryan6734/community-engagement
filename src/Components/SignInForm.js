import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider, db, storage } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

function SignInForm( {isSigningIn, setIsSigningIn} ) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    // sign in with email and password

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <div className="field">
        <p>Email</p>
        <input
          type="text"
          id='email'
          placeholder="stanley_mustang24@milton.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field">
        <p>Password</p>
        <input
          type="password"
          id='password'
          placeholder="ilovecommunityengagement123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="sign-in-submit">
        <button className='submit' type="submit">Sign In</button>
        <button type='button' onClick={() => setIsSigningIn(!isSigningIn)}>Create an Account</button>
      </div>
    </form>
  );
}

export default SignInForm;
