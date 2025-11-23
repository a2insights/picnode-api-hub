import { createContext, useContext, useState } from 'react';

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  settings: any | null;
  created_at: string;
  updated_at: string;
}

interface Api {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  color: string;
  pricing: {
    basePrice: number;
    priceFactor: number;
    currency: string | null;
    freeRequests: number;
    plans: any[];
  };
  statistics: {
    totalRecords: number;
    totalRequests: number;
    activeUsers: number;
    uptime: number;
    avgResponseTime: number;
    lastUpdated: string;
  };
  construction: {
    inConstruction: boolean;
    progress: number;
    estimatedCompletion: number;
    betaAccess: boolean;
    changelog: any[];
  };
  availability: {
    status: string;
    statusMessage: string;
    regions: any[];
    rateLimit: {
      requestsPerMinute: number;
      requestsPerDay: number;
    };
  };
  endpoints: any | null;
  documentation: any[];
  features: {
    languages?: string;
    [key: string]: any;
  } | null;
  metadata: any[];
  created_at: string;
  updated_at: string;
}

interface AppContextType {
  project: Project | null;
  setProject: (project: Project | null) => void;
  apis: Api[];
  setApis: (apis: Api[]) => void;
}

const AppContext = createContext<AppContextType>({
  project: null,
  setProject: () => {},
  apis: [],
  setApis: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [apis, setApis] = useState<Api[]>([]);

  return (
    <AppContext.Provider value={{ project, setProject, apis, setApis }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
