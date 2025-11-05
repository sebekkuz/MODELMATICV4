import { useState, useEffect, useCallback } from 'react';

export const useWebSocket = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Demo implementation
    const demoData = {
      time: 0,
      objects: [
        { id: 'S1', type: 'Station', status: 'idle', position: { x: -100, y: 0 } },
        { id: 'S2', type: 'Station', status: 'idle', position: { x: 100, y: 0 } },
        { id: 'B1', type: 'Buffer', status: 'idle', position: { x: 0, y: 50 } }
      ],
      metrics: {
        throughput: 0,
        utilization: { S1: 0, S2: 0 },
        queue_lengths: { B1: 0 }
      },
      events: [
        { timestamp: new Date().toISOString(), level: 'info', message: 'Symulator gotowy do uruchomienia' }
      ],
      status: 'stopped'
    };
    
    setSimulationData(demoData);
    setIsConnected(true);
  }, []);

  const sendCommand = useCallback((command, data = {}) => {
    console.log('Send command:', command, data);
  }, []);

  return {
    simulationData,
    isConnected,
    sendCommand
  };
};
