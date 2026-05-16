import React, { useState, useEffect } from 'react';
import './NetworkErrorBoundary.css';

const NetworkErrorBoundary = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="network-error-container">
        <div className="network-error-card">
          <div className="offline-icon">🌐</div>
          <h2>You're Offline</h2>
          <p>Please check your internet connection.</p>
          <p className="sub-text">We'll automatically reconnect when your network is back.</p>
          <div className="pulse-loader">
            <div></div><div></div><div></div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default NetworkErrorBoundary;
