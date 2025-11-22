import React from 'react';
import ReactJson from 'react-json-view';
import { useTheme } from '@/hooks/use-theme';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResponseViewerProps {
  code: string;
  response: any;
}

export const ResponseViewer = ({ code, response }: ResponseViewerProps) => {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const isSuccess = code.startsWith('2');
  const schema = response.content?.['application/json']?.schema;
  const example = response.content?.['application/json']?.example;

  const handleCopy = () => {
    const content = example ? JSON.stringify(example, null, 2) : JSON.stringify(schema, null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!schema && !example) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-3 p-3 border-b bg-muted/20">
          <Badge variant={isSuccess ? 'default' : 'destructive'} className="font-mono">
            {code}
          </Badge>
          <span className="text-sm font-medium text-foreground">{response.description}</span>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          No content available for this response.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <Badge variant={isSuccess ? 'default' : 'destructive'} className="font-mono">
            {code}
          </Badge>
          <span className="text-sm font-medium text-foreground">{response.description}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <Tabs defaultValue={example ? 'example' : 'schema'} className="w-full">
        <div className="border-b bg-muted/10 px-3">
          <TabsList className="h-9 bg-transparent p-0">
            {example && (
              <TabsTrigger
                value="example"
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 text-xs uppercase tracking-wider"
              >
                Example
              </TabsTrigger>
            )}
            {schema && (
              <TabsTrigger
                value="schema"
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 text-xs uppercase tracking-wider"
              >
                Schema
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {example && (
          <TabsContent value="example" className="m-0 p-0">
            <div className="relative">
              <ScrollArea className="h-[300px] w-full">
                <div className="p-4">
                  <ReactJson
                    src={example}
                    name={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={false}
                    collapsed={2}
                    theme={theme === 'dark' ? 'ocean' : 'rjv-default'}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        )}

        {schema && (
          <TabsContent value="schema" className="m-0 p-0">
            <div className="relative">
              <ScrollArea className="h-[300px] w-full">
                <div className="p-4">
                  <ReactJson
                    src={schema}
                    name={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={false}
                    collapsed={2}
                    theme={theme === 'dark' ? 'ocean' : 'rjv-default'}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
