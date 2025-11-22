import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  picnodeService,
  type PlaceResource,
  type FootballClubResource,
  type ThingIcoResource,
  type CompanyResource,
  type MediaResource,
} from "@/services/picnodeService";
import { useDebounce } from "@/hooks/use-debounce";

export interface Asset {
  id: string;
  name: string;
  image: string;
  type: string;
  raw?: any;
}

interface PicnodeContextType {
  selectedApi: string;
  setSelectedApi: (api: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  assets: Asset[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  fetchAssets: (page?: number, append?: boolean) => Promise<void>;
  loadMore: () => void;
}

const PicnodeContext = createContext<PicnodeContextType>({
  selectedApi: "",
  setSelectedApi: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  assets: [],
  loading: false,
  loadingMore: false,
  hasMore: false,
  fetchAssets: async () => {},
  loadMore: () => {},
});

export const PicnodeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { apis } = useAppContext();
  const [selectedApi, setSelectedApi] = useState<string>("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const currentApiRef = useRef<string>(selectedApi);

  // Initialize selectedApi when apis are loaded
  useEffect(() => {
    if (apis.length > 0 && !selectedApi) {
      setSelectedApi(apis[0].slug);
    }
  }, [apis, selectedApi]);

  const getMediaUrl = (
    media: MediaResource | MediaResource[] | null | undefined
  ): string => {
    const fallback =
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop";
    if (!media) return fallback;

    if (Array.isArray(media)) {
      if (media.length === 0) return fallback;
      const firstMedia = media[0];
      return (
        firstMedia.conversions?.preview ||
        firstMedia.conversions?.md ||
        firstMedia.url ||
        fallback
      );
    }

    return (
      media.conversions?.preview ||
      media.conversions?.md ||
      media.url ||
      fallback
    );
  };

  const fetchAssets = useCallback(
    async (page = 1, append = false) => {
      if (!selectedApi) return;
      const apiAtRequestTime = selectedApi;

      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        // Randomize page only on initial fetch (not appending) and when no search term is present
        let fetchPage = page;
        if (!append && page === 1 && !debouncedSearch) {
          fetchPage = Math.floor(Math.random() * 5) + 1;
        }

        const params = {
          search: debouncedSearch || undefined,
          page: fetchPage,
          has_media: true,
          media_conversions: "sm,md,lg,preview",
        };

        let response: any;
        let transformedAssets: Asset[] = [];

        const currentApi = apis.find((api) => api.slug === apiAtRequestTime);
        if (!currentApi || !currentApi.endpoints) {
          setLoading(false);
          setLoadingMore(false);
          return;
        }

        const endpoint = Object.values(currentApi.endpoints)[0] as string;

        if (endpoint === "places") {
          response = await picnodeService.getPlaces(params);
          transformedAssets = response.data.flatMap((place: PlaceResource) => {
            return place.media.map((media, index) => ({
              id: `${place.id}-${index}`,
              name: place.name,
              image: getMediaUrl(media),
              type: place.type,
              raw: place,
            }));
          });
        } else if (endpoint === "football-clubs") {
          response = await picnodeService.getFootballClubs(params);
          transformedAssets = response.data.map(
            (club: FootballClubResource) => ({
              id: club.id.toString(),
              name: club.name,
              image: getMediaUrl(club.media),
              type: "club",
              raw: club,
            })
          );
        } else if (endpoint === "thing-icos") {
          response = await picnodeService.getThingIcos(params);
          transformedAssets = response.data.map((ico: ThingIcoResource) => ({
            id: ico.id.toString(),
            name: ico.title,
            image: getMediaUrl(ico.media),
            type: "icon",
            raw: ico,
          }));
        } else if (endpoint === "companies") {
          response = await picnodeService.getCompanies(params);
          transformedAssets = response.data.flatMap(
            (company: CompanyResource) => {
              return company.media.map((media, index) => ({
                id: `${company.id}-${index}`,
                name: company.name || company.slug,
                image: getMediaUrl(media),
                type: "company",
                raw: company,
              }));
            }
          );
        }

        if (currentApiRef.current !== apiAtRequestTime) {
          return;
        }

        if (append) setAssets((prev) => [...prev, ...transformedAssets]);
        else setAssets(transformedAssets);

        const meta = response?.meta;
        // If we randomized the page, we need to be careful about pagination.
        // For simplicity in this demo, we'll just set current page to the one we fetched.
        setCurrentPage(meta?.current_page || fetchPage);
        setHasMore((meta?.current_page || fetchPage) < (meta?.last_page || 1));
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        if (currentApiRef.current === apiAtRequestTime) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [selectedApi, debouncedSearch, apis]
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchAssets(currentPage + 1, true);
  }, [loadingMore, hasMore, currentPage, fetchAssets]);

  // Reset and fetch when API or search changes
  useEffect(() => {
    currentApiRef.current = selectedApi;
    setCurrentPage(1);
    setAssets([]);
    setHasMore(true);
    setLoading(true);
    setLoadingMore(false);
    fetchAssets(1);
  }, [selectedApi, debouncedSearch]);

  return (
    <PicnodeContext.Provider
      value={{
        selectedApi,
        setSelectedApi,
        searchTerm,
        setSearchTerm,
        assets,
        loading,
        loadingMore,
        hasMore,
        fetchAssets,
        loadMore,
      }}
    >
      {children}
    </PicnodeContext.Provider>
  );
};

export const usePicnodeContext = () => {
  return useContext(PicnodeContext);
};
