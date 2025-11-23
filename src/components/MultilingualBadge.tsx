import { Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MultilingualBadgeProps {
  languages: string;
}

interface MultilingualBadgeProps {
  className?: string;
}

export const MultilingualBadge = ({ languages, className }: MultilingualBadgeProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'text-xs gap-1 border-primary/20 text-primary bg-primary/5 cursor-help',
              className,
            )}
          >
            <Globe className="h-3 w-3" />
            Multilingual
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="w-auto p-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Supported Languages</p>
            <div className="flex items-center gap-2">
              {languages.split(',').map((lang: string) => {
                const flagMap: Record<string, string> = {
                  en: '🇬🇧',
                  es: '🇪🇸',
                  fr: '🇫🇷',
                  it: '🇮🇹',
                  pt: '🇵🇹',
                  de: '🇩🇪',
                  zh: '🇨🇳',
                  ja: '🇯🇵',
                  ru: '🇷🇺',
                  ko: '🇰🇷',
                };
                return (
                  <span
                    key={lang}
                    title={lang}
                    className="text-lg cursor-default hover:scale-125 transition-transform"
                  >
                    {flagMap[lang.trim()] || lang}
                  </span>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground border-t pt-2 mt-1">
              Pass <code className="bg-muted px-1 py-0.5 rounded">lang=es</code> to localize
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
