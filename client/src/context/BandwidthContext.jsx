import React, { createContext, useContext, useState, useEffect } from 'react';

const BandwidthContext = createContext();

export const BandwidthProvider = ({ children }) => {
  const [isLowBandwidth, setIsLowBandwidthState] = useState(() => {
    const saved = localStorage.getItem('isLowBandwidth');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const toggleLowBandwidth = () => {
    setIsLowBandwidthState((prev) => {
      const nextState = !prev;
      localStorage.setItem('isLowBandwidth', JSON.stringify(nextState));
      return nextState;
    });
  };

  const setLowBandwidth = (val) => {
    setIsLowBandwidthState(val);
    localStorage.setItem('isLowBandwidth', JSON.stringify(val));
  };

  return (
    <BandwidthContext.Provider value={{ isLowBandwidth, toggleLowBandwidth, setLowBandwidth }}>
      {children}
    </BandwidthContext.Provider>
  );
};

export const useBandwidth = () => {
  const context = useContext(BandwidthContext);
  if (!context) {
    throw new Error('useBandwidth must be used within a BandwidthProvider');
  }
  return context;
};
