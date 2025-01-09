import type { IVSFilterOptions } from '@/libs/vector-storage/types/IVSFilterOptions';
export interface IVSSimilaritySearchParams {
  query: string;
  k?: number;
  filterOptions?: IVSFilterOptions;
  includeValues?: boolean;
}
