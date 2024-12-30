import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ParkingTable from './components/TablePage'; 


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/table" element={<ParkingTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
