import { DocsLayout } from '@/components/docs/DocsLayout';
import { ApiSidebar, ApiItem } from '@/components/api-reference/ApiSidebar';
import { ApiContent } from '@/components/api-reference/ApiContent';
import { ApiToolbar } from '@/components/api-reference/ApiToolbar';
import { useAppContext } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';
import { GlobalPlaygroundProvider } from '@/contexts/GlobalPlaygroundContext';

export const ApiReference = () => {
  const { apis } = useAppContext();
  const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null);
  const [search, setSearch] = useState('');
  const [servers, setServers] = useState<{ url: string }[]>([]);

  // Select the first API by default when apis are loaded
  useEffect(() => {
    if (apis.length > 0 && !selectedApi) {
      setSelectedApi(apis[0] as unknown as ApiItem);
    }
  }, [apis, selectedApi]);

  // Fetch servers from api.json
  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api.json');
        const data = await response.json();
        if (data.servers && Array.isArray(data.servers)) {
          setServers(data.servers);
        }
      } catch (error) {
        console.error('Failed to fetch API spec:', error);
      }
    };
    fetchSpec();
  }, []);

  return (
    <GlobalPlaygroundProvider>
      <DocsLayout
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
          <ApiToolbar search={search} onSearchChange={setSearch} servers={servers} />
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
