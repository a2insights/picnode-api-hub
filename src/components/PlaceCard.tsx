// src/components/PlaceCard.tsx
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
  raw?: any;
}

const PlaceCard = ({ asset, onOpen }: { asset: Asset; onOpen?: () => void }) => {
  return (
    <Card
      className="overflow-hidden cursor-pointer border-border hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full"
      onClick={onOpen}
    >
      <div className="relative w-full h-[240px]">
        <img
          src={asset.image}
          alt={asset.name}
          className="w-full h-full object-cover block"
          loading="lazy"
        />

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/90 to-transparent">
          <h3 className="text-foreground font-semibold text-xs truncate">{asset.name}</h3>
          <p className="text-muted-foreground text-[10px] truncate">{asset.type}</p>
        </div>
      </div>
    </Card>
  );
};

export default PlaceCard;
