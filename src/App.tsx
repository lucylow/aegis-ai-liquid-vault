import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AegisDashboard from './pages/AegisDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Routes>
          <Route path="*" element={<AegisDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 