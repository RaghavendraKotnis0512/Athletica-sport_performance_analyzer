import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectSports.css";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.js"; // Make sure this points to your initialized Firestore instance

const sports = [
  { id: 3, name: "Tennis", image: "/assets/tennis-raketki-myach-sport-104657.jpeg" },
  { id: 4, name: "Cricket", image: "/assets/sports-cricket-313281.jpeg" },
  // Add more as needed
];

const SelectSports = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const navigate = useNavigate();

  // Load from localStorage (optional)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selectedSports"));
    if (saved) setSelectedSports(saved);
  }, []);

  // Save to localStorage (optional)
  useEffect(() => {
    localStorage.setItem("selectedSports", JSON.stringify(selectedSports));
  }, [selectedSports]);

  const handleSportClick = (sportName) => {
    setSelectedSports((prev) =>
      prev.includes(sportName)
        ? prev.filter((name) => name !== sportName)
        : [...prev, sportName]
    );
  };

  const handleContinue = async () => {
    if (selectedSports.length === 0) {
      alert("Please select at least one sport to continue.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in.");
      return;
    }

    try {
      // Update Firestore with selected sports
      await setDoc(doc(db, "users", user.uid), {
        selectedSports,
      }, { merge: true });

      navigate("/profile", { state: { selectedSports } });
    } catch (error) {
      console.error("Error saving sports:", error);
      alert("Something went wrong while saving your preferences.");
    }
  };

  return (
    <div className="select-sports-container">
      <h1 className="sports-title">Select Your Favorite Sports</h1>
      <div className="sports-grid">
        {sports.map((sport) => (
          <div
            key={sport.id}
            role="button"
            tabIndex="0"
            className={`sport-card ${selectedSports.includes(sport.name) ? "selected" : ""}`}
            onClick={() => handleSportClick(sport.name)}
            onKeyDown={(e) => e.key === "Enter" && handleSportClick(sport.name)}
          >
            <img src={sport.image} alt={sport.name} className="sport-image" />
            <div className="sport-name">{sport.name}</div>
            {selectedSports.includes(sport.name) && (
              <div className="tick-mark">✔</div>
            )}
          </div>
        ))}
      </div>
      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default SelectSports;
