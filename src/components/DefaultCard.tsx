// src/components/DefaultCard.tsx
import { Card } from "@/components/ui/card";

interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
  raw?: any;
}

const DefaultCard = ({
  asset,
  onOpen,
}: {
  asset: Asset;
  onOpen?: () => void;
}) => {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 h-full select-none"
      onClick={onOpen}
    >
      <div className="relative overflow-hidden h-[120px]">
        <img
          src={asset.image}
          alt={asset.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-foreground font-semibold text-xs truncate">
            {asset.name}
          </h3>
          {asset.type !== "company" && (
            <p className="text-muted-foreground text-[10px]">{asset.type}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DefaultCard;
