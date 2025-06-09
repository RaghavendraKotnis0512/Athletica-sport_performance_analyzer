import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SportDetail.css";

const CONFIDENCE_THRESHOLD = 0.5;

const SportDetail = () => {
  const location = useLocation();
  const { sportName } = location.state || { sportName: "Unknown Sport" };

  const [rating, setRating] = useState(null);
  const [shotType, setShotType] = useState(null);
  const [notes, setNotes] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [notesHistory, setNotesHistory] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [aiResultMessage, setAiResultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resetResults = () => {
    setRating(null);
    setShotType(null);
    setAiResultMessage("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    resetResults();

    if (!file) return;

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert("Please upload a JPEG or PNG image.");
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
  };

  const handleFileAnalysis = async () => {
    if (!uploadedFile) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadedFile);

    setIsAnalyzing(true);
    resetResults();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/rate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      

      const data = response.data;
      const outputs = data?.result?.outputs ?? [];

      let predictions = [];

      if (outputs.length > 0) {
        predictions =
          outputs[0]?.classification_predictions?.[0]?.predictions?.predictions ?? [];

        if (predictions.length === 0) {
          predictions = outputs[0]?.detection_predictions?.predictions ?? [];
        }
      }

      if (predictions.length > 0) {
        const topPrediction = predictions.reduce((prev, curr) =>
          (parseFloat(curr.confidence) || 0) > (parseFloat(prev.confidence) || 0)
            ? curr
            : prev
        );

        const confidence = parseFloat(topPrediction.confidence) || 0;

        if (confidence >= CONFIDENCE_THRESHOLD) {
          const ratingPercent = (confidence * 100).toFixed(2);
          setRating(ratingPercent);
          setShotType(topPrediction.class || "Unknown Shot");
          setAiResultMessage(
            `Detected shot: ${topPrediction.class} with confidence: ${ratingPercent}%`
          );

          // Add to leaderboard immediately upon analysis
          const newEntry = {
            name: `Attempt ${leaderboard.length + 1}`,
            rating: Number(ratingPercent),
            shotType: topPrediction.class || "Unknown Shot",
            notes: "",
          };
          setLeaderboard([...leaderboard, newEntry]);
        } else {
          setAiResultMessage(
            "Detected object confidence too low. Try a clearer image."
          );
        }
      } else {
        setAiResultMessage("No objects detected. Try another image.");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Error: Failed to analyze image via backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNotesChange = (e) => setNotes(e.target.value);

  const handleSubmitNotes = () => {
    if (notes.trim() === "") {
      alert("Please write some notes before submitting.");
      return;
    }

    const newNote = {
      text: notes,
      timestamp: new Date().toLocaleString(),
    };

    setNotesHistory([...notesHistory, newNote]);
    setNotes("");
    setSuccessMessage("Note saved!");

    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const getSuggestion = (rating) => {
    const score = parseFloat(rating);
    if (score >= 90) return "🏅 Excellent! You're almost a pro.";
    if (score >= 75) return "💪 Great job! Keep refining your technique.";
    if (score >= 50) return "👍 Good effort! Focus on consistency.";
    if (score >= 30) return "⚠️ Fair. Improve your form and posture.";
    if (score > 0) return "🔁 Needs improvement. Practice and basics matter.";
    return "";
  };

  return (
    <div className="sport-detail-container">
      <h1 className="sport-detail-title">{sportName}</h1>

      <div className="content-container">
        <div className="upload-rating-section">
          <div className="upload-section">
            <label className="upload-label">Upload an Image of Your Performance:</label>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileUpload}
            />
            <button
              className="submit-upload"
              onClick={handleFileAnalysis}
              disabled={isAnalyzing}
            >
              Analyze Performance
            </button>
            {isAnalyzing && (
              <div className="loader">Analyzing your performance...</div>
            )}
          </div>

          <div className="rating-section">
            <label className="rating-label">AI Rating (%):</label>
            <input
              type="text"
              value={rating !== null ? rating : ""}
              readOnly
              className="rating-input"
              placeholder="N/A"
            />
          </div>

          {shotType && (
            <div className="shot-type-section">
              <label className="shot-type-label">Detected Shot Type:</label>
              <span className="shot-type-value">{shotType}</span>
            </div>
          )}

          {rating && (
            <div className="suggestion-section">
              <label className="suggestion-label">Suggestion:</label>
              <p className="suggestion-text">{getSuggestion(rating)}</p>
            </div>
          )}

          <div className="notes-section">
            <label className="notes-label">Write your notes:</label>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add your personal notes"
              className="notes-input"
            />
            <button className="submit-notes" onClick={handleSubmitNotes}>
              Submit Notes
            </button>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </div>
        </div>

        <div className="leaderboard-section">
          <h2 className="leaderboard-title">Analyzed Performances</h2>
          <ul className="leaderboard-list">
            {leaderboard.map((entry, index) => (
              <li key={index} className="leaderboard-item">
                {entry.name}: {entry.rating} ⭐ - {entry.shotType}
              </li>
            ))}
          </ul>
        </div>

        <div className="notes-history-section">
          <h2 className="notes-history-title">Your Notes</h2>
          <ul className="notes-history-list">
            {notesHistory.map((note, index) => (
              <li key={index} className="notes-history-item">
                {note.timestamp}: {note.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="performance-insights">
        <h2 className="performance-title">Performance Insights</h2>
        {leaderboard.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={leaderboard}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rating" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>
            Your performance over time will be shown here. Upload and analyze some performances first.
          </p>
        )}
      </div>
    </div>
  );
};

export default SportDetail;
