import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Loader2, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactJson from 'react-json-view';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalPlayground } from '@/contexts/GlobalPlaygroundContext';
import { getTokens } from '@/services/apiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApiPlaygroundProps {
  path: string;
  method: string;
  parameters?: any[];
  servers?: { url: string }[];
  responses?: Record<string, any>;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
}

interface Token {
  id: number | string;
  name: string;
  abilities?: string[];
  usage: {
    plain_text_token: string;
  };
}

// Helper to generate mock data from schema
const generateMockFromSchema = (schema: any): any => {
  if (!schema) return null;

  if (schema.example) return schema.example;
  if (schema.default) return schema.default;

  if (schema.type === 'object') {
    const obj: any = {};
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
        obj[key] = generateMockFromSchema(prop);
      });
    }
    return obj;
  }

  if (schema.type === 'array') {
    if (schema.items) {
      // Generate a few items
      return [generateMockFromSchema(schema.items), generateMockFromSchema(schema.items)];
    }
    return [];
  }

  if (schema.type === 'string') {
    if (schema.format === 'date-time') return new Date().toISOString();
    if (schema.format === 'date') return new Date().toISOString().split('T')[0];
    if (schema.enum && schema.enum.length > 0) return schema.enum[0];
    return 'string_value';
  }

  if (schema.type === 'integer' || schema.type === 'number') {
    return 123;
  }

  if (schema.type === 'boolean') {
    return true;
  }

  return null;
};

