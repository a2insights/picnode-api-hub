import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Book, Zap, Shield } from 'lucide-react';

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
      icon: Book,
      title: 'API Reference',
      description: 'Complete documentation of all available endpoints and parameters.',
      url: 'https://a2insights.com.br/docs/api',
      external: true,
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
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              
              const content = (
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
              );

              if (section.external) {
                return (
                  <a
                    key={index}
                    href={section.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={index} to={section.url!} className="block">
                  {content}
                </Link>
              );
            })}
          </div>

          <Card className="mt-6 bg-muted/30">
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
        </CardContent>
      </Card>
    </div>
  );
};
