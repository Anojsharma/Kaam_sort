import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="loading-screen-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
      <h2 className="loading-message">{message}</h2>
    </div>
  );
};

export default LoadingScreen;
