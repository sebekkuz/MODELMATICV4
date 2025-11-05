import React, { useState, useCallback } from 'react';
import Palette from './components/ModelBuilder/Palette';
import Viewport from './components/Viewport/Viewport';
import Inspector from './components/Inspector/Inspector';
import Toolbar from './components/Toolbar/Toolbar';
import Console from './components/Console/Console';
import ResultsDashboard from './components/Analysis/ResultsDashboard';
import { useWebSocket } from './hooks/useWebSocket';
import { useSimulation } from './hooks/useSimulation';
import './styles/main.css';

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [objects, setObjects] = useState([]);
  const [connections, setConnections] = useState([]);
  
  const { simulationData, sendCommand } = useWebSocket();
  const { startSimulation, pauseSimulation, resetSimulation } = useSimulation(sendCommand);

  const handleDragStart = useCallback((event, objectType) => {
    event.dataTransfer.setData('application/json', JSON.stringify({ type: objectType }));
  }, []);

  const handleObjectSelect = useCallback((object) => {
    setSelectedObject(object);
  }, []);

  const handleObjectDrop = useCallback((event, position) => {
    const data = JSON.parse(event.dataTransfer.getData('application/json'));
    const newObject = {
      id: `${data.type}_${Date.now()}`,
      type: data.type,
      position: position,
      status: 'idle'
    };
    setObjects(prev => [...prev, newObject]);
  }, []);

  const handleConnectionCreate = useCallback((fromId, toId) => {
    const newConnection = {
      id: `conn_${Date.now()}`,
      from: fromId,
      to: toId,
      travelTime: 1.0
    };
    setConnections(prev => [...prev, newConnection]);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Symulator Produkcji HMLV v1.0</h1>
      </header>
      
      <div className="app-layout">
        <div className="sidebar-left">
          <Palette onDragStart={handleDragStart} />
        </div>
        
        <div className="main-content">
          <Toolbar 
            onStart={startSimulation}
            onPause={pauseSimulation}
            onReset={resetSimulation}
            simulationStatus={simulationData?.status}
          />
          
          <div className="viewport-container">
            <Viewport
              objects={objects}
              connections={connections}
              onObjectSelect={handleObjectSelect}
              onObjectDrop={handleObjectDrop}
              onConnectionCreate={handleConnectionCreate}
              simulationData={simulationData}
            />
          </div>
          
          {simulationData?.status === 'completed' && (
            <ResultsDashboard simulationResults={simulationData.metrics} />
          )}
        </div>
        
        <div className="sidebar-right">
          <Inspector 
            selectedObject={selectedObject}
            onObjectUpdate={(updatedObject) => {
              setObjects(prev => prev.map(obj => 
                obj.id === updatedObject.id ? updatedObject : obj
              ));
            }}
          />
          <Console logs={simulationData?.events || []} />
        </div>
      </div>
    </div>
  );
}

export default App;
