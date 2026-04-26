import React from 'react';
import TurbineDetail from './components/TurbineDetail';
import './App.css';

// Simplified application entry point.  This dashboard is designed for a single
// turbine, so we render the TurbineDetail component directly without
// React Router.  The TurbineDetail component uses a fixed ID internally.
function App() {
  return (
    <TurbineDetail />
  );
}

export default App;