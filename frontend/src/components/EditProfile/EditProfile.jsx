// src/components/EditProfile/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./EditProfile.css";

const sportsList = ["Tennis", "Cricket"]; // Add more if needed

const EditProfile = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchSports = async () => {
      if (!user) return navigate("/");

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelected(docSnap.data().selectedSports || []);
      }
    };
    fetchSports();
  }, [navigate, user]);

  const handleToggle = (sport) => {
    setSelected((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), { selectedSports: selected }, { merge: true });
    navigate("/profile");
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Sports Preferences</h2>
      <ul className="sports-select-list">
        {sportsList.map((sport) => (
          <li key={sport}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(sport)}
                onChange={() => handleToggle(sport)}
              />
              {sport}
            </label>
          </li>
        ))}
      </ul>
      <button className="save-button" onClick={handleSave}>Save Preferences</button>
    </div>
  );
};

export default EditProfile;
