import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Code2, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Fuse from 'fuse.js';

interface ApiEndpoint {
  path: string;
  method: string;
  operationId: string;
  tags: string[];
  summary?: string;
  description?: string;
  parameters?: any[];
}

interface SearchResult {
  endpoint: ApiEndpoint;
  score?: number;
}

interface ApiSearchProps {
  apiSpec: any;
  onSelectEndpoint: (path: string, method: string) => void;
  value: string;
  onChange: (value: string) => void;
}

export const ApiSearch = ({ apiSpec, onSelectEndpoint, value, onChange }: ApiSearchProps) => {
  const { t } = useTranslation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Prepare search data from OpenAPI spec
  const searchData: ApiEndpoint[] = apiSpec?.paths
    ? Object.entries(apiSpec.paths).flatMap(([path, methods]: [string, any]) =>
        Object.entries(methods)
          .filter(([method]) => ['get', 'post', 'put', 'patch', 'delete'].includes(method))
          .map(([method, details]: [string, any]) => ({
            path,
            method: method.toUpperCase(),
            operationId: details.operationId || '',
            tags: details.tags || [],
            summary: details.summary || '',
            description: details.description || '',
            parameters: details.parameters || [],
          })),
      )
    : [];

  const fuse = new Fuse(searchData, {
    keys: [
      { name: 'path', weight: 2 },
      { name: 'operationId', weight: 1.5 },
      { name: 'tags', weight: 1 },
      { name: 'summary', weight: 1 },
      { name: 'description', weight: 0.5 },
    ],
    threshold: 0.4,
    includeScore: true,
  });

  useEffect(() => {
    if (value.trim()) {
      const searchResults = fuse.search(value).slice(0, 8);
      setResults(
        searchResults.map((result) => ({
          endpoint: result.item,
          score: result.score,
        })),
      );
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (endpoint: ApiEndpoint) => {
    onSelectEndpoint(endpoint.path, endpoint.method);
    onChange('');
    setIsOpen(false);
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-500',
      POST: 'bg-green-500',
      PUT: 'bg-orange-500',
      PATCH: 'bg-yellow-500',
      DELETE: 'bg-red-500',
    };
    return colors[method] || 'bg-gray-500';
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value && setIsOpen(true)}
          className="pl-9 h-9"
        />
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full bg-background border shadow-lg z-50 max-h-[500px] overflow-y-auto">
          <div className="py-1">
            {results.map((result, index) => (
              <button
                key={`${result.endpoint.path}-${result.endpoint.method}-${index}`}
                onClick={() => handleResultClick(result.endpoint)}
                className="w-full px-3 py-2.5 text-left hover:bg-muted transition-colors border-b last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Badge
                      className={`${getMethodColor(result.endpoint.method)} text-white text-[10px] px-1.5 py-0 h-5 font-semibold shrink-0`}
                    >
                      {result.endpoint.method}
                    </Badge>
                    <code className="text-xs font-mono truncate flex-1">
                      {result.endpoint.path}
                    </code>
                  </div>
                </div>

                {result.endpoint.summary && (
                  <div className="text-xs text-muted-foreground mt-1.5 line-clamp-1 pl-1">
                    {result.endpoint.summary}
                  </div>
                )}

                {result.endpoint.tags && result.endpoint.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 pl-1">
                    {result.endpoint.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-4 font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {isOpen && value.trim() && results.length === 0 && (
        <Card className="absolute top-full mt-2 w-full bg-background border shadow-lg z-50">
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            {t('search.noEndpoints', { query: value })}
          </div>
        </Card>
      )}
    </div>
  );
};
