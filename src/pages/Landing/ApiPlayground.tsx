import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Flag, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { availableApis } from '@/lib/apis';

interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
}

const hardcodedAssets: Record<string, Asset[]> = {
  'api.places': [
    { id: '1', name: 'Torre Eiffel', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop', type: 'place' },
    { id: '2', name: 'Cristo Redentor', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop', type: 'place' },
    { id: '3', name: 'Grande Muralha', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop', type: 'place' },
    { id: '4', name: 'Machu Picchu', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop', type: 'place' },
    { id: '5', name: 'Taj Mahal', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop', type: 'place' },
    { id: '6', name: 'Coliseu', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop', type: 'place' },
    { id: '7', name: 'Petra', image: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=400&h=300&fit=crop', type: 'place' },
    { id: '8', name: 'Chichén Itzá', image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop', type: 'place' },
  ],
  'api.football-clubs': [
    { id: '1', name: 'Real Madrid', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop', type: 'club' },
    { id: '2', name: 'Barcelona', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop', type: 'club' },
    { id: '3', name: 'Manchester United', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop', type: 'club' },
    { id: '4', name: 'Bayern München', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop', type: 'club' },
    { id: '5', name: 'Liverpool', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop', type: 'club' },
    { id: '6', name: 'Juventus', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop', type: 'club' },
  ],
  'api.thing-icos': [
    { id: '1', name: 'Home Icon', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop', type: 'icon' },
    { id: '2', name: 'Settings Icon', image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop', type: 'icon' },
    { id: '3', name: 'User Icon', image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=300&fit=crop', type: 'icon' },
    { id: '4', name: 'Search Icon', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop', type: 'icon' },
    { id: '5', name: 'Cart Icon', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop', type: 'icon' },
    { id: '6', name: 'Heart Icon', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop', type: 'icon' },
  ],
};

const ApiPlayground = () => {
  const { t } = useTranslation();
  const [selectedApi, setSelectedApi] = useState<string>('api.places');
  const [assets, setAssets] = useState<Asset[]>(hardcodedAssets[selectedApi]);

  const handleApiChange = (apiId: string) => {
    setSelectedApi(apiId);
    setAssets(hardcodedAssets[apiId]);
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
          <div className="flex flex-wrap justify-center gap-4 mb-12">
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
        </motion.div>

        {/* Gallery Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {assets.map((asset, index) => (
                <CarouselItem key={asset.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Card className="group cursor-pointer overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-foreground font-semibold truncate">
                            {asset.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {asset.type}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm hover:bg-background border-border" />
            <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm hover:bg-background border-border" />
          </Carousel>

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
