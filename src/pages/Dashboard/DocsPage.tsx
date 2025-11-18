import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Zap, Shield, Book } from 'lucide-react';
import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DocsPage = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Code,
      title: 'Getting Started',
      description: 'Quick start guide to integrate PicNode APIs in your project.',
      url: '/docs/getting-started',
    },
    {
      icon: Zap,
      title: 'Best Practices',
      description: 'Tips and recommendations for optimal API usage.',
      url: '/docs/best-practices',
    },
    {
      icon: Shield,
      title: 'Authentication',
      description: 'Learn how to authenticate your requests securely.',
      url: '/docs/authentication',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.docs')}</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="api-reference">API Reference</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  
                  return (
                    <Link key={index} to={section.url} className="block">
                      <Card className="cursor-pointer hover:border-primary/50 transition-colors hover:shadow-lg h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">{section.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {section.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Example Request</h3>
                  <pre className="bg-card p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
{`curl -X GET "https://a2insights.com.br/api/places" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -H "Content-Type: application/json"`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api-reference" className="mt-0">
              <div className="rounded-lg overflow-hidden border border-border min-h-[600px]">
                <ApiReferenceReact
                  configuration={{
                    url: 'https://a2insights.com.br/docs/api.json',
                    theme: 'default',
                    hideModels: false,
                    hideDownloadButton: false,
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
