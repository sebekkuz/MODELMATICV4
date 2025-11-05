import { useState, useEffect, useCallback } from 'react';

// Funkcja do określenia URL WebSocket na podstawie środowiska
const getWebSocketUrl = () => {
  if (import.meta.env.PROD) {
    // W produkcji używamy Render URL
    const backendUrl = import.meta.env.VITE_API_URL || 'https://symulator-produkcji-backend.onrender.com';
    return backendUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws/simulation';
  } else {
    // W rozwoju używamy localhost
    return 'ws://localhost:8000/ws/simulation';
  }
};

const getApiUrl = () => {
  return import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || 'https://symulator-produkcji-backend.onrender.com')
    : 'http://localhost:8000';
};

export const useWebSocket = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (import.meta.env.PROD) {
      // W produkcji używamy prawdziwego WebSocket
      const wsUrl = getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected to:', wsUrl);
        setIsConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setSimulationData(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    } else {
      // W rozwoju używamy danych demo
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
    }
  }, []);

  const sendCommand = useCallback(async (command, data = {}) => {
    console.log('Send command:', command, data);
    
    if (import.meta.env.PROD) {
      // W produkcji wysyłamy przez API
      try {
        const apiUrl = getApiUrl();
        let response;
        
        switch (command) {
          case 'start':
            response = await fetch(`${apiUrl}/api/simulation/start`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data.config || {})
            });
            break;
          case 'pause':
            response = await fetch(`${apiUrl}/api/simulation/pause`, { method: 'POST' });
            break;
          case 'reset':
            response = await fetch(`${apiUrl}/api/simulation/reset`, { method: 'POST' });
            break;
          case 'import_csv':
            // Tutaj obsługa importu CSV
            break;
          default:
            console.warn('Unknown command:', command);
        }
        
        if (response) {
          const result = await response.json();
          console.log('Command result:', result);
        }
      } catch (error) {
        console.error('Error sending command:', error);
      }
    } else {
      // W rozwoju tylko logujemy
      console.log('Development mode - command logged:', command, data);
    }
  }, []);

  return {
    simulationData,
    isConnected,
    sendCommand
  };
};