export const ApiPlayground = ({
  path,
  method,
  parameters = [],
  servers = [],
  responses = {},
}: ApiPlaygroundProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { globalToken, isLiveMode, setIsLiveMode, selectedServerUrl, setSelectedServerUrl } =
    useGlobalPlayground();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  // Token state
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [manualToken, setManualToken] = useState('');
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [isManualToken, setIsManualToken] = useState(false);

  // Initialize selected server if not set globally
  useEffect(() => {
    if (!selectedServerUrl && servers.length > 0) {
      setSelectedServerUrl(servers[0].url);
    }
  }, [servers, selectedServerUrl, setSelectedServerUrl]);

  // Sync with global token
  useEffect(() => {
    if (globalToken) {
      setSelectedToken(globalToken);
      // Check if it matches a user token to determine if manual
      const match = tokens.find((t) => t.usage.plain_text_token === globalToken);
      setIsManualToken(!match);
      if (!match) {
        setManualToken(globalToken);
      }
    } else {
      setSelectedToken('');
      setIsManualToken(false);
      setManualToken('');
    }
  }, [globalToken, tokens]);

  // Fetch tokens
  useEffect(() => {
    if (isAuthenticated) {
      const fetchTokens = async () => {
        setLoadingTokens(true);
        try {
          const res = await getTokens();
          let tokenList: Token[] = [];
          if (Array.isArray(res)) {
            tokenList = res;
          } else if (res && Array.isArray(res.data)) {
            tokenList = res.data;
          }
          setTokens(tokenList);
        } catch (err) {
          console.error('Failed to fetch tokens', err);
        } finally {
          setLoadingTokens(false);
        }
      };
      fetchTokens();
    }
  }, [isAuthenticated]);

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTokenChange = (value: string) => {
    if (value === 'manual') {
      setIsManualToken(true);
      setSelectedToken('');
      setManualToken('');
    } else {
      setIsManualToken(false);
      setSelectedToken(value);
    }
  };

  const handleManualTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualToken(e.target.value);
    setSelectedToken(e.target.value);
  };

  const executeRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = performance.now();

    try {
      // Group parameters by location
      const pathParams = parameters.filter((p) => p.in === 'path');
      const queryParams = parameters.filter((p) => p.in === 'query');
      const headerParams = parameters.filter((p) => p.in === 'header');

      // Construct URL
      let url = path;

      // Replace path params
      pathParams.forEach((param) => {
        const value = paramValues[param.name] || `:${param.name}`;
        url = url.replace(`{${param.name}}`, value);
      });

      // Append query params
      const queryString = queryParams
        .filter((param) => paramValues[param.name])
        .map((param) => `${param.name}=${encodeURIComponent(paramValues[param.name])}`)
        .join('&');

      // Check if endpoint supports lang parameter and add current language
      const hasLangParam = parameters.some((p) => p.name === 'lang' && p.in === 'query');
      const currentLang = localStorage.getItem('language') || 'pt';
      const langParam = hasLangParam ? `lang=${currentLang}` : '';

      // Combine query params
      const allParams = [queryString, langParam].filter(Boolean).join('&');

      if (allParams) {
        url += `?${allParams}`;
      }

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (selectedToken) {
        headers['Authorization'] = `Bearer ${selectedToken}`;
      }

      headerParams.forEach((param) => {
        if (paramValues[param.name]) {
          headers[param.name] = paramValues[param.name];
        }
      });

      // LIVE MODE (Real Request)
      if (isLiveMode) {
        const baseUrl = selectedServerUrl || (servers.length > 0 ? servers[0].url : '');
        // Remove trailing slash from server and leading slash from url to avoid double slashes
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        const cleanPathUrl = url.startsWith('/') ? url : `/${url}`;
        const fetchUrl = `${cleanBaseUrl}${cleanPathUrl}`;

        const res = await fetch(fetchUrl, {
          method: method.toUpperCase(),
          headers: headers,
        });

        const data = await res.json().catch(() => null);

        const resHeaders: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          resHeaders[key] = value;
        });

        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: resHeaders,
          data: data || { message: 'No content or non-JSON response' },
          time: Math.round(performance.now() - startTime),
        });
      }
      // MOCK MODE (Simulated Response)
      else {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

        // Try to find a success response schema (200 or 201)
        const successStatus = Object.keys(responses).find((s) => s.startsWith('2'));
        const responseSchema = successStatus
          ? responses[successStatus]?.content?.['application/json']?.schema
          : null;

        const mockData = generateMockFromSchema(responseSchema) || {
          message: 'Mock response data',
        };

        setResponse({
          status: parseInt(successStatus || '200'),
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          data: mockData,
          time: 150,
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Group parameters for render
  const pathParams = parameters.filter((p) => p.in === 'path');
  const queryParams = parameters.filter((p) => p.in === 'query');
  const headerParams = parameters.filter((p) => p.in === 'header');

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge
              variant={!isLiveMode ? 'secondary' : 'default'}
              className={cn('uppercase', isLiveMode && 'bg-emerald-500 hover:bg-emerald-600')}
            >
              {method}
            </Badge>
            <code className="text-sm font-mono">{path}</code>
          </div>

          {/* Live Mode Indicator */}
          {isLiveMode && (
            <Badge
              variant="outline"
              className="border-emerald-500 text-emerald-600 bg-emerald-50 flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Server Selection - Now Global */}
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">{t('playground.server')}:</Label>
            <Select value={selectedServerUrl} onValueChange={setSelectedServerUrl}>
              <SelectTrigger className="h-8 text-xs w-[200px]">
                <SelectValue placeholder={t('playground.selectServer')} />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server) => (
                  <SelectItem key={server.url} value={server.url} className="text-xs">
                    {server.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Mock Mode Toggle - Now Global Live Mode */}
          <div className="flex items-center gap-2">
            <Switch
              id="mock-mode"
              checked={isLiveMode}
              onCheckedChange={setIsLiveMode}
              className={cn(isLiveMode && 'data-[state=checked]:bg-emerald-500')}
            />
            <Label htmlFor="mock-mode" className="text-xs font-medium cursor-pointer">
              {isLiveMode ? t('playground.liveMode') : t('playground.mockMode')}
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x">
        {/* Request Configuration Panel */}
        <div
          className={cn(
            'lg:col-span-2 p-4 space-y-6 transition-colors',
            isLiveMode
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500'
              : 'bg-muted/10',
          )}
        >
          <div className="space-y-4">
            {/* Token Selection */}
            {isAuthenticated ? (
              <div className="space-y-3">
                <Label className="text-xs font-mono">{t('playground.authorization')}</Label>
                <div className="flex flex-col gap-2">
                  <Select
                    value={isManualToken ? 'manual' : selectedToken}
                    onValueChange={handleTokenChange}
                    disabled={loadingTokens}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-8 text-xs transition-colors',
                        isLiveMode &&
                          'border-emerald-500 text-emerald-700 bg-emerald-50/50 ring-emerald-500/20',
                      )}
                    >
                      <SelectValue
                        placeholder={
                          loadingTokens
                            ? t('playground.loadingTokens')
                            : t('playground.selectToken')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {globalToken && (
                        <SelectItem
                          value={globalToken}
                          className="text-xs font-medium border-b mb-1 pb-1"
                        >
                          <span className="font-bold mr-2">{t('playground.globalToken')}</span>
                          <span className="text-muted-foreground">
                            ({globalToken.substring(0, 8)}...)
                          </span>
                        </SelectItem>
                      )}
                      {tokens.map((token) => (
                        <SelectItem
                          key={token.id}
                          value={token.usage.plain_text_token}
                          className="text-xs"
                        >
                          <span className="font-mono mr-2 text-muted-foreground">#{token.id}</span>
                          <span className="font-medium mr-2">{token.name}</span>
                          <span className="text-muted-foreground">
                            ({token.usage.plain_text_token.substring(0, 8)}...)
                          </span>
                          {/* Access Control Warning */}
                          {token.abilities && !token.abilities.includes(path.split('/')[2]) && (
                            <AlertCircle className="ml-2 h-3 w-3 text-amber-500 inline" />
                          )}
                        </SelectItem>
                      ))}
                      <SelectItem value="manual" className="text-xs font-medium border-t mt-1 pt-1">
                        {t('playground.enterTokenManually')}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {isManualToken && (
                    <Input
                      placeholder={t('playground.pasteToken')}
                      value={manualToken}
                      onChange={handleManualTokenChange}
                      className={cn(
                        'h-8 text-xs',
                        isLiveMode && 'border-emerald-500 focus-visible:ring-emerald-500',
                      )}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Label className="text-xs font-mono">{t('playground.authorization')}</Label>
                <div className="flex items-center gap-2">
                  <Lock
                    className={cn(
                      'h-3 w-3 text-muted-foreground',
                      isLiveMode && 'text-emerald-600',
                    )}
                  />
                  <div className="flex-1">
                    <Input
                      placeholder={t('playground.pasteGlobalToken')}
                      value={manualToken || selectedToken}
                      onChange={handleManualTokenChange}
                      className={cn(
                        'h-8 text-xs',
                        isLiveMode && 'border-emerald-500 focus-visible:ring-emerald-500',
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {pathParams.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {t('playground.pathParameters')}
                </h4>
                {pathParams.map((param) => (
                  <div key={param.name} className="space-y-1">
                    <Label htmlFor={`param-${param.name}`} className="text-xs font-mono">
                      {param.name} {param.required && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id={`param-${param.name}`}
                      placeholder={param.description || param.name}
                      value={paramValues[param.name] || ''}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {queryParams.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {t('playground.queryParameters')}
                </h4>
                {queryParams.map((param) => (
                  <div key={param.name} className="space-y-1">
                    <Label htmlFor={`param-${param.name}`} className="text-xs font-mono">
                      {param.name} {param.required && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id={`param-${param.name}`}
                      placeholder={param.description || param.name}
                      value={paramValues[param.name] || ''}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {headerParams.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {t('playground.headers')}
                </h4>
                {headerParams.map((param) => (
                  <div key={param.name} className="space-y-1">
                    <Label htmlFor={`param-${param.name}`} className="text-xs font-mono">
                      {param.name} {param.required && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id={`param-${param.name}`}
                      placeholder={param.description || param.name}
                      value={paramValues[param.name] || ''}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {parameters.length === 0 && (
              <div className="text-sm text-muted-foreground italic py-4 text-center">
                {t('playground.noParameters')}
              </div>
            )}
          </div>

          <Button className="w-full" onClick={executeRequest} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('playground.sendingRequest')}
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {t('playground.sendRequest')}
              </>
            )}
          </Button>
        </div>

        {/* Response Panel */}
        <div className="lg:col-span-3 p-0 flex flex-col min-h-[400px]">
          {!response && !error && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Play className="h-6 w-6 opacity-50" />
              </div>
              <p>{t('playground.configureAndSend')}</p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold">{t('playground.requestFailed')}</h4>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {response && (
            <div className="flex-1 flex flex-col">
              <div className="border-b p-3 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      response.status >= 200 && response.status < 300 ? 'default' : 'destructive'
                    }
                  >
                    {response.status} {response.statusText}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3" /> {response.time}ms
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              <Tabs defaultValue="body" className="flex-1 flex flex-col">
                <div className="border-b px-3">
                  <TabsList className="h-10 bg-transparent p-0">
                    <TabsTrigger
                      value="body"
                      className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 text-xs uppercase tracking-wider"
                    >
                      {t('playground.responseBody')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="headers"
                      className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 text-xs uppercase tracking-wider"
                    >
                      {t('playground.headers')}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="body" className="flex-1 m-0 p-0 relative">
                  <ScrollArea className="h-[400px] w-full">
                    <div className="p-4">
                      <ReactJson
                        src={response.data}
                        name={false}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={true}
                        theme={theme === 'dark' ? 'ocean' : 'rjv-default'}
                        style={{
                          backgroundColor: 'transparent',
                          fontSize: '0.875rem',
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="headers" className="flex-1 m-0 p-0">
                  <ScrollArea className="h-[400px] w-full">
                    <div className="p-4 space-y-2">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-3 gap-4 text-sm border-b border-border/50 pb-2 last:border-0"
                        >
                          <span className="font-medium text-muted-foreground">{key}</span>
                          <span className="col-span-2 font-mono break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
