import axios from 'axios';

// const API_BASE_URL = "https://a2insights.com.br/api/picnode";
// const BEARER_TOKEN = "28|JHFYyuuwowfMc4cH7D53TM0RNfnjkQACa6taAP8X69805c5a";
const API_BASE_URL = 'http://localhost/api/picnode';
const BEARER_TOKEN = '4|05hIVEsXha7CGN24sJxMYwKPrfRyz3QLDz62hLU0b6f79ce8';

const picnodeApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export interface MediaResource {
  id: string;
  type: string;
  extension: string;
  size: string;
  url: string;
  conversions: Record<string, string>;
}

export interface PlaceResource {
  id: number;
  name: string;
  code: string | null;
  type: string;
  media?: MediaResource[];
  created_at: string | null;
  updated_at: string | null;
}

export interface FootballClubResource {
  id: number;
  name: string;
  media?: MediaResource | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ThingIcoResource {
  id: number;
  title: string;
  description: string | null;
  media?: MediaResource | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CompanyResource {
  id: number;
  name: string;
  slug: string;
  media?: MediaResource | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export const picnodeService = {
  async getPlaces(params?: {
    search?: string;
    page?: number;
    has_media?: boolean;
    media_conversions?: string;
  }): Promise<PaginatedResponse<PlaceResource>> {
    const response = await picnodeApi.get('/places', {
      params: {
        'filter[search]': params?.search,
        page: params?.page,
        has_media: params?.has_media ? 1 : undefined,
        media_conversions: params?.media_conversions || 'sm,md,lg',
        include: 'media',
      },
    });
    return response.data;
  },

  async getFootballClubs(params?: {
    search?: string;
    page?: number;
    has_media?: boolean;
    media_conversions?: string;
  }): Promise<PaginatedResponse<FootballClubResource>> {
    const response = await picnodeApi.get('/football-clubs', {
      params: {
        'filter[search]': params?.search,
        page: params?.page,
        has_media: params?.has_media ? 1 : undefined,
        media_conversions: params?.media_conversions || 'sm,md,lg',
        include: 'media',
      },
    });
    return response.data;
  },

  async getThingIcos(params?: {
    search?: string;
    page?: number;
    has_media?: boolean;
    media_conversions?: string;
  }): Promise<PaginatedResponse<ThingIcoResource>> {
    const response = await picnodeApi.get('/thing-icos', {
      params: {
        'filter[search]': params?.search,
        page: params?.page,
        has_media: params?.has_media ? 1 : undefined,
        media_conversions: params?.media_conversions || 'sm,md,lg',
        include: 'media',
      },
    });
    return response.data;
  },

  async getCompanies(params?: {
    search?: string;
    page?: number;
    has_media?: boolean;
    media_conversions?: string;
  }): Promise<PaginatedResponse<CompanyResource>> {
    const response = await picnodeApi.get('/companies', {
      params: {
        'filter[search]': params?.search,
        page: params?.page,
        has_media: params?.has_media ? 1 : undefined,
        media_conversions: params?.media_conversions || 'sm,md,lg',
        include: 'media',
      },
    });
    return response.data;
  },
};

export default picnodeService;
