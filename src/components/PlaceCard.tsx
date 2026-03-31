import { motion } from 'framer-motion';

interface Asset {
  id: string;
  name: string;
  image: string;
}

interface PlaceItem {
  name: string;
  path: string;
}

interface PlaceCardProps {
  item?: PlaceItem;
  index?: number;
  baseUrl?: string;
  conversion?: string;
  onClick?: (index: number) => void;
  asset?: Asset;
  onOpen?: () => void;
}

export const PlaceCard = ({
  item,
  index = 0,
  baseUrl,
  conversion = 'md',
  onClick,
  asset,
  onOpen,
}: PlaceCardProps) => {
  const name = asset?.name || item?.name || '';
  const imageUrl = asset?.image || (item && baseUrl ? `${baseUrl}/${item.path}/${conversion}` : '');

  const handleClick = () => {
    if (onOpen) onOpen();
    else if (onClick) onClick(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 10) * 0.03, duration: 0.4 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[3/2] rounded-md border border-border bg-card/20 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-4 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
          <p className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider text-center truncate italic leading-none drop-shadow-sm">
            {name}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
