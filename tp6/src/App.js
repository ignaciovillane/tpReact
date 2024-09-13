import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaymentForm from './components/PaymentFormPage';
import CardDetailsPage from './components/CardDetailsPage';
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
