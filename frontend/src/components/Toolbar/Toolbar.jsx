import React from 'react';
import './Toolbar.css';

const Toolbar = ({ onStart, onPause, onReset, simulationStatus }) => {
  const isRunning = simulationStatus === 'running';
  const isPaused = simulationStatus === 'paused';
  const isCompleted = simulationStatus === 'completed';

  return (
    <div className="toolbar">
      <button 
        className="toolbar-btn start"
        onClick={onStart}
        disabled={isRunning}
      >
        Start
      </button>
      
      <button 
        className="toolbar-btn pause"
        onClick={onPause}
        disabled={!isRunning || isPaused}
      >
        Pauza
      </button>
      
      <button 
        className="toolbar-btn reset"
        onClick={onReset}
      >
        Reset
      </button>
      
      <div className="simulation-status">
        Status: <span className={`status-${simulationStatus || 'stopped'}`}>
          {simulationStatus || 'Zatrzymany'}
        </span>
      </div>
      
      <div className="toolbar-separator"></div>
      
      <button className="toolbar-btn import">
        Import CSV
      </button>
      
      <button className="toolbar-btn export">
        Eksport konfiguracji
      </button>
    </div>
  );
};

export default Toolbar;
