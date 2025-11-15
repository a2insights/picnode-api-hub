// src/components/ApiPlayground.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Flag,
  Sparkles,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { availableApis } from "@/lib/apis";
import {
  picnodeService,
  type PlaceResource,
  type FootballClubResource,
  type ThingIcoResource,
  type MediaResource,
} from "@/services/picnodeService";
import { useDebounce } from "@/hooks/use-debounce";
import useEmblaCarousel from "embla-carousel-react";

import PlaceCard from "@/components/PlaceCard";
import DefaultCard from "@/components/DefaultCard";
import ImageModal from "@/components/ImageModal";

interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
  raw?: any;
}

const AssetSkeleton = ({ variant }: { variant: "place" | "default" }) => (
  <Card className="overflow-hidden border-border">
    <Skeleton
      className={
        variant === "place"
          ? "h-[120px] w-auto min-w-[220px]"
          : "aspect-square w-full h-[120px]"
      }
    />
  </Card>
);

const SkeletonGrid = ({
  variant,
  count = 15,
}: {
  variant: "place" | "default";
  count?: number;
}) => (
  <div className="flex gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`flex-shrink-0 ${
          variant === "place" ? "min-w-[220px]" : "w-[150px]"
        }`}
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
  const [selectedApi, setSelectedApi] = useState<string>("api.places");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const currentApiRef = useRef<string>(selectedApi);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt?: string;
  } | null>(null);

  const openModal = (src: string, alt?: string) => {
    setModalImage({ src, alt });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const getMediaUrl = (
    media: MediaResource | MediaResource[] | null | undefined
  ): string => {
    const fallback =
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop";
    if (!media) return fallback;

    if (Array.isArray(media)) {
      if (media.length === 0) return fallback;
      const firstMedia = media[0];
      return (
        firstMedia.conversions?.preview ||
        firstMedia.conversions?.md ||
        firstMedia.url ||
        fallback
      );
    }

    return (
      media.conversions?.preview ||
      media.conversions?.md ||
      media.url ||
      fallback
    );
  };

  const fetchAssets = async (page = 1, append = false) => {
    const apiAtRequestTime = selectedApi;
    
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = {
        search: debouncedSearch || undefined,
        page,
        has_media: true,
        media_conversions: "sm,md,lg,preview",
      };

      let response: any;
      let transformedAssets: Asset[] = [];

      if (apiAtRequestTime === "api.places") {
        response = await picnodeService.getPlaces(params);
        transformedAssets = response.data.map((place: PlaceResource) => ({
          id: place.id.toString(),
          name: place.name,
          image: getMediaUrl(place.media),
          type: place.type,
          raw: place,
        }));
      } else if (apiAtRequestTime === "api.football-clubs") {
        response = await picnodeService.getFootballClubs(params);
        transformedAssets = response.data.map((club: FootballClubResource) => ({
          id: club.id.toString(),
          name: club.name,
          image: getMediaUrl(club.media),
          type: "club",
          raw: club,
        }));
      } else if (apiAtRequestTime === "api.thing-icos") {
        response = await picnodeService.getThingIcos(params);
        transformedAssets = response.data.map((ico: ThingIcoResource) => ({
          id: ico.id.toString(),
          name: ico.title,
          image: getMediaUrl(ico.media),
          type: "icon",
          raw: ico,
        }));
      }

      // Ignore response if API changed during request
      if (currentApiRef.current !== apiAtRequestTime) {
        return;
      }

      if (append) setAssets((prev) => [...prev, ...transformedAssets]);
      else setAssets(transformedAssets);

      const meta = response?.meta;
      setCurrentPage(meta?.current_page || 1);
      setHasMore((meta?.current_page || 1) < (meta?.last_page || 1));
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      // Only update loading state if we're still on the same API
      if (currentApiRef.current === apiAtRequestTime) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchAssets(currentPage + 1, true);
  }, [loadingMore, hasMore, currentPage]);

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
    currentApiRef.current = selectedApi;
    setCurrentPage(1);
    setAssets([]);
    setHasMore(true);
    setLoading(true);
    setLoadingMore(false);
    fetchAssets(1);
  }, [selectedApi, debouncedSearch]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    onScroll();
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, onScroll]);

  const handleApiChange = (apiId: string) => {
    setSelectedApi(apiId);
    setSearchTerm("");
  };

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const getApiIcon = (apiId: string) => {
    if (apiId === "api.thing-icos") return Sparkles;
    if (apiId === "api.places") return MapPin;
    if (apiId === "api.football-clubs") return Flag;
    return MapPin;
  };

  const getVariant = (): "place" | "default" => {
    if (selectedApi === "api.places") return "place";
    return "default";
  };

  const getCardWidth = (): string => {
    if (selectedApi === "api.places") return "min-w-[220px]";
    return "w-[150px]";
  };

  const variant = getVariant();
  const cardWidth = getCardWidth();

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-accent/5 to-background overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Título e busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t("playground.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t("playground.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {availableApis.map((api) => {
              const Icon = getApiIcon(api.id);
              const isSelected = selectedApi === api.id;

              return (
                <Button
                  key={api.id}
                  onClick={() => handleApiChange(api.id)}
                  variant={isSelected ? "default" : "outline"}
                  className="group relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${api.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                  />
                  <Icon className="w-4 h-4 mr-2" />
                  {api.name}
                </Button>
              );
            })}
          </div>

          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("playground.search")}
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
                className="overflow-hidden cursor-grab active:cursor-grabbing"
                ref={emblaRef}
              >
                <div className="flex gap-3">
                  {assets.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.02, 0.3),
                      }}
                      className={`flex-shrink-0 ${cardWidth}`}
                    >
                      {variant === "place" ? (
                        <PlaceCard
                          asset={asset}
                          onOpen={() => openModal(asset.image, asset.name)}
                        />
                      ) : (
                        <DefaultCard
                          asset={asset}
                          onOpen={() => openModal(asset.image, asset.name)}
                        />
                      )}
                    </motion.div>
                  ))}
                  {loadingMore && <InlineLoader />}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                {t("playground.noResults")}
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("playground.info")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {availableApis.map((api) => {
            const Icon = getApiIcon(api.id);
            const isActive = selectedApi === api.id;

            return (
              <div
                key={api.id}
                className={`relative group p-6 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card/50 hover:border-primary/30"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${api.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`}
                />
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${api.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{api.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {api.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("playground.basePrice")}
                      </span>
                      <span className="font-semibold">${api.basePrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {modalOpen && modalImage && (
            <ImageModal
              src={modalImage.src}
              alt={modalImage.alt}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ApiPlayground;
