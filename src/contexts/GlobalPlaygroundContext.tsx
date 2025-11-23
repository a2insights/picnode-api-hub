import React, { createContext, useContext, useState, useEffect } from 'react';

interface GlobalPlaygroundContextType {
  globalToken: string;
  setGlobalToken: (token: string) => void;
  selectedServerUrl: string;
  setSelectedServerUrl: (url: string) => void;
  isLiveMode: boolean;
  setIsLiveMode: (isLive: boolean) => void;
}

const GlobalPlaygroundContext = createContext<GlobalPlaygroundContextType | undefined>(undefined);

export const GlobalPlaygroundProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalToken, setGlobalToken] = useState<string>(() => {
    return localStorage.getItem('picnode_global_api_token') || '';
  });

  const [selectedServerUrl, setSelectedServerUrl] = useState<string>(() => {
    return localStorage.getItem('picnode_global_server_url') || '';
  });

  const [isLiveMode, setIsLiveMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('picnode_global_live_mode');
    return stored ? JSON.parse(stored) : false; // Default to false (Mock Mode)
  });

  useEffect(() => {
    localStorage.setItem('picnode_global_api_token', globalToken);
  }, [globalToken]);

  useEffect(() => {
    localStorage.setItem('picnode_global_server_url', selectedServerUrl);
  }, [selectedServerUrl]);

  useEffect(() => {
    localStorage.setItem('picnode_global_live_mode', JSON.stringify(isLiveMode));
  }, [isLiveMode]);

  return (
    <GlobalPlaygroundContext.Provider
      value={{
        globalToken,
        setGlobalToken,
        selectedServerUrl,
        setSelectedServerUrl,
        isLiveMode,
        setIsLiveMode,
      }}
    >
      {children}
    </GlobalPlaygroundContext.Provider>
  );
};

export const useGlobalPlayground = () => {
  const context = useContext(GlobalPlaygroundContext);
  if (context === undefined) {
    throw new Error('useGlobalPlayground must be used within a GlobalPlaygroundProvider');
  }
  return context;
};
