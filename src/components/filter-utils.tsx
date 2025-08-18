import type { TimeLineEntryProperties } from "./TimeLineEntryProperties";

export interface FilterData {
  types: string[];
  companies: string[];
  years: number[];
  technologies: string[];
  positions: string[];
}

export interface FilterState {
  types: string[];
  companies: string[];
  yearRange: [number, number];
  technologies: string[];
  searchText: string;
}

// Extract all available filter options from timeline data
export function extractFilterData(
  timeline: TimeLineEntryProperties[],
): FilterData {
  const types = new Set<string>();
  const companies = new Set<string>();
  const years = new Set<number>();
  const technologies = new Set<string>();
  const positions = new Set<string>();

  // Common technologies to extract from text
  const techKeywords = [
    "JavaScript",
    "TypeScript",
    "Angular",
    "React",
    "Vue",
    "C#",
    "ASP.NET",
    ".NET",
    "Java",
    "Python",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "SQL",
    "NoSQL",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "CI/CD",
    "DevOps",
    "Agile",
    "Scrum",
  ];

  timeline.forEach((entry) => {
    // Types
    types.add(entry.type);

    // Companies
    companies.add(entry.company);

    // Years
    const year = new Date(entry.startDate).getFullYear();
    years.add(year);

    // Positions (for work entries)
    if (entry.type === "work" && entry.name) {
      positions.add(entry.name);
    }

    // Extract technologies from description, summary, and highlights
    const textContent = [entry.description, entry.summary, ...entry.highlights]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    techKeywords.forEach((tech) => {
      if (textContent.includes(tech.toLowerCase())) {
        technologies.add(tech);
      }
    });
  });

  return {
    types: Array.from(types).sort(),
    companies: Array.from(companies).sort(),
    years: Array.from(years).sort((a, b) => b - a), // Most recent first
    technologies: Array.from(technologies).sort(),
    positions: Array.from(positions).sort(),
  };
}

// Filter timeline entries based on filter state
export function filterTimeline(
  timeline: TimeLineEntryProperties[],
  filters: FilterState,
): TimeLineEntryProperties[] {
  return timeline.filter((entry) => {
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(entry.type)) {
      return false;
    }

    // Company filter
    if (
      filters.companies.length > 0 &&
      !filters.companies.includes(entry.company)
    ) {
      return false;
    }

    // Year range filter
    const entryYear = new Date(entry.startDate).getFullYear();
    if (entryYear < filters.yearRange[0] || entryYear > filters.yearRange[1]) {
      return false;
    }

    // Technology filter
    if (filters.technologies.length > 0) {
      const textContent = [
        entry.description,
        entry.summary,
        ...entry.highlights,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const hasMatchingTech = filters.technologies.some((tech) =>
        textContent.includes(tech.toLowerCase()),
      );

      if (!hasMatchingTech) {
        return false;
      }
    }

    // Search text filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const searchableText = [
        entry.name,
        entry.company,
        entry.description,
        entry.summary,
        ...entry.highlights,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

// Get initial filter state
export function getInitialFilterState(
  timeline: TimeLineEntryProperties[],
): FilterState {
  const filterData = extractFilterData(timeline);
  const years = filterData.years;

  return {
    types: [],
    companies: [],
    yearRange:
      years.length > 0
        ? [Math.min(...years), Math.max(...years)]
        : [2000, new Date().getFullYear()],
    technologies: [],
    searchText: "",
  };
}
