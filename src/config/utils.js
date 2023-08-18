import { signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { auth, googleProvider, db, storage } from "../config/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export const addUserToEvent = async (eventId) => {
  if (!auth.currentUser) {
    throw new Error("You must be logged in to sign up for an event.");
  }

  const userId = auth.currentUser.uid.toString();

  // // Gets the event doc with the eventId
  const eventRef = doc(db, "events", eventId);
  const eventDoc = await getDoc(eventRef);
  const volunteers = eventDoc.data().volunteers || {};

  // check if user is logged in

  if (Object.values(volunteers).includes(userId)) {
    throw new Error("You are already signed up for this event.");
  } else if (
    Object.keys(volunteers).length >= parseInt(eventDoc.data().max_volunteers)
  ) {
    throw new Error(
      "This event is already full." + eventDoc.data().max_volunteers
    );
  } else {
    volunteers[auth.currentUser.displayName.toString()] = userId;
    const updateResult = await updateDoc(eventRef, {
      volunteers: volunteers,
    });

    return updateResult;
  }
};
