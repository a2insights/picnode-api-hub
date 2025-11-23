import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileArchive, Image as ImageIcon, Info, Maximize2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import download from 'downloadjs';
import JSZip from 'jszip';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
  raw?: any;
}

interface AssetDetailModalProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssetDetailModal = ({ asset, open, onOpenChange }: AssetDetailModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('original');
  const [downloading, setDownloading] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  // Get media array or single object
  const getMediaArray = () => {
    if (!asset?.raw?.media) return [];
    return Array.isArray(asset.raw.media) ? asset.raw.media : [asset.raw.media];
  };

  const mediaArray = getMediaArray();
  const media = mediaArray[selectedMediaIndex] || null;
  const hasMultipleMedia = mediaArray.length > 1;

  // Detect available formats from all media items
  const getAvailableFormats = () => {
    if (mediaArray.length === 0) return [{ id: 'original', label: 'Original', ext: 'png' }];

    // Extract unique extensions from all media items
    const uniqueExtensions = new Set<string>();
    mediaArray.forEach((mediaItem) => {
      if (mediaItem.extension) {
        uniqueExtensions.add(mediaItem.extension.toLowerCase());
      }
    });

    // Convert to format objects
    const formats = Array.from(uniqueExtensions).map((ext) => ({
      id: ext,
      label: ext.toUpperCase(),
      ext: ext,
    }));

    return formats.length > 0 ? formats : [{ id: 'png', label: 'PNG', ext: 'png' }];
  };

  // Detect available sizes from conversions
  const getAvailableSizes = () => {
    // Use the first media item if media is null
    const currentMedia = media || (mediaArray.length > 0 ? mediaArray[0] : null);

    if (!currentMedia?.conversions || Object.keys(currentMedia.conversions).length === 0) {
      return [
        {
          id: 'original',
          label: 'Original',
          dimensions: 'Full Size',
          url: currentMedia?.url || asset?.image || '',
        },
      ];
    }

    const conversions = currentMedia.conversions;
    const sizes = [];

    // Map conversion keys to size info
    const sizeMap: Record<string, { label: string; dimensions: string }> = {
      sm: { label: 'Small', dimensions: '256x256' },
      md: { label: 'Medium', dimensions: '512x512' },
      lg: { label: 'Large', dimensions: '1024x1024' },
      preview: { label: 'Preview', dimensions: 'Preview Size' },
    };

    // Add available conversions
    Object.keys(conversions).forEach((key) => {
      if (sizeMap[key]) {
        // Use predefined mapping
        sizes.push({
          id: key,
          ...sizeMap[key],
          url: conversions[key],
        });
      } else {
        // Add any other conversion with capitalized label
        sizes.push({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          dimensions: 'Custom Size',
          url: conversions[key],
        });
      }
    });

    // Add original size
    sizes.push({
      id: 'original',
      label: 'Original',
      dimensions: 'Full Size',
      url: currentMedia.url || asset?.image || '',
    });

    return sizes;
  };

  const formats = getAvailableFormats();
  const sizes = getAvailableSizes();

  const handleDownload = async (format: string, sizeId: string) => {
    if (!asset) return;

    try {
      // Find the media item that matches the selected format
      const targetMedia = mediaArray.find(
        (m) => m.extension?.toLowerCase() === format.toLowerCase(),
      );

      if (!targetMedia) {
        toast.error('Media with selected format not found');
        return;
      }

      const formatExt = format;
      let downloadUrl = '';

      // Get the URL based on size
      if (sizeId === 'original') {
        downloadUrl = targetMedia.url;
      } else if (targetMedia.conversions && targetMedia.conversions[sizeId]) {
        downloadUrl = targetMedia.conversions[sizeId];
      } else {
        toast.error('Size not available for this format');
        return;
      }

      if (!downloadUrl) {
        toast.error('Download URL not available');
        return;
      }

      // Fetch the image as blob
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      // Download using downloadjs
      download(blob, `${asset.name}-${sizeId}.${formatExt}`, blob.type);

      toast.success(`Downloaded ${asset.name}-${sizeId}.${formatExt}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDownloadAll = async () => {
    if (!asset) return;

    setDownloading(true);
    toast.info('Preparing ZIP file...');

    try {
      const zip = new JSZip();

      // Download all format/size combinations from all media items
      for (const format of formats) {
        // Find the media item for this format
        const targetMedia = mediaArray.find(
          (m) => m.extension?.toLowerCase() === format.id.toLowerCase(),
        );

        if (!targetMedia) continue;

        // Add original size
        try {
          if (targetMedia.url) {
            const response = await fetch(targetMedia.url);
            const blob = await response.blob();
            zip.file(`${format.label}/${asset.name}-original.${format.ext}`, blob);
          }
        } catch (error) {
          console.error(`Failed to fetch ${format.id} original:`, error);
        }

        // Add all conversions
        if (targetMedia.conversions) {
          for (const [sizeKey, sizeUrl] of Object.entries(targetMedia.conversions)) {
            try {
              const response = await fetch(sizeUrl as string);
              const blob = await response.blob();
              zip.file(`${format.label}/${asset.name}-${sizeKey}.${format.ext}`, blob);
            } catch (error) {
              console.error(`Failed to fetch ${format.id} ${sizeKey}:`, error);
            }
          }
        }
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Download ZIP
      download(zipBlob, `${asset.name}-all-formats.zip`, 'application/zip');

      toast.success('ZIP file downloaded successfully!');
    } catch (error) {
      console.error('ZIP creation failed:', error);
      toast.error('Failed to create ZIP file');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {asset && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{asset.name}</DialogTitle>
            </DialogHeader>

            {/* Media Type Selector */}
            {hasMultipleMedia && (
              <div className="flex gap-2 flex-wrap">
                {mediaArray.map((mediaItem, index) => (
                  <Button
                    key={index}
                    variant={selectedMediaIndex === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMediaIndex(index)}
                    className="capitalize"
                  >
                    {mediaItem.type?.replace(/_/g, ' ') || `Media ${index + 1}`}
                  </Button>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview Section */}
              <div className="space-y-4">
                <Card className="p-4 bg-muted/20">
                  <div className="relative aspect-square bg-background rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={media?.url || asset.image}
                      alt={asset.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => window.open(media?.url || asset.image, '_blank')}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                {/* Media Information */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Media Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{asset.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono text-xs">{asset.id}</span>
                    </div>
                    {asset.raw?.country && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span>{asset.raw.country}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Download Options Section */}
              <div className="space-y-4">
                {/* Format Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Format</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {formats.map((format) => (
                      <Button
                        key={format.id}
                        variant={selectedFormat === format.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFormat(format.id)}
                        className="justify-start"
                      >
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Size Selection & Download */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Download Options</h3>
                  </div>
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <div
                        key={size.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{size.label}</p>
                          <p className="text-xs text-muted-foreground">{size.dimensions}</p>
                        </div>
                        <Button size="sm" onClick={() => handleDownload(selectedFormat, size.id)}>
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Download All as ZIP */}
                <Button
                  className="w-full"
                  size="lg"
                  variant="default"
                  onClick={handleDownloadAll}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating ZIP...
                    </>
                  ) : (
                    <>
                      <FileArchive className="w-4 h-4 mr-2" />
                      Download All Formats (ZIP)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
