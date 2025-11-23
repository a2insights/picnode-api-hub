import { Search, Shield, Globe, Zap, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useGlobalPlayground } from '@/contexts/GlobalPlaygroundContext';
import { useAuth } from '@/contexts/AuthContext';
import { getTokens } from '@/services/apiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ApiSearch } from './ApiSearch';

interface Token {
  id: number | string;
  name: string;
  abilities?: string[];
  usage: {
    plain_text_token: string;
  };
}

interface ApiToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  servers?: { url: string }[];
  apiSpec?: any;
  onSelectEndpoint?: (path: string, method: string) => void;
}

export const ApiToolbar = ({
  search,
  onSearchChange,
  servers = [],
  apiSpec,
  onSelectEndpoint,
}: ApiToolbarProps) => {
  const {
    globalToken,
    setGlobalToken,
    isLiveMode,
    setIsLiveMode,
    selectedServerUrl,
    setSelectedServerUrl,
  } = useGlobalPlayground();
  const { isAuthenticated } = useAuth();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [selectedTokenValue, setSelectedTokenValue] = useState<string>('');
  const [isManualInput, setIsManualInput] = useState(false);

  // Initialize selected server if not set
  useEffect(() => {
    if (!selectedServerUrl && servers.length > 0) {
      setSelectedServerUrl(servers[0].url);
    }
  }, [servers, selectedServerUrl, setSelectedServerUrl]);

  // Fetch tokens when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchTokens = async () => {
        setLoadingTokens(true);
        try {
          const response = await getTokens();
          let tokenList: Token[] = [];
          if (Array.isArray(response)) {
            tokenList = response;
          } else if (response && Array.isArray(response.data)) {
            tokenList = response.data;
          }
          setTokens(tokenList);
        } catch (err) {
          console.error('Failed to fetch tokens:', err);
        } finally {
          setLoadingTokens(false);
        }
      };
      fetchTokens();
    }
  }, [isAuthenticated]);

  // Sync internal state with global token context
  useEffect(() => {
    if (!globalToken) {
      setSelectedTokenValue('');
      setIsManualInput(false);
      return;
    }

    // Check if global token matches any user token
    const matchingToken = tokens.find((t) => t.usage.plain_text_token === globalToken);
    if (matchingToken) {
      setSelectedTokenValue(matchingToken.usage.plain_text_token);
      setIsManualInput(false);
    } else {
      // If it doesn't match, it's likely a manual token
      setSelectedTokenValue('manual');
      setIsManualInput(true);
    }
  }, [globalToken, tokens]);

  const handleTokenSelect = (value: string) => {
    if (value === 'manual') {
      setSelectedTokenValue('manual');
      setIsManualInput(true);
      setGlobalToken(''); // Clear global token until user types
    } else {
      setSelectedTokenValue(value);
      setIsManualInput(false);
      setGlobalToken(value);
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalToken(e.target.value);
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      {/* First Row: Search */}
      <div className="flex items-center gap-3 px-4 py-2 border-b">
        <div className="relative flex-1 max-w-2xl">
          {apiSpec && onSelectEndpoint ? (
            <ApiSearch
              apiSpec={apiSpec}
              onSelectEndpoint={onSelectEndpoint}
              value={search}
              onChange={onSearchChange}
            />
          ) : (
            <>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search APIs..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </>
          )}
        </div>
      </div>

      {/* Second Row: Controls */}
      <div className="flex items-center gap-4 px-4 py-2">
        {/* Live Mode Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="global-live-mode"
            checked={isLiveMode}
            onCheckedChange={setIsLiveMode}
            className={cn(isLiveMode && 'data-[state=checked]:bg-emerald-500')}
          />
          <Label
            htmlFor="global-live-mode"
            className={cn(
              'text-xs font-medium cursor-pointer flex items-center gap-1 transition-colors whitespace-nowrap',
              isLiveMode ? 'text-emerald-600' : 'text-muted-foreground',
            )}
          >
            {isLiveMode ? <Radio className="h-3 w-3 animate-pulse" /> : <Zap className="h-3 w-3" />}
            {isLiveMode ? 'Live' : 'Mock'}
          </Label>
        </div>

        <div className="h-4 w-px bg-border" />

        {/* Server Selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <Select value={selectedServerUrl} onValueChange={setSelectedServerUrl}>
            <SelectTrigger className="h-8 text-xs w-[220px]">
              <SelectValue placeholder="Select server" />
            </SelectTrigger>
            <SelectContent>
              {servers.length > 0 ? (
                servers.map((server) => (
                  <SelectItem key={server.url} value={server.url} className="text-xs">
                    {server.url}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="default" disabled className="text-xs">
                  No servers available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="h-4 w-px bg-border" />

        {/* Token Section */}
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span className="whitespace-nowrap">Token</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Select
                value={selectedTokenValue}
                onValueChange={handleTokenSelect}
                disabled={loadingTokens}
              >
                <SelectTrigger className="h-8 text-xs w-full overflow-hidden">
                  {selectedTokenValue && selectedTokenValue !== 'manual' ? (
                    (() => {
                      const token = tokens.find(
                        (t) => t.usage.plain_text_token === selectedTokenValue,
                      );
                      return token ? (
                        <div className="flex items-center gap-1.5 truncate max-w-full">
                          <span className="font-medium truncate shrink">{token.name}</span>
                          <span className="text-muted-foreground shrink-0 text-[10px]">
                            #{token.id}
                          </span>
                        </div>
                      ) : (
                        <span className="truncate">{selectedTokenValue.substring(0, 12)}...</span>
                      );
                    })()
                  ) : selectedTokenValue === 'manual' ? (
                    <span className="text-muted-foreground truncate">Manual Token</span>
                  ) : (
                    <span className="text-muted-foreground truncate">
                      {loadingTokens ? 'Loading...' : 'Select Global Token'}
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem
                      key={token.id}
                      value={token.usage.plain_text_token}
                      className="text-xs"
                    >
                      <div className="flex flex-col gap-1 py-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-muted-foreground">#{token.id}</span>
                          <span className="font-medium">{token.name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                          {token.usage.plain_text_token}
                        </div>
                        {token.abilities && token.abilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.abilities.map((ability) => (
                              <Badge
                                key={ability}
                                variant="secondary"
                                className="text-[10px] px-1 h-4 font-normal"
                              >
                                {ability}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="manual" className="text-xs font-medium border-t mt-1 pt-1">
                    Enter token manually...
                  </SelectItem>
                </SelectContent>
              </Select>

              {isManualInput && (
                <Input
                  placeholder="Paste token..."
                  value={globalToken}
                  onChange={handleManualInputChange}
                  className="h-8 text-xs font-mono w-[180px]"
                  type="password"
                />
              )}
            </div>
          ) : (
            <div className="flex-1 max-w-[200px]">
              <Input
                placeholder="Paste Global Token..."
                value={globalToken}
                onChange={(e) => setGlobalToken(e.target.value)}
                className="h-8 text-xs font-mono"
                type="password"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
