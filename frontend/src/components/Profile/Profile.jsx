// src/components/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import "./Profile.css";

const Profile = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSelectedSports(docSnap.data().selectedSports || []);
          setUserData({
            email: user.email,
            displayName: user.displayName || docSnap.data().username,
            photoURL: user.photoURL,
            lastLogin: user.metadata.lastSignInTime,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    signOut(getAuth()).then(() => navigate("/"));
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <img
          src={userData?.photoURL || "/assets/default-avatar.png"}
          alt="Profile"
          className="profile-avatar"
        />
        <div>
          <h1 className="profile-title">Welcome, {userData?.displayName || "Athlete"} 👋</h1>
          <p className="profile-subtext">Email: {userData?.email}</p>
          <p className="profile-subtext">Last Login: {userData?.lastLogin}</p>
        </div>
      </div>

      <h2 className="profile-subheading">Your Selected Sports:</h2>

      {selectedSports.length === 0 ? (
        <p className="no-sports">You haven't selected any sports yet!</p>
      ) : (
        <ul className="sports-list">
          {selectedSports.map((sport, index) => (
            <li key={index} className="sport-card">
              <Link to={`/sport-detail/${sport.toLowerCase()}`}>
                <img src={`/assets/${sport.toLowerCase()}.jpg`} alt={sport} />
                <span>{sport}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="profile-actions">
        <button className="edit-button" onClick={() => navigate("/edit-profile")}>Edit Preferences</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
