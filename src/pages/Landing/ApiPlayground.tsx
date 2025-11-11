import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Flag, Sparkles, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { availableApis } from '@/lib/apis';
import { 
  picnodeService, 
  type PlaceResource, 
  type FootballClubResource, 
  type ThingIcoResource,
  type MediaResource
} from '@/services/picnodeService';
import { useDebounce } from '@/hooks/use-debounce';

interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
}

const ApiPlayground = () => {
  const { t } = useTranslation();
  const [selectedApi, setSelectedApi] = useState<string>('api.places');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const getMediaUrl = (media: MediaResource | MediaResource[] | null | undefined): string => {
    if (!media) return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop';
    
    if (Array.isArray(media)) {
      if (media.length === 0) return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop';
      const firstMedia = media[0];
      return firstMedia.conversions?.md || firstMedia.conversions?.sm || firstMedia.url;
    }
    
    return media.conversions?.md || media.conversions?.sm || media.url;
  };

  const fetchAssets = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch || undefined,
        page,
        has_media: true,
        media_conversions: 'sm,md,lg',
      };

      let response;
      let transformedAssets: Asset[] = [];

      if (selectedApi === 'api.places') {
        response = await picnodeService.getPlaces(params);
        transformedAssets = response.data.map((place: PlaceResource) => ({
          id: place.id.toString(),
          name: place.name,
          image: getMediaUrl(place.media),
          type: place.type,
        }));
      } else if (selectedApi === 'api.football-clubs') {
        response = await picnodeService.getFootballClubs(params);
        transformedAssets = response.data.map((club: FootballClubResource) => ({
          id: club.id.toString(),
          name: club.name,
          image: getMediaUrl(club.media),
          type: 'club',
        }));
      } else if (selectedApi === 'api.thing-icos') {
        response = await picnodeService.getThingIcos(params);
        transformedAssets = response.data.map((ico: ThingIcoResource) => ({
          id: ico.id.toString(),
          name: ico.title,
          image: getMediaUrl(ico.media),
          type: 'icon',
        }));
      }

      setAssets(transformedAssets);
      setTotalPages(response?.meta.last_page || 1);
      setCurrentPage(response?.meta.current_page || 1);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchAssets(1);
  }, [selectedApi, debouncedSearch]);

  const handleApiChange = (apiId: string) => {
    setSelectedApi(apiId);
    setSearchTerm('');
  };

  const handlePageChange = (page: number) => {
    fetchAssets(page);
  };

  const getApiIcon = (apiId: string) => {
    if (apiId === 'api.thing-icos') return Sparkles;
    if (apiId === 'api.places') return MapPin;
    if (apiId === 'api.football-clubs') return Flag;
    return MapPin;
  };

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

          {/* API Selector */}
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
                  <div className={`absolute inset-0 bg-gradient-to-r ${api.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                  <Icon className="w-4 h-4 mr-2" />
                  {api.name}
                </Button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : assets.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {assets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    viewport={{ once: true }}
                  >
                    <Card className="group cursor-pointer overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-foreground font-semibold text-sm truncate">
                            {asset.name}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            {asset.type}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {t('playground.previous')}
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {t('playground.next')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('playground.noResults')}</p>
            </div>
          )}

          {/* Info Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('playground.info')}
            </p>
          </div>
        </motion.div>

        {/* API Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {availableApis.map((api, index) => {
            const Icon = getApiIcon(api.id);
            const isActive = selectedApi === api.id;
            
            return (
              <div
                key={api.id}
                className={`relative group p-6 rounded-xl border transition-all duration-300 ${
                  isActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-card/50 hover:border-primary/30'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${api.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${api.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{api.name}</h3>
                  <p className="text-sm text-muted-foreground">{api.description}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('playground.basePrice')}</span>
                      <span className="font-semibold">${api.basePrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ApiPlayground;
