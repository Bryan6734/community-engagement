import { auth, db } from "../config/firebase";
import { getDoc, updateDoc, doc, collection } from "firebase/firestore";

export const addEventToUser = async (eventId) => {
  if (!auth.currentUser) {
    throw new Error("You must be logged in to sign up for an event.");
  }

  const userId = auth.currentUser.uid.toString();

  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  const volunteerHistory = userDoc.data().volunteer_history || [];

  const volunteerHistoryEntry = {
    event_id: eventId,
    joined_at: new Date(),
    left_at: null,
    absences: 0,
  };

  volunteerHistory.push(volunteerHistoryEntry);

  const updateResult = await updateDoc(userRef, {
    volunteer_history: volunteerHistory,
  });

  return updateResult;
};

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
  }
};

export const removeUserFromEvent = async (userId, eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);
    const volunteers = eventDoc.data().volunteers || {};

    const newVolunteers = {};

    Object.keys(volunteers).forEach((key) => {
      const volunteerId = volunteers[key];
      if (volunteerId !== userId) {
        newVolunteers[key] = volunteerId;
      } else {
        console.log("removed user in loop");
      }
    });

    const updateResult = await updateDoc(eventRef, {
      volunteers: newVolunteers,
    });
    console.log(updateResult)
  } catch (error) {
    alert("Failed to update event. Please try again.");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const volunteerHistory = userDoc.data().volunteer_history || [];

    const newVolunteerHistory = volunteerHistory.map((entry) => {
      if (entry.event_id === eventId) {
        entry.left_at = new Date();
      }
      return entry;
    });

    const updateResult = await updateDoc(userRef, {
      volunteer_history: newVolunteerHistory,
    });
    console.log(updateResult)
  } catch (error) {
    console.log(error);
    alert("Failed to update user.");
  }
};
