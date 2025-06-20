# 🏅 Athletica - Sport Performance Analyzer

*Analyze your sports performance with AI-powered image recognition!*


## 🚀 Project Overview

**Athletica** – Sport Performance Analyzer is a cutting-edge web application designed to help athletes and sports enthusiasts track, analyze, and improve their performance using AI-powered insights.

This full-stack application enables users to upload images of their sports activities — specifically for Tennis and Cricket — and get instant AI-driven ratings and feedback based on the detected shot types and performance metrics. Athletica offers a user-friendly interface with interactive visualizations such as performance charts, detailed shot classifications, and personalized note-taking features to help users track their progress over time.


## How It Works

1. **Sport Selection:** Users select one or more sports they want to analyze from the interactive selection page.
2. **Image Upload:** On the sport-specific page, users upload an image showcasing their sports performance (e.g., a tennis shot or cricket stroke).
3. **AI Analysis:** The backend receives the image and sport type, sends it to the AI model for analysis, and returns detailed predictions about the shot type and performance rating.
4. **Results Display:** The frontend displays the AI rating, detected shot type, and suggestions based on confidence scores.
5. **Leaderboard Tracking:** Each analyzed attempt is saved locally and shown on a leaderboard chart to track improvement over time.
6. **Notes:** Users can add personal notes for each performance to track thoughts, feelings, or tips.
7. **Performance Insights:** Dynamic graphs visually represent the user’s progress, motivating consistent improvement.
---

## ✨ Key Features

- **AI-Powered Image Analysis:** Upload images and get shot type classification with confidence scores.
- **Multi-Sport Support:** Currently supports Tennis & Cricket with planned expansion.
- **Interactive Leaderboard:** Track your performance attempts with ratings.
- **Notes & Insights:** Add personal notes for each session, view historic notes.
- **Beautiful UI:** Responsive React frontend with performance graphs using Recharts.
- **Seamless Backend:** Express.js server handling image uploads and AI integration.

---

## 🛠 Tech Stack

| Frontend                   | Backend                     | Others                 |
|----------------------------|-----------------------------|------------------------|
| React                      | Node.js & Express           | Axios                  |
| React Router DOM           | Multer (File Uploads)       | Recharts (Graphs)      |
| CSS (Custom Styling)       | AI Model Integration (via API) | Git & GitHub           |

---

## 🎯 Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/RaghavendraKotnis0512/Athletica-sport_performance_analyzer.git
cd Athletica-sport_performance_analyzer

# Install backend dependencies and start backend server
cd backend
npm install
npm start

# Open a new terminal, install frontend dependencies and start frontend
cd ../frontend
npm install
npm start
