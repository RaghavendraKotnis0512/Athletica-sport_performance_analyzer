import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./SelectSports.css";

const sports = [
  { id: 1, name: "Football", image: "src/assets/jason-charters-IorqsMssQH0-unsplash.jpg" },
  { id: 2, name: "Basketball", image: "src/assets/markus-spiske-BfphcCvhl6E-unsplash.jpg" },
  { id: 3, name: "Tennis", image: "src/assets/tennis-raketki-myach-sport-104657.jpeg" },
  { id: 4, name: "Cricket", image: "src/assets/sports-cricket-313281.jpeg" },
  { id: 5, name: "Swimming", image: "src/assets/sports-swimming-551152.jpeg" },
  { id: 6, name: "Running", image: "src/assets/pexels-pixabay-34514.jpg" },
  // Add more sports
];

const SelectSports = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const navigate = useNavigate();  // Use navigate hook here

  const handleSportClick = (sportName) => {
    if (selectedSports.includes(sportName)) {
      setSelectedSports(selectedSports.filter((name) => name !== sportName));
    } else {
      setSelectedSports([...selectedSports, sportName]);
    }
  };

  const handleContinue = () => {
    if (selectedSports.length > 0) {
      // Pass selected sports to Profile page using navigate state
      navigate("/profile", { state: { selectedSports } });
    } else {
      alert("Please select at least one sport to continue.");
    }
  };

  return (
    <div className="select-sports-container">
      <h1 className="sports-title">Select Your Favorite Sports</h1>
      <div className="sports-grid">
        {sports.map((sport) => (
          <div
            key={sport.id}
            className={`sport-card ${selectedSports.includes(sport.name) ? "selected" : ""}`}
            onClick={() => handleSportClick(sport.name)}
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
