import { ApiItem } from './ApiSidebar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Clock, Activity, Globe, Server, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as SwaggerParser from '@readme/openapi-parser';
import { ResponseViewer } from './ResponseViewer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ApiContentProps {
  api: ApiItem;
}

interface OpenApiSpec {
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
  servers: { url: string }[];
}

export const ApiContent = ({ api }: ApiContentProps) => {
  const [spec, setSpec] = useState<OpenApiSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpec = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the spec first to avoid path resolution issues
        const response = await fetch('/api.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch API spec: ${response.status} ${response.statusText}`);
        }
        const json = await response.json();

        // Use SwaggerParser to dereference the spec (resolve $refs)
        const parsed = await SwaggerParser.dereference(json);
        setSpec(parsed as unknown as OpenApiSpec);
      } catch (err) {
        console.error('Failed to load API spec:', err);
        setError(err instanceof Error ? err.message : 'Failed to load API specification');
      } finally {
        setLoading(false);
      }
    };

    loadSpec();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p>Loading API specification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Filter paths based on the API slug/endpoint mapping
  const apiPaths = spec
    ? Object.entries(spec.paths).filter(([path]) => {
        return Object.values(api.endpoints).some((endpoint) => path.includes(endpoint as string));
      })
    : [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{api.name}</h1>
            <p className="text-muted-foreground text-lg">{api.description}</p>
          </div>
          <Badge
            variant={api.availability.status === 'Available' ? 'default' : 'secondary'}
            className="text-sm px-3 py-1"
          >
            {api.availability.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
            <Activity className="h-4 w-4 text-green-500" />
            <span>Uptime: {api.statistics.uptime}%</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
            <Globe className="h-4 w-4 text-blue-500" />
            <span>{api.statistics.activeUsers.toLocaleString()} Active Users</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
            <Server className="h-4 w-4 text-purple-500" />
            <span>{api.statistics.totalRequests.toLocaleString()} Requests</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>Updated: {new Date(api.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content Tabs */}
      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="endpoints"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Endpoints
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Pricing
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="mt-6 space-y-6">
          {apiPaths.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No endpoints found for this API.
            </div>
          ) : (
            apiPaths.map(([path, methods]) => (
              <div key={path} className="space-y-4">
                {Object.entries(methods).map(([method, details]: [string, any]) => (
                  <Card
                    key={`${path}-${method}`}
                    className="overflow-hidden border-l-4 border-l-primary"
                  >
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="uppercase font-bold bg-primary/10 text-primary border-primary/20"
                        >
                          {method}
                        </Badge>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{path}</code>
                      </div>
                      <CardDescription className="mt-2 text-base">
                        {details.description || details.summary || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Parameters */}
                      {details.parameters && details.parameters.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Parameters
                          </h3>
                          <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                  <th className="p-3 font-medium">Name</th>
                                  <th className="p-3 font-medium">In</th>
                                  <th className="p-3 font-medium">Type</th>
                                  <th className="p-3 font-medium">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {details.parameters.map((param: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-muted/30">
                                    <td className="p-3 font-mono text-primary font-medium">
                                      {param.name}
                                      {param.required && (
                                        <span className="text-destructive ml-1">*</span>
                                      )}
                                    </td>
                                    <td className="p-3 text-muted-foreground">{param.in}</td>
                                    <td className="p-3 text-muted-foreground">
                                      {param.schema?.type || 'string'}
                                    </td>
                                    <td className="p-3">{param.description || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Responses */}
                      {details.responses && (
                        <div>
                          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Responses
                          </h3>
                          <div className="space-y-4">
                            {Object.entries(details.responses).map(
                              ([code, response]: [string, any]) => (
                                <ResponseViewer key={code} code={code} response={response} />
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Model</CardTitle>
              <CardDescription>Usage-based pricing for this API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground">Base Price</div>
                  <div className="text-2xl font-bold mt-1">${api.pricing.basePrice}</div>
                  <div className="text-xs text-muted-foreground mt-1">per request</div>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground">Price Factor</div>
                  <div className="text-2xl font-bold mt-1">x{api.pricing.priceFactor}</div>
                  <div className="text-xs text-muted-foreground mt-1">multiplier</div>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground">Rate Limit</div>
                  <div className="text-2xl font-bold mt-1">
                    {api.availability.rateLimit.requestsPerMinute}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">req/min</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Construction Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Status</span>
                      <span>
                        {api.construction.inConstruction ? 'In Construction' : 'Complete'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{api.construction.progress}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Est. Completion</span>
                      <span>{api.construction.estimatedCompletion}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="space-y-2 text-sm">
                    {api.features.languages && (
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Languages</span>
                        <span>{api.features.languages}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
