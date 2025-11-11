import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Fuse from 'fuse.js';
import docsContent from '@/data/docsContent.json';

interface SearchResult {
  page: string;
  pageTitle: string;
  sectionId: string;
  sectionTitle: string;
  content: string;
}

export const DocsSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Prepare search data
  const searchData: SearchResult[] = Object.entries(docsContent).flatMap(
    ([key, page]) => {
      const pageData = page as { title: string; slug: string; sections: any[] };
      return pageData.sections.map((section) => ({
        page: pageData.slug,
        pageTitle: pageData.title,
        sectionId: section.id,
        sectionTitle: section.title,
        content: section.content,
      }));
    }
  );

  const fuse = new Fuse(searchData, {
    keys: ['sectionTitle', 'content', 'pageTitle'],
    threshold: 0.3,
    includeScore: true,
  });

  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuse.search(query).slice(0, 5);
      setResults(searchResults.map((result) => result.item));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(`/docs/${result.page}#${result.sectionId}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 w-full"
        />
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full bg-background border shadow-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={`${result.page}-${result.sectionId}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      {result.sectionTitle}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {result.pageTitle}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {result.content.substring(0, 100)}...
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
