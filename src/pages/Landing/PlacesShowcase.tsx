import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Lightbox } from '@/components/Lightbox';

// const BASE_URL = 'https://a2insights.com.br/api/picnode/places/assets';
const BASE_URL = 'http://localhost/api/picnode/places/assets';

interface PlaceItem {
  name: string;
  path: string;
  type: 'flag' | 'coat';
}

const BRAZIL_STATES: PlaceItem[] = [
  { name: 'Brasil', path: 'brasil', type: 'flag' },
  { name: 'São Paulo', path: 'brasil/sao-paulo/sao-paulo/bandeira', type: 'flag' },
  { name: 'Rio de Janeiro', path: 'brasil/rio-de-janeiro/rio-de-janeiro/bandeira', type: 'flag' },
  { name: 'Belo Horizonte', path: 'brasil/minas-gerais/belo-horizonte/bandeira', type: 'flag' },
  { name: 'Fortaleza', path: 'brasil/ceara/fortaleza/bandeira', type: 'flag' },
  { name: 'Salvador', path: 'brasil/bahia/salvador/bandeira', type: 'flag' },
  { name: 'Curitiba', path: 'brasil/parana/curitiba/bandeira', type: 'flag' },
  { name: 'Porto Alegre', path: 'brasil/rio-grande-do-sul/porto-alegre/bandeira', type: 'flag' },
  { name: 'Recife', path: 'brasil/pernambuco/recife/bandeira', type: 'flag' },
  { name: 'Manaus', path: 'brasil/amazonas/manaus/bandeira', type: 'flag' },
  { name: 'Florianópolis', path: 'brasil/santa-catarina/florianopolis/bandeira', type: 'flag' },
  { name: 'Goiânia', path: 'brasil/goias/goiania/bandeira', type: 'flag' },
  { name: 'Belém', path: 'brasil/para/belem/bandeira', type: 'flag' },
];

const BRAZIL_COATS: PlaceItem[] = [
  { name: 'Brasil', path: 'brasil/brasao', type: 'coat' },
  { name: 'São Paulo', path: 'brasil/sao-paulo/sao-paulo/brasao', type: 'coat' },
  { name: 'Rio de Janeiro', path: 'brasil/rio-de-janeiro/rio-de-janeiro/brasao', type: 'coat' },
  { name: 'Belo Horizonte', path: 'brasil/minas-gerais/belo-horizonte/brasao', type: 'coat' },
  { name: 'Fortaleza', path: 'brasil/ceara/fortaleza/brasao', type: 'coat' },
  { name: 'Salvador', path: 'brasil/bahia/salvador/brasao', type: 'coat' },
  { name: 'Curitiba', path: 'brasil/parana/curitiba/brasao', type: 'coat' },
  { name: 'Porto Alegre', path: 'brasil/rio-grande-do-sul/porto-alegre/brasao', type: 'coat' },
  { name: 'Recife', path: 'brasil/pernambuco/recife/brasao', type: 'coat' },
  { name: 'Manaus', path: 'brasil/amazonas/manaus/brasao', type: 'coat' },
  { name: 'Florianópolis', path: 'brasil/santa-catarina/florianopolis/brasao', type: 'coat' },
  { name: 'Goiânia', path: 'brasil/goias/goiania/brasao', type: 'coat' },
  { name: 'Belém', path: 'brasil/para/belem/brasao', type: 'coat' },
];

export const PlacesShowcase = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'flags' | 'coats'>('flags');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const items = activeTab === 'flags' ? BRAZIL_STATES : BRAZIL_COATS;

  const getImageUrl = (item: PlaceItem, conversion = 'lg') => {
    return `${BASE_URL}/${item.path}/${conversion}`;
  };

  const lightboxImages = items.map((item) => ({
    src: getImageUrl(item, 'lg'),
    alt: item.name,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_80%_50%,hsl(var(--primary)/0.06),transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1">
            <MapPin className="w-3 h-3 mr-1" />
            Places API
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('placesShowcase.title', 'Bandeiras & Brasões do Brasil')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              'placesShowcase.description',
              'Acesse bandeiras, brasões e identidades visuais de países, estados e cidades via URL direta. Sem autenticação, pronto para CDN.',
            )}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          <Button
            variant={activeTab === 'flags' ? 'default' : 'outline'}
            onClick={() => setActiveTab('flags')}
            className="rounded-full"
          >
            🏴 {t('placesShowcase.flags', 'Bandeiras')}
          </Button>
          <Button
            variant={activeTab === 'coats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('coats')}
            className="rounded-full"
          >
            🛡️ {t('placesShowcase.coats', 'Brasões')}
          </Button>
        </div>

        {/* Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-square rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <img
                  src={getImageUrl(item, 'md')}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                  <p className="text-xs font-medium text-center truncate">{item.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* URL demo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-10 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">
              {t('placesShowcase.howToUse', 'Como usar')}
            </span>
          </div>
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-4 md:p-6 font-mono text-xs md:text-sm border border-border/50">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground border-b border-border pb-2">
                <Globe className="w-3 h-3" />
                <span className="uppercase tracking-wider font-semibold text-[10px]">Endpoint Structure</span>
              </div>
              <code className="text-primary font-bold break-all leading-relaxed">
                /api/picnode/places/assets
                <span className="text-muted-foreground">/{'{país}'}</span>
                <span className="text-muted-foreground">/{'{estado}'}</span>
                <span className="text-muted-foreground">/{'{cidade}'}</span>
                <span className="text-primary/70">/{'{coleção}'}</span>
                <span className="text-primary/50">/{'{conversão}'}</span>
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold block uppercase text-[10px] text-muted-foreground">Localização</span>
                <p className="text-muted-foreground leading-relaxed">Caminho hierárquico amigável para SEO ou ID/Código.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold block uppercase text-[10px] text-muted-foreground">Coleções</span>
                <p className="text-muted-foreground leading-relaxed">brasao, bandeira, logo, cover ou default.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold block uppercase text-[10px] text-muted-foreground">Conversões</span>
                <p className="text-muted-foreground leading-relaxed">webp, svg, png, preview, lg, sm, xs.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            {t(
              'placesShowcase.cdnNote',
              'Servido via CDN Cloudflare • Cache imutável • Streaming direto',
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/places-api">
            <Button size="lg" className="rounded-full gap-2">
              {t('placesShowcase.viewDocs', 'Ver documentação completa')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
};
