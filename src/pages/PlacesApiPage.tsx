import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Zap, Shield, Globe, Code, Copy, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { PlaceCard } from '@/components/PlaceCard';

const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost/api/picnode/places/assets'
    : 'https://a2insights.com.br/api/picnode/places/assets';
const COLLECTIONS = ['brasao', 'bandeira', 'logo', 'cover', 'default'];
const CONVERSIONS = ['xs', 'sm', 'md', 'lg', 'preview', 'thumbnail', 'webp', 'svg', 'png', 'jpg'];

const EXAMPLES_KEYS = [
  {
    labelKey: 'placesApi.hierarchicalLabel',
    path: '/api/picnode/places/assets/brasil/ceara/fortaleza/bandeira',
  },
  {
    labelKey: 'placesApi.collectionLabel',
    path: '/api/picnode/places/assets/brasil/sao-paulo/sao-paulo/brasao',
  },
  {
    labelKey: 'placesApi.webpLabel',
    path: '/api/picnode/places/assets/brasil/sao-paulo/sao-paulo/bandeira/preview',
  },
  {
    labelKey: 'placesApi.fullPathLabel',
    path: '/api/picnode/places/assets/brasil/minas-gerais/belo-horizonte/brasao/lg',
  },
];

const SHOWCASE_ITEMS = [
  { name: 'Brasil', path: 'brasil/bandeira' },
  { name: 'Aracaju', path: 'brasil/sergipe/aracaju/bandeira' },
  { name: 'Belém', path: 'brasil/para/belem/bandeira' },
  { name: 'Belo Horizonte', path: 'brasil/minas-gerais/belo-horizonte/bandeira' },
  { name: 'Boa Vista', path: 'brasil/roraima/boa-vista/bandeira' },
  { name: 'Brasília', path: 'brasil/distrito-federal/brasilia/bandeira' },
  { name: 'Campo Grande', path: 'brasil/mato-grosso-do-sul/campo-grande/bandeira' },
  { name: 'Cuiabá', path: 'brasil/mato-grosso/cuiaba/bandeira' },
  { name: 'Curitiba', path: 'brasil/parana/curitiba/bandeira' },
  { name: 'Florianópolis', path: 'brasil/santa-catarina/florianopolis/bandeira' },
  { name: 'Fortaleza', path: 'brasil/ceara/fortaleza/bandeira' },
  { name: 'Goiânia', path: 'brasil/goias/goiania/bandeira' },
  { name: 'João Pessoa', path: 'brasil/paraiba/joao-pessoa/bandeira' },
  { name: 'Macapá', path: 'brasil/amapa/macapa/bandeira' },
  { name: 'Maceió', path: 'brasil/alagoas/maceio/bandeira' },
  { name: 'Manaus', path: 'brasil/amazonas/manaus/bandeira' },
  { name: 'Natal', path: 'brasil/rio-grande-do-norte/natal/bandeira' },
  { name: 'Palmas', path: 'brasil/tocantins/palmas/bandeira' },
  { name: 'Porto Alegre', path: 'brasil/rio-grande-do-sul/porto-alegre/bandeira' },
  { name: 'Porto Velho', path: 'brasil/rondonia/porto-velho/bandeira' },
  { name: 'Recife', path: 'brasil/pernambuco/recife/bandeira' },
  { name: 'Rio Branco', path: 'brasil/acre/rio-branco/bandeira' },
  { name: 'Rio de Janeiro', path: 'brasil/rio-de-janeiro/rio-de-janeiro/bandeira' },
  { name: 'Salvador', path: 'brasil/bahia/salvador/bandeira' },
  { name: 'São Luís', path: 'brasil/maranhao/sao-luis/bandeira' },
  { name: 'São Paulo', path: 'brasil/sao-paulo/sao-paulo/bandeira' },
  { name: 'Teresina', path: 'brasil/piaui/teresina/bandeira' },
  { name: 'Vitória', path: 'brasil/espirito-santo/vitoria/bandeira' },
];

