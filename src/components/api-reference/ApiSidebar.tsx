import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Flag, Sparkles, MapPinCheck, Building2, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  search: string;
}

const iconMap: Record<string, any> = {
  Sparkles: Sparkles,
  Flag: Flag,
  Shield: Shield,
  MapPinCheck: MapPinCheck,
  Building2: Building2,
};

export const ApiSidebar = ({ apis, selectedApi, onSelectApi, search }: ApiSidebarProps) => {
  const { t } = useTranslation();
  const filteredApis = apis.filter((api) => api.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          <h3 className="font-semibold text-sm text-foreground mb-2">
            {t('sidebar.apiDirectory')}
          </h3>
          {filteredApis.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              {t('sidebar.noApisFound')}
            </div>
          ) : (
            filteredApis.map((api) => {
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
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
