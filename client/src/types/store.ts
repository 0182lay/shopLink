export type Store = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  isActive: boolean;
};
