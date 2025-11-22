import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Flag, Sparkles, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export interface ApiItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  updated_at: string;
  endpoints: Record<string, string>;
  availability: {
    status: string;
    rateLimit: {
      requestsPerMinute: number;
    };
  };
  statistics: {
    uptime: number;
    activeUsers: number;
    totalRequests: number;
  };
  pricing: {
    basePrice: number;
    priceFactor: number;
  };
  construction: {
    inConstruction: boolean;
    progress: number;
    estimatedCompletion: number;
  };
  features: {
    languages?: string;
  };
}

interface ApiSidebarProps {
  apis: ApiItem[];
  selectedApi: ApiItem | null;
  onSelectApi: (api: ApiItem) => void;
}

const iconMap: Record<string, any> = {
  Sparkles: Sparkles,
  Flag: Flag,
};

export const ApiSidebar = ({ apis, selectedApi, onSelectApi }: ApiSidebarProps) => {
  const [search, setSearch] = useState('');

  // Group APIs by category
  const groupedApis = apis.reduce(
    (acc, api) => {
      if (!acc[api.category]) {
        acc[api.category] = [];
      }
      acc[api.category].push(api);
      return acc;
    },
    {} as Record<string, ApiItem[]>,
  );

  const filteredGroups = Object.entries(groupedApis).reduce(
    (acc, [category, items]) => {
      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
      if (filteredItems.length > 0) {
        acc[category] = filteredItems;
      }
      return acc;
    },
    {} as Record<string, ApiItem[]>,
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search APIs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-foreground mb-2">API Directory</h3>
            {Object.entries(filteredGroups).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <div className="flex items-center text-sm font-medium text-muted-foreground mt-4 mb-2">
                  <ChevronDown className="h-3 w-3 mr-2" />
                  {category}
                </div>
                {items.map((api) => {
                  const Icon = iconMap[api.icon] || Flag;
                  return (
                    <button
                      key={api.id}
                      onClick={() => onSelectApi(api)}
                      className={cn(
                        'w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors',
                        selectedApi?.id === api.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {api.name}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
