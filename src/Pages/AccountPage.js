import React, { useState, useEffect } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, db, storage } from "../config/firebase";
import "./AccountPage.css";
import SignUpForm from "../Components/SignUpForm";
import SignInForm from "../Components/SignInForm";
import Profile from "../Components/Profile";

const SignInButtons = () => {
  const [isSigningIn, setIsSigningIn] = useState(true);

  const displaySignInForm = () => {
    return (
      <>
        <SignInForm isSigningIn={isSigningIn} setIsSigningIn={setIsSigningIn} />
      </>
    );
  };

  const displaySignUpForm = () => {
    return (
      <>
        <SignUpForm isSigningIn={isSigningIn} setIsSigningIn={setIsSigningIn} />
      </>
    );
  };

  return <>{isSigningIn ? displaySignInForm() : displaySignUpForm()}</>;
};

function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [user]);

  return (
    <div className="AccountPage">
      <div className="page-content">
        <div className="block">
          <hr />
          <h1>My Account</h1>
        </div>

        <div className="block">{user ? <Profile /> : <SignInButtons />}</div>
      </div>
    </div>
  );
}

export default AccountPage;
