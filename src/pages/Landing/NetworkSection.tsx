import { ResponsiveTree } from '@nivo/tree';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Flag, Zap } from 'lucide-react';

const NetworkSection = () => {
  const { t } = useTranslation();

  const data = {
    id: 'ThingAPIs',
    name: 'ThingAPIs Platform',
    children: [
      {
        id: 'api.thing-icos',
        name: 'ThingIco API',
        type: 'Vectors',
        children: [
          { id: 'icons-1', name: '10k+ Icons' },
          { id: 'icons-2', name: 'SVG Format' },
          { id: 'icons-3', name: 'High Quality' },
        ],
      },
      {
        id: 'api.places',
        name: 'Places API',
        type: 'Images',
        children: [
          { id: 'places-1', name: 'Tourist Spots' },
          { id: 'places-2', name: 'World Coverage' },
          { id: 'places-3', name: 'HD Images' },
        ],
      },
      {
        id: 'api.football-clubs',
        name: 'Football Clubs API',
        type: 'Images',
        children: [
          { id: 'clubs-1', name: 'Global Clubs' },
          { id: 'clubs-2', name: 'Official Logos' },
          { id: 'clubs-3', name: 'Real-time Data' },
        ],
      },
    ],
  };

  const getNodeIcon = (node: any) => {
    if (node.id === 'api.thing-icos') return Sparkles;
    if (node.id === 'api.places') return MapPin;
    if (node.id === 'api.football-clubs') return Flag;
    return Zap;
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-accent/5 to-background overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('network.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('network.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 blur-3xl animate-pulse" />
          
          <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="h-[500px] md:h-[600px]">
              <ResponsiveTree
                data={data}
                identity="id"
                mode="tree"
                layout="top-to-bottom"
                linkCurve="step"
                enableLabel={true}
                label={(node) => node.data.name}
                labelOffset={12}
                orientLabel={false}
                nodeSize={12}
                activeNodeSize={24}
                inactiveNodeSize={8}
                linkThickness={2}
                activeLinkThickness={4}
                inactiveLinkThickness={1}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                motionConfig={{
                  mass: 1,
                  tension: 170,
                  friction: 26,
                  clamp: false,
                  precision: 0.01,
                  velocity: 0,
                }}
                theme={{
                  text: {
                    fill: 'hsl(var(--foreground))',
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif',
                  },
                  tooltip: {
                    container: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                      fontSize: '14px',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      padding: '12px 16px',
                      border: '1px solid hsl(var(--border))',
                    },
                  },
                }}
                nodeColor={(node) => {
                  if (node.depth === 0) return 'hsl(var(--primary))';
                  if (node.depth === 1) {
                    if (node.id === 'api.thing-icos') return '#a855f7';
                    if (node.id === 'api.places') return '#10b981';
                    if (node.id === 'api.football-clubs') return '#3b82f6';
                  }
                  return 'hsl(var(--accent))';
                }}
                linkColor={(link) => {
                  const opacity = link.target.depth === 1 ? '0.6' : '0.3';
                  return `hsl(var(--primary) / ${opacity})`;
                }}
                animate={true}
                isInteractive={true}
                useMesh={true}
                debugMesh={false}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: Sparkles,
                  title: 'ThingIco API',
                  description: t('network.api1'),
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  icon: MapPin,
                  title: 'Places API',
                  description: t('network.api2'),
                  gradient: 'from-green-500 to-emerald-500',
                },
                {
                  icon: Flag,
                  title: 'Football Clubs API',
                  description: t('network.api3'),
                  gradient: 'from-blue-500 to-cyan-500',
                },
              ].map((api, index) => {
                const Icon = api.icon;
                return (
                  <motion.div
                    key={api.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${api.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                    
                    <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${api.gradient} flex items-center justify-center mb-4 group-hover:animate-pulse`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{api.title}</h3>
                      <p className="text-sm text-muted-foreground">{api.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            {t('network.footer')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NetworkSection;