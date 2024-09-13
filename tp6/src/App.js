import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaymentForm from './PaymentForm';
import CardDetailsPage from './CardDetailsPage';
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentForm />} />
        <Route path="/card-details" element={<CardDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
