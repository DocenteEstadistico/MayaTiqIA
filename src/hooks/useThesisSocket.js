import { useState } from 'react';

export function useThesisSocket() {
  const [isConnected, setIsConnected] = useState(true);

  const sendEvent = (eventName, data) => {
    console.log(`[ThesisSocket] Evento enviado (${eventName}):`, data);
  };

  return { isConnected, sendEvent, setIsConnected };
}
