import { DocsLayout } from '@/components/docs/DocsLayout';
import { ApiSidebar, ApiItem } from '@/components/api-reference/ApiSidebar';
import { ApiContent } from '@/components/api-reference/ApiContent';
import { ApiToolbar } from '@/components/api-reference/ApiToolbar';
import { useAppContext } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalPlaygroundProvider } from '@/contexts/GlobalPlaygroundContext';

export const ApiReference = () => {
  const { apis } = useAppContext();
  const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null);
  const [search, setSearch] = useState('');
  const [servers, setServers] = useState<{ url: string }[]>([]);
  const [apiSpec, setApiSpec] = useState<any>(null);

  // Update selected API when apis list changes (e.g. language change)
  useEffect(() => {
    if (apis.length > 0) {
      if (selectedApi) {
        // Try to find the currently selected API in the new list
        const updatedApi = apis.find((api: any) => api.id === selectedApi.id);
        if (updatedApi) {
          setSelectedApi(updatedApi as unknown as ApiItem);
        }
      } else {
        // Select first API if none selected
        setSelectedApi(apis[0] as unknown as ApiItem);
      }
    }
  }, [apis]);

  // Fetch servers and full spec from api.json
  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api.json');
        const data = await response.json();
        setApiSpec(data);
        if (data.servers && Array.isArray(data.servers)) {
          setServers(data.servers);
        }
      } catch (error) {
        console.error('Failed to fetch API spec:', error);
      }
    };
    fetchSpec();
  }, []);

  const handleSelectEndpoint = (path: string, method: string) => {
    // Find the API that contains this endpoint
    const matchingApi = apis.find((api: any) => {
      // Check if this API's endpoints include this path
      return api.slug === path.split('/')[2]; // Extract API slug from path like /picnode/companies
    });

    if (matchingApi) {
      setSelectedApi(matchingApi as unknown as ApiItem);
      // Scroll to the endpoint after a short delay to allow the content to render
      setTimeout(() => {
        const endpointId = `${method.toLowerCase()}-${path.replace(/\//g, '-')}`;
        const element = document.getElementById(endpointId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const { i18n } = useTranslation();

  return (
    <GlobalPlaygroundProvider>
      <DocsLayout
        key={i18n.language}
        secondarySidebar={
          <ApiSidebar
            apis={apis as unknown as ApiItem[]}
            selectedApi={selectedApi}
            onSelectApi={setSelectedApi}
            search={search}
          />
        }
      >
        <div className="flex flex-col h-full">
          <ApiToolbar
            search={search}
            onSearchChange={setSearch}
            servers={servers}
            apiSpec={apiSpec}
            onSelectEndpoint={handleSelectEndpoint}
          />
          {selectedApi ? (
            <ApiContent api={selectedApi} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground p-8">
              Select an API to view documentation
            </div>
          )}
        </div>
      </DocsLayout>
    </GlobalPlaygroundProvider>
  );
};
