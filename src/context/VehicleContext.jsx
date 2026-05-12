import React, { createContext, useContext, useState, useEffect } from 'react';

const VehicleContext = createContext();

export const useVehicle = () => {
  return useContext(VehicleContext);
};

export const VehicleProvider = ({ children }) => {
  const [activeVehicle, setActiveVehicle] = useState(() => {
    const saved = localStorage.getItem('boxbox_vehicle');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeVehicle) {
      localStorage.setItem('boxbox_vehicle', JSON.stringify(activeVehicle));
    } else {
      localStorage.removeItem('boxbox_vehicle');
    }
  }, [activeVehicle]);

  const clearVehicle = () => {
    setActiveVehicle(null);
  };

  return (
    <VehicleContext.Provider value={{ activeVehicle, setActiveVehicle, clearVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};
