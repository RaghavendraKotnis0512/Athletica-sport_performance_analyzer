import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const location = useLocation();
  const { selectedSports } = location.state || { selectedSports: [] };

  return (
    <div className="profile-page-container">
      <h1 className="profile-title">Your Selected Sports</h1>
      {selectedSports.length === 0 ? (
        <p className="no-sports">You haven't selected any sports yet!</p>
      ) : (
        <ul className="sports-list">
          {selectedSports.map((sport, index) => (
            <li key={index}>
              <Link to={`/sport-detail/${sport.toLowerCase()}`}>
                {/* Assuming sport.name holds the sport name */}
                <img src={`sport-detail/${sport}.jpg`} alt={sport} />
                <span>{sport}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
