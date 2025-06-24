import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import SelectSports from './components/Select/SelectSports';
import Profile from './components/Profile/Profile';
import SportDetail from './components/SportDetail/SportDetail';
import EditProfile from './components/EditProfile/EditProfile';

function App() {
  // Initialize selectedSports state
  const [selectedSports, setSelectedSports] = useState([]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/select-sports" 
            element={<SelectSports setSelectedSports={setSelectedSports} />} 
          /> 
          <Route 
            path="/profile" 
            element={<Profile selectedSports={selectedSports} />} 
          />
          <Route 
            path="/sport-detail/:sportId" 
            element={<SportDetail />} 
          />
          <Route path="/edit-profile" element={<EditProfile />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
