import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import { ToastProvider } from './context/ToastContext';
import { VehicleProvider } from './context/VehicleContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <FilterProvider>
            <VehicleProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </VehicleProvider>
          </FilterProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
