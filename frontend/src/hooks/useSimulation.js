import { useCallback } from 'react';

export const useSimulation = (sendCommand) => {
  const startSimulation = useCallback((config) => {
    sendCommand('start', { config });
  }, [sendCommand]);

  const pauseSimulation = useCallback(() => {
    sendCommand('pause');
  }, [sendCommand]);

  const resetSimulation = useCallback(() => {
    sendCommand('reset');
  }, [sendCommand]);

  return {
    startSimulation,
    pauseSimulation,
    resetSimulation
  };
};
