import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Zap, Shield, Globe, Code, Copy, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Lightbox } from '@/components/Lightbox';

const BASE_URL = 'https://api.a2insights.com/api/picnode/places/assets';

const CONVERSIONS = ['xs', 'sm', 'md', 'lg', 'preview', 'thumbnail', 'webp', 'svg', 'png', 'jpg'];

const EXAMPLES = [
  { label: 'Por ID', path: '/api/picnode/places/assets/15' },
  { label: 'Por Código', path: '/api/picnode/places/assets/BR-SP' },
  { label: 'Por Slug', path: '/api/picnode/places/assets/rio-de-janeiro' },
  { label: 'Hierárquico', path: '/api/picnode/places/assets/brasil/sao-paulo/campinas' },
  { label: 'WebP', path: '/api/picnode/places/assets/brasil/sao-paulo/webp' },
  { label: 'Thumbnail', path: '/api/picnode/places/assets/BR-RJ/thumbnail' },
  { label: 'Tamanho LG', path: '/api/picnode/places/assets/15/lg' },
  { label: 'Preview', path: '/api/picnode/places/assets/foz-do-iguacu/preview' },
];

const SHOWCASE_ITEMS = [
  { name: 'Brasil', path: 'brasil' },
  { name: 'São Paulo', path: 'brasil/sao-paulo' },
  { name: 'Rio de Janeiro', path: 'brasil/rio-de-janeiro' },
  { name: 'Minas Gerais', path: 'brasil/minas-gerais' },
  { name: 'Bahia', path: 'brasil/bahia' },
  { name: 'Paraná', path: 'brasil/parana' },
  { name: 'Rio Grande do Sul', path: 'brasil/rio-grande-do-sul' },
  { name: 'Ceará', path: 'brasil/ceara' },
  { name: 'Santa Catarina', path: 'brasil/santa-catarina' },
  { name: 'Amazonas', path: 'brasil/amazonas' },
  { name: 'Pernambuco', path: 'brasil/pernambuco' },
  { name: 'Goiás', path: 'brasil/goias' },
];

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/30">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs">
          {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const PlacesApiPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages = SHOWCASE_ITEMS.map((item) => ({
    src: `${BASE_URL}/${item.path}/lg`,
    alt: item.name,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <MapPin className="w-3 h-3 mr-1" />
                Places API
              </Badge>
              <Badge variant="secondary" className="text-xs">Assets Endpoint</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              API de Assets <span className="text-primary">(Places)</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Endpoint de entrega de mídias de lugares. Bandeiras, brasões e identidades visuais via URL direta, servido por CDN.
            </p>

            <div className="bg-card border border-border rounded-xl p-4 font-mono text-sm">
              <span className="text-muted-foreground">GET</span>{' '}
              <span className="text-primary font-semibold">/api/picnode/places/assets/{'{path}'}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Bandeiras dos Estados Brasileiros
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
            {SHOWCASE_ITEMS.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="group cursor-pointer"
                onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
              >
                <div className="aspect-square rounded-xl border border-border bg-card/50 overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <img
                    src={`${BASE_URL}/${item.path}/md`}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs text-center mt-1 text-muted-foreground">{item.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use path */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            Como usar o parâmetro <code className="text-primary ml-1">{'{path}'}</code>
          </h2>

          <div className="space-y-8">
            {/* Direct identification */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  Identificação Direta
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Busque um asset usando o identificador único do lugar:
                </p>
                <div className="space-y-2">
                  {EXAMPLES.slice(0, 3).map((ex) => (
                    <div key={ex.path} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">{ex.label}</Badge>
                      <code className="text-xs font-mono text-primary">{ex.path}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hierarchical path */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  Caminho Hierárquico (SEO Friendly)
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Para evitar conflitos de nomes, use a hierarquia completa:
                </p>
                <div className="bg-muted/30 rounded-lg p-3">
                  <code className="text-xs font-mono text-primary">{EXAMPLES[3].path}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-3 bg-accent/10 rounded-lg p-3 border border-accent/20">
                  💡 A busca recursiva garante que você está pegando o asset do lugar exato dentro da árvore geográfica.
                </p>
              </CardContent>
            </Card>

            {/* Conversions */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  Conversões e Formatos
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Solicite uma versão específica adicionando o nome da conversão ao final:
                </p>
                <div className="space-y-2 mb-4">
                  {EXAMPLES.slice(4).map((ex) => (
                    <div key={ex.path} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">{ex.label}</Badge>
                      <code className="text-xs font-mono text-primary">{ex.path}</code>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {CONVERSIONS.map((c) => (
                    <Badge key={c} variant="outline" className="font-mono text-xs">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Code examples */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Exemplos de Código
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">HTML / Image Tag</h3>
              <CodeBlock
                language="html"
                code={`<img src="https://api.a2insights.com/api/picnode/places/assets/brasil/parana/curitiba/webp" 
     alt="Curitiba" 
     loading="lazy">`}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">JavaScript (Fetch)</h3>
              <CodeBlock
                language="javascript"
                code={`const response = await fetch(
  'https://api.a2insights.com/api/picnode/places/assets/BR-MG/preview'
);

if (response.ok) {
  const imageBlob = await response.blob();
  const imageObjectURL = URL.createObjectURL(imageBlob);
  document.querySelector("#myImage").src = imageObjectURL;
}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical details */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Detalhes Técnicos
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Cache & Performance</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Projetada para consumo via CDN (Cloudflare).
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Headers:</strong> Cache-Control: public, max-age=31536000, immutable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Streaming:</strong> Entrega via stream pipeline, URL S3 oculta</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Status de Resposta</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-green-500/10 rounded-lg p-3">
                    <Badge className="bg-green-600 text-white text-xs">200</Badge>
                    <span className="text-sm text-muted-foreground">Sucesso. Corpo = binário da imagem.</span>
                  </div>
                  <div className="flex items-center gap-3 bg-destructive/10 rounded-lg p-3">
                    <Badge variant="destructive" className="text-xs">404</Badge>
                    <span className="text-sm text-muted-foreground">Caminho inválido ou sem imagem vinculada.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Use sempre slugs em minúsculo e substitua espaços por hífens. A API faz essa normalização automaticamente ao buscar por nome.
          </div>
        </div>
      </section>

      <Footer />

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default PlacesApiPage;
