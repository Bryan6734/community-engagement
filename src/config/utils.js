import { auth, db } from "../config/firebase";
import { getDoc, updateDoc, doc, collection } from "firebase/firestore";

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
    const userRef = doc(collection(db, "users"), auth.currentUser?.uid);

    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    const fullName = userData.first_name + " " + userData.last_name;

    volunteers[fullName] = userId;

    const updateResult = await updateDoc(eventRef, {
      volunteers: volunteers,
    });

    return updateResult;

    // volunteers[auth.currentUser.displayName.toString()] = userId;
    // const updateResult = await updateDoc(eventRef, {
    //   volunteers: volunteers,
    // });

    // return updateResult;
  }
};
