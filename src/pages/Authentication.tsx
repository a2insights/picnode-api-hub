import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import docsContent from '@/data/docsContent.json';

export const Authentication = () => {
  const location = useLocation();
  const { title, sections } = docsContent.authentication;

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <Badge variant="destructive" className="mb-4">Security</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to securely authenticate your API requests
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Never expose your API token in client-side code or public repositories. 
            Always make authenticated requests from your backend.
          </AlertDescription>
        </Alert>

        <Separator />

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                {section.title}
              </h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>

                {section.code && (
                  <Card className="bg-muted/30 border-border">
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm">{section.code}</code>
                    </pre>
                  </Card>
                )}
              </div>
            </section>
          ))}
        </div>

        <Card className="p-6 bg-accent/5 border-primary/20">
          <h3 className="font-semibold mb-3">On this page</h3>
          <nav className="space-y-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </Card>
      </div>
    </DocsLayout>
  );
};
