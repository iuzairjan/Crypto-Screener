import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CryptoDetail from './components/CryptoDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CryptoList />} />
          <Route path="/crypto/:symbol" element={<CryptoDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;