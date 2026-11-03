export interface TimeLineEntryProperties {
  summary?: string;
  description?: string;
  type: string;
  name: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
  company: string;
  url?: string;
  companyLogo?: string;
  tags?: string[];
}
