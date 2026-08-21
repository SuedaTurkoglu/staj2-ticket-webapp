

export interface PageResponse<T> {
  content: T[];          // The array of data items for the current page
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;        // Current page number (0-indexed or 1-indexed)
  numberOfElements: number;
  pageable: any[];
  size: number;          // Items per page
  sort: any[];
  totalElements: number; // Total items across all pages
  totalPages: number;    // Total number of pages available

}
