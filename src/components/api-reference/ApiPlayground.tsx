import React, { useState, useEffect } from 'react';
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
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [mockMode, setMockMode] = useState(true);

  // Token state
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [manualToken, setManualToken] = useState('');
  const [loadingTokens, setLoadingTokens] = useState(false);

  // Server state
  const [selectedServer, setSelectedServer] = useState<string>(servers[0]?.url || '');

  // Group parameters by location
  const pathParams = parameters.filter((p) => p.in === 'path');
  const queryParams = parameters.filter((p) => p.in === 'query');
  const headerParams = parameters.filter((p) => p.in === 'header');

  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      setSelectedServer(servers[0].url);
    }
  }, [servers]);

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
          if (tokenList.length > 0) {
            setSelectedToken(tokenList[0].usage.plain_text_token);
          }
        } catch (err) {
          console.error('Failed to fetch tokens:', err);
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
    setSelectedToken(value);
    if (value) {
      setMockMode(false);
    }
  };

  const handleManualTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualToken(e.target.value);
    setMockMode(false);
  };

  const handleMockModeChange = (checked: boolean) => {
    setMockMode(checked);
    if (checked) {
      if (selectedToken === 'manual') {
        setSelectedToken('');
      }
    }
  };

  const executeRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = performance.now();

    try {
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

      if (queryString) {
        url += `?${queryString}`;
      }

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (selectedToken === 'manual' && manualToken) {
        headers['Authorization'] = `Bearer ${manualToken}`;
      } else if (selectedToken && selectedToken !== 'manual') {
        headers['Authorization'] = `Bearer ${selectedToken}`;
      }

      headerParams.forEach((param) => {
        if (paramValues[param.name]) {
          headers[param.name] = paramValues[param.name];
        }
      });

      if (mockMode) {
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1000));

        // Try to find a success response (200 or 2XX)
        const successCode = Object.keys(responses).find((code) => code.startsWith('2'));
        let mockData: any = null;

        if (successCode) {
          const responseDef = responses[successCode];
          const content = responseDef.content?.['application/json'];

          if (content) {
            if (content.example) {
              mockData = content.example;
            } else if (content.schema) {
              mockData = generateMockFromSchema(content.schema);
            }
          }
        }

        // Fallback if no schema/example found
        if (!mockData) {
          mockData = {
            success: true,
            message: 'Mock response from API Hub (No schema found)',
            data: {
              id: 'mock-id-123',
              timestamp: new Date().toISOString(),
              request: {
                path: url,
                method: method.toUpperCase(),
                headers: {
                  ...headers,
                  Authorization: headers.Authorization ? 'Bearer [HIDDEN]' : undefined,
                },
                params: paramValues,
              },
            },
          };
        }

        setResponse({
          status: parseInt(successCode || '200'),
          statusText: 'OK',
          headers: {
            'content-type': 'application/json',
            'x-powered-by': 'PicNode API Hub (Mock)',
          },
          data: mockData,
          time: Math.round(performance.now() - startTime),
        });
      } else {
        // Real API Call
        // Construct full URL using selectedServer
        let fetchUrl = url;

        if (selectedServer) {
          // Remove trailing slash from server and leading slash from url to avoid double slashes
          const baseUrl = selectedServer.replace(/\/$/, '');
          const pathUrl = url.startsWith('/') ? url : `/${url}`;
          fetchUrl = `${baseUrl}${pathUrl}`;
        } else if (!url.startsWith('http')) {
          // Fallback logic if no server selected (shouldn't happen if servers exist)
          if (!url.startsWith('/api')) {
            fetchUrl = `/api${url}`;
          }
        }

        const res = await fetch(fetchUrl, {
          method: method.toUpperCase(),
          headers: headers,
        });

        const data = await res.json().catch(() => null); // Handle non-JSON responses

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isLiveMode = !mockMode && (!!selectedToken || !!manualToken);

  return (
    <div
      className={cn(
        'border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden mt-4 transition-colors duration-300',
        isLiveMode && 'border-emerald-500/50 shadow-emerald-500/10',
      )}
    >
      <div
        className={cn(
          'p-4 border-b bg-muted/30 flex items-center justify-between flex-wrap gap-4 transition-colors duration-300',
          isLiveMode && 'bg-emerald-500/5 border-emerald-500/20',
        )}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">API Playground</h3>
          {isLiveMode ? (
            <Badge
              variant="default"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-500"
            >
              LIVE
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Server Selector */}
          {servers.length > 0 && (
            <div className="w-[200px]">
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Server" />
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
          )}

          <div className="h-4 w-px bg-border hidden sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Lock
                className={cn('h-3 w-3 text-muted-foreground', isLiveMode && 'text-emerald-600')}
              />
              <div className="flex flex-col gap-2">
                <div className="w-[200px]">
                  <Select
                    value={selectedToken}
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
                        placeholder={loadingTokens ? 'Loading tokens...' : 'Select a token'}
                      />
                    </SelectTrigger>
                    <SelectContent>
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
                        </SelectItem>
                      ))}
                      <SelectItem value="manual" className="text-xs font-medium border-t mt-1 pt-1">
                        Enter token manually...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedToken === 'manual' && (
                  <Input
                    placeholder="Paste your token here"
                    value={manualToken}
                    onChange={handleManualTokenChange}
                    className={cn(
                      'h-8 text-xs w-[200px]',
                      isLiveMode && 'border-emerald-500 focus-visible:ring-emerald-500',
                    )}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Login to use tokens
            </div>
          )}
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Label htmlFor="mock-mode" className="text-sm cursor-pointer">
              Mock Mode
            </Label>
            <Switch id="mock-mode" checked={mockMode} onCheckedChange={handleMockModeChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x">
        {/* Request Configuration Panel */}
        <div className="lg:col-span-2 p-4 space-y-6 bg-muted/10">
          <div className="space-y-4">
            {pathParams.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Path Parameters
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
                  Query Parameters
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
                  Headers
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
                No parameters required for this endpoint.
              </div>
            )}
          </div>

          <Button className="w-full" onClick={executeRequest} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Send Request
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
              <p>Configure parameters and click "Send Request" to see the response.</p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Request Failed</h4>
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
                      Response Body
                    </TabsTrigger>
                    <TabsTrigger
                      value="headers"
                      className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 text-xs uppercase tracking-wider"
                    >
                      Headers
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
