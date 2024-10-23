export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export type IEventFilters = {
  query?: string; 
  title?: string; 
  location?: string; 
  status?: EventStatus; 
};
