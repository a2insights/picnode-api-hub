import { DocsLayout } from '@/components/docs/DocsLayout';
import { ApiSidebar, ApiItem } from '@/components/api-reference/ApiSidebar';
import { ApiContent } from '@/components/api-reference/ApiContent';
import { useAppContext } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';

export const ApiReference = () => {
  const { apis } = useAppContext();
  const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null);

  // Select the first API by default when apis are loaded
  useEffect(() => {
    if (apis.length > 0 && !selectedApi) {
      setSelectedApi(apis[0] as unknown as ApiItem);
    }
  }, [apis, selectedApi]);

  return (
    <DocsLayout
      secondarySidebar={
        <ApiSidebar
          apis={apis as unknown as ApiItem[]}
          selectedApi={selectedApi}
          onSelectApi={setSelectedApi}
        />
      }
    >
      {selectedApi ? (
        <ApiContent api={selectedApi} />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select an API to view documentation
        </div>
      )}
    </DocsLayout>
  );
};
