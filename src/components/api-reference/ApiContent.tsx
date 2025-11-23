import { ApiItem } from './ApiSidebar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Activity,
  Globe,
  Server,
  AlertCircle,
  Sparkles,
  Flag,
  Code2,
  Shield,
  MapPinCheck,
  Building2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as SwaggerParser from '@readme/openapi-parser';
import { ResponseViewer } from './ResponseViewer';
import { ApiPlayground } from './ApiPlayground';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

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

const iconMap: Record<string, any> = {
  Sparkles: Sparkles,
  Flag: Flag,
  Shield: Shield,
  MapPinCheck: MapPinCheck,
  Building2: Building2,
};

export const ApiContent = ({ api }: ApiContentProps) => {
  const { t } = useTranslation();
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
          <p>{t('apiContent.loadingSpec')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('apiContent.error')}</AlertTitle>
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

  const Icon = iconMap[api.icon] || Flag;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className={cn('rounded-xl p-8 text-white shadow-lg bg-gradient-to-r', api.color)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{api.name}</h1>
              <p className="text-white/90 text-lg max-w-2xl">{api.description}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="text-sm px-3 py-1 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
          >
            {api.availability.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 text-sm font-medium text-white/90">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Activity className="h-4 w-4" />
            <span>
              {t('apiContent.uptime')}: {api.statistics.uptime}%
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Globe className="h-4 w-4" />
            <span>
              {api.statistics.activeUsers.toLocaleString()} {t('apiContent.activeUsers')}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Server className="h-4 w-4" />
            <span>
              {api.statistics.totalRequests.toLocaleString()} {t('apiContent.requests')}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Clock className="h-4 w-4" />
            <span>
              {t('apiContent.updated')}: {new Date(api.updated_at).toLocaleDateString()}
            </span>
          </div>
          {api.features.languages && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
              <Code2 className="h-4 w-4" />
              <span>{api.features.languages.split(',').join(', ')}</span>
            </div>
          )}
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
            {t('apiContent.endpoints')}
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            {t('apiContent.pricing')}
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            {t('apiContent.details')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="mt-6 space-y-6">
          {apiPaths.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('apiContent.noEndpoints')}
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
                        {details.description || details.summary || t('apiContent.noDescription')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <Tabs defaultValue="docs" className="w-full">
                        <div className="flex items-center justify-between border-b pb-2 mb-4">
                          <TabsList className="h-9 bg-muted/50 p-1">
                            <TabsTrigger
                              value="docs"
                              className="text-xs uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                              {t('apiContent.documentation')}
                            </TabsTrigger>
                            <TabsTrigger
                              value="playground"
                              className="text-xs uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                              {t('apiContent.tryItOut')}
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        <TabsContent value="docs" className="space-y-6 mt-0">
                          {/* Parameters */}
                          {details.parameters && details.parameters.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                                {t('apiContent.parameters')}
                              </h3>
                              <div className="rounded-md border overflow-hidden">
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                      <th className="p-3 font-medium">{t('apiContent.name')}</th>
                                      <th className="p-3 font-medium">{t('apiContent.in')}</th>
                                      <th className="p-3 font-medium">{t('apiContent.type')}</th>
                                      <th className="p-3 font-medium">
                                        {t('apiContent.description')}
                                      </th>
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
                                {t('apiContent.responses')}
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
                        </TabsContent>

                        <TabsContent value="playground" className="mt-0">
                          <ApiPlayground
                            path={path}
                            method={method}
                            parameters={details.parameters}
                            servers={spec?.servers}
                            responses={details.responses}
                          />
                        </TabsContent>
                      </Tabs>
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
              <CardTitle>{t('apiContent.pricingModel')}</CardTitle>
              <CardDescription>{t('apiContent.pricingDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('apiContent.basePrice')}
                  </div>
                  <div className="text-2xl font-bold mt-1">${api.pricing.basePrice}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('apiContent.perRequest')}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('apiContent.priceFactor')}
                  </div>
                  <div className="text-2xl font-bold mt-1">x{api.pricing.priceFactor}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('apiContent.multiplier')}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('apiContent.rateLimit')}
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {api.availability.rateLimit.requestsPerMinute}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{t('apiContent.reqMin')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('apiContent.additionalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">{t('apiContent.constructionStatus')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">{t('apiContent.status')}</span>
                      <span>
                        {api.construction.inConstruction
                          ? t('apiContent.inConstruction')
                          : t('apiContent.complete')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">{t('apiContent.progress')}</span>
                      <span>{api.construction.progress}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">{t('apiContent.estCompletion')}</span>
                      <span>{api.construction.estimatedCompletion}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('apiContent.features')}</h4>
                  <div className="space-y-2 text-sm">
                    {api.features.languages && (
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">{t('apiContent.languages')}</span>
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