const CodeBlock = ({
  code,
  language = 'bash',
  t,
}: {
  code: string;
  language?: string;
  t: (key: string) => string;
}) => {
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
          {copied ? t('placesApi.copied') : t('placesApi.copy')}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const PlacesApiPage = () => {
  const { t } = useTranslation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages = SHOWCASE_ITEMS.map((item) => ({
    src: `${BASE_URL}/${item.path}/preview`,
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
              <Badge variant="secondary" className="text-xs">
                Assets Endpoint
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('placesApi.heroTitle')}{' '}
              <span className="text-primary">{t('placesApi.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">{t('placesApi.heroDescription')}</p>

            <div className="bg-card border border-border rounded-xl p-4 font-mono text-sm">
              <span className="text-muted-foreground">GET</span>{' '}
              <span className="text-primary font-semibold">
                /api/picnode/places/assets/{'{path}'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            {t('placesApi.showcaseTitle')}
          </h2>
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3 mb-10">
            {SHOWCASE_ITEMS.map((item, index) => (
              <PlaceCard
                key={item.path}
                item={item}
                index={index}
                baseUrl={BASE_URL}
                onClick={(idx) => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How to use path */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            {t('placesApi.howToUseParam')} <code className="text-primary ml-1">{'{path}'}</code>
          </h2>

          <div className="space-y-8">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  {t('placesApi.directId')}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">{t('placesApi.directIdDesc')}</p>
                <div className="space-y-2">
                  {EXAMPLES_KEYS.slice(0, 3).map((ex) => (
                    <div
                      key={ex.path}
                      className="flex items-center gap-3 bg-muted/30 rounded-lg p-3"
                    >
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {t(ex.labelKey)}
                      </Badge>
                      <code className="text-xs font-mono text-primary">{ex.path}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  {t('placesApi.hierarchical')}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {t('placesApi.hierarchicalDesc')}
                </p>
                <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
                  <div className="bg-muted/50 px-3 py-1.5 border-b border-border text-[10px] uppercase font-bold text-muted-foreground">
                    URL Structure
                  </div>
                  <div className="p-3">
                    <code className="text-xs font-mono text-primary break-all">
                      /assets/{'{path}'}/{'{collection?}'}/{'{conversion?}'}
                    </code>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {EXAMPLES_KEYS.slice(3, 5).map((ex) => (
                    <div
                      key={ex.path}
                      className="flex items-center gap-3 bg-muted/30 rounded-lg p-3"
                    >
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {t(ex.labelKey)}
                      </Badge>
                      <code className="text-xs font-mono text-primary">{ex.path}</code>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 bg-accent/10 rounded-lg p-3 border border-accent/20">
                  💡 {t('placesApi.hierarchicalTip')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  {t('placesApi.collections')}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {t('placesApi.collectionsDesc')}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {COLLECTIONS.map((c) => (
                    <Badge key={c} variant="secondary" className="font-mono text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      Exemplo
                    </Badge>
                    <code className="text-xs font-mono text-primary">{EXAMPLES_KEYS[4].path}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  {t('placesApi.conversions')}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {t('placesApi.conversionsDesc')}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CONVERSIONS.map((c) => (
                    <Badge key={c} variant="outline" className="font-mono text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  {EXAMPLES_KEYS.slice(5).map((ex) => (
                    <div
                      key={ex.path}
                      className="flex items-center gap-3 bg-muted/30 rounded-lg p-3"
                    >
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {t(ex.labelKey)}
                      </Badge>
                      <code className="text-xs font-mono text-primary">{ex.path}</code>
                    </div>
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
            {t('placesApi.codeExamples')}
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">HTML / Image Tag</h3>
              <CodeBlock
                t={t}
                language="html"
                code={`<img src="https://a2insights.com.br/api/picnode/places/assets/brasil/parana/curitiba/webp" 
     alt="Curitiba" 
     loading="lazy">`}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                JavaScript (Fetch)
              </h3>
              <CodeBlock
                t={t}
                language="javascript"
                code={`const response = await fetch(
  'https://a2insights.com.br/api/picnode/places/assets/BR-MG/preview'
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
            {t('placesApi.technicalDetails')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">{t('placesApi.cacheTitle')}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t('placesApi.cacheDesc')}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Headers:</strong> {t('placesApi.cacheHeaders')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Streaming:</strong> {t('placesApi.cacheStreaming')}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">{t('placesApi.responseTitle')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-primary/10 rounded-lg p-3">
                    <Badge className="bg-primary text-primary-foreground text-xs">200</Badge>
                    <span className="text-sm text-muted-foreground">
                      {t('placesApi.response200')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-destructive/10 rounded-lg p-3">
                    <Badge variant="destructive" className="text-xs">
                      404
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {t('placesApi.response404')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm text-muted-foreground">
            💡 <strong>{t('placesApi.tipLabel')}:</strong> {t('placesApi.tip')}
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
