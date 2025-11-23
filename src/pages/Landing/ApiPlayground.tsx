// src/components/ApiPlayground.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Flag,
  Sparkles,
  Building2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  Box,
  Globe,
  Shield,
  MapPinCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppContext } from '@/contexts/AppContext';
import { usePicnodeContext } from '@/contexts/PicnodeContext';
import useEmblaCarousel from 'embla-carousel-react';

import PlaceCard from '@/components/PlaceCard';
import DefaultCard from '@/components/DefaultCard';
import ImageModal from '@/components/ImageModal';
import { MultilingualBadge } from '@/components/MultilingualBadge';
import { AssetDetailModal } from '@/components/AssetDetailModal';

interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
  raw?: any;
}

const iconMap: { [key: string]: LucideIcon } = {
  Flag,
  MapPin,
  Box,
  Sparkles,
  Building2,
  Globe,
  Shield,
  MapPinCheck,
};

const AssetSkeleton = ({ variant }: { variant: 'place' | 'default' }) => (
  <Card className="overflow-hidden border-border">
    <Skeleton
      className={
        variant === 'place' ? 'h-[120px] w-auto min-w-[220px]' : 'aspect-square w-full h-[120px]'
      }
    />
  </Card>
);

const SkeletonGrid = ({
  variant,
  count = 15,
}: {
  variant: 'place' | 'default';
  count?: number;
}) => (
  <div className="flex gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`flex-shrink-0 ${variant === 'place' ? 'min-w-[220px]' : 'w-[150px]'}`}
      >
        <AssetSkeleton variant={variant} />
      </div>
    ))}
  </div>
);

const InlineLoader = () => (
  <div className="flex-shrink-0 w-[120px] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const ApiPlayground = () => {
  const { t } = useTranslation();
  const { apis } = useAppContext();
  const {
    selectedApi,
    setSelectedApi,
    searchTerm,
    setSearchTerm,
    assets,
    loading,
    loadingMore,
    hasMore,
    loadMore,
  } = usePicnodeContext();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt?: string;
  } | null>(null);

  const [assetDetailOpen, setAssetDetailOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const openModal = (src: string, alt?: string) => {
    setModalImage({ src, alt });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const openAssetDetail = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetDetailOpen(true);
  };

  const closeAssetDetail = () => {
    setAssetDetailOpen(false);
    setSelectedAsset(null);
  };

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const scrollProgress = emblaApi.scrollProgress();
    if (scrollProgress > 0.8 && hasMore && !loadingMore) loadMore();
  }, [emblaApi, hasMore, loadingMore, loadMore]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    onScroll();
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect, onScroll]);

  const handleApiChange = (apiId: string) => {
    setSelectedApi(apiId);
    setSearchTerm('');
  };

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const getApiIcon = (apiId: string) => {
    const api = apis.find((a) => a.slug === apiId);
    return iconMap[api?.icon || 'Box'] || Box;
  };

  const getVariant = (): 'place' | 'default' => {
    const api = apis.find((a) => a.slug === selectedApi);
    if (api?.slug === 'place') return 'place';
    return 'default';
  };

  const getCardWidth = (): string => {
    const api = apis.find((a) => a.slug === selectedApi);
    if (api?.slug === 'place') return 'min-w-[220px]';
    return 'w-[150px]';
  };

  const variant = getVariant();
  const cardWidth = getCardWidth();

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-accent/5 to-background overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('playground.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('playground.description')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {apis.map((api) => {
              const Icon = getApiIcon(api.slug);
              const isSelected = selectedApi === api.slug;
              const isMultilingual = api.features?.languages;

              return (
                <Button
                  key={api.id}
                  onClick={() => handleApiChange(api.slug)}
                  variant={isSelected ? 'default' : 'outline'}
                  className="group relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${api.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                  />
                  <Icon className="w-4 h-4 mr-2" />
                  {api.name}
                  {isMultilingual && (
                    <MultilingualBadge
                      className={`relative ${isSelected ? 'text-white' : 'text-black'}`}
                      languages={api.features.languages}
                    />
                  )}
                </Button>
              );
            })}
          </div>

          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('playground.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />

          {loading ? (
            <div className="overflow-hidden" ref={emblaRef}>
              <SkeletonGrid variant={variant} />
            </div>
          ) : assets.length > 0 ? (
            <div className="relative group">
              {canScrollPrev && (
                <button
                  onClick={scrollPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/95 backdrop-blur-sm border-2 border-primary shadow-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {canScrollNext && (
                <button
                  onClick={scrollNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/95 backdrop-blur-sm border-2 border-primary shadow-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              <div
                className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
                ref={emblaRef}
              >
                <div className="flex gap-3">
                  {assets.map((asset, index) => (
                    <motion.div
                      key={`${selectedApi}-${asset.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.02, 0.3),
                      }}
                      className={`flex-shrink-0 ${cardWidth}`}
                    >
                      {variant === 'place' ? (
                        <PlaceCard asset={asset} onOpen={() => openAssetDetail(asset)} />
                      ) : (
                        <DefaultCard asset={asset} onOpen={() => openAssetDetail(asset)} />
                      )}
                    </motion.div>
                  ))}
                  {loadingMore && <InlineLoader />}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('playground.noResults')}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">{t('playground.info')}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {apis.map((api) => {
            const Icon = getApiIcon(api.slug);
            const isActive = selectedApi === api.slug;

            return (
              <div
                key={api.id}
                className={`relative group p-4 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card/50 hover:border-primary/30'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${api.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-xl`}
                />
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${api.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {api.features?.languages && (
                      <MultilingualBadge languages={api.features.languages} />
                    )}
                  </div>

                  <h3 className="text-base font-semibold mb-1">{api.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-grow">
                    {api.description}
                  </p>

                  <div className="pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-0.5">Price</p>
                      <p className="font-medium">${api.pricing.basePrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Latency</p>
                      <p className="font-medium">{api.statistics.avgResponseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Uptime</p>
                      <p className="font-medium text-green-500">{api.statistics.uptime}%</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {modalOpen && modalImage && (
            <ImageModal src={modalImage.src} alt={modalImage.alt} onClose={closeModal} />
          )}
        </AnimatePresence>

        <AssetDetailModal
          asset={selectedAsset}
          open={assetDetailOpen}
          onOpenChange={setAssetDetailOpen}
        />
      </div>
    </section>
  );
};

export default ApiPlayground;
