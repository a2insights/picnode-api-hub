import { Check, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePicnodeContext } from '@/contexts/PicnodeContext';
import { Input } from '@/components/ui/input';
import { AssetDetailModal } from '@/components/AssetDetailModal';

export const ImagePickerDemo = () => {
  const { assets, loading, searchTerm, setSearchTerm } = usePicnodeContext();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Take only the first 6 assets for the grid
  const displayAssets = assets.slice(0, 6);

  const handleSelectClick = () => {
    if (selectedId) {
      setModalOpen(true);
    }
  };

  const selectedAsset = assets.find((asset) => asset.id === selectedId) || null;

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets..."
            className="w-full h-9 pl-9 pr-3 bg-muted/50 border-transparent focus:bg-background transition-colors"
          />
        </div>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {loading ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <div className="h-4 w-4 rounded-full bg-primary" />
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-3 gap-3 min-h-[300px]">
        {loading && displayAssets.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
          ))
        ) : displayAssets.length > 0 ? (
          displayAssets.map((asset) => (
            <motion.div
              key={asset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedId(asset.id)}
              className={`
                aspect-square rounded-lg cursor-pointer relative group transition-all overflow-hidden bg-muted/30 flex items-center justify-center
                ${selectedId === asset.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : 'hover:opacity-90'}
              `}
            >
              <img
                src={asset.image}
                alt={asset.name}
                className="w-full h-full object-contain p-2"
              />

              {selectedId === asset.id && (
                <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center shadow-sm z-10">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center text-muted-foreground h-full">
            <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
            <span className="text-sm">No assets found</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
        <div className="text-xs text-muted-foreground">{assets.length} assets found</div>
        <div
          onClick={handleSelectClick}
          className={`h-8 px-4 text-sm font-medium rounded-md flex items-center transition-colors ${selectedId ? 'bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
        >
          Select
        </div>
      </div>

      <AssetDetailModal asset={selectedAsset} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};
