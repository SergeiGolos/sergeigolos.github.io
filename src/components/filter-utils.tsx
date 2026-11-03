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

// Fallback keyword scan, used only for entries that carry no explicit tags.
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

function entryText(entry: TimeLineEntryProperties): string {
  return [entry.name, entry.company, entry.description, entry.summary, ...entry.highlights]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// The tags/facets for one entry: its explicit resume.json tags when present,
// otherwise a keyword scan of its prose (legacy entries only).
export function entryTags(entry: TimeLineEntryProperties): string[] {
  if (entry.tags && entry.tags.length > 0) {
    return entry.tags;
  }
  const text = entryText(entry);
  return techKeywords.filter((tech) => text.includes(tech.toLowerCase()));
}

// An entry spans an interval: [startDate, endDate || today].
export function entryYearSpan(
  entry: TimeLineEntryProperties,
): [number, number] {
  const start = new Date(entry.startDate).getFullYear();
  const end = entry.endDate
    ? new Date(entry.endDate).getFullYear()
    : new Date().getFullYear();
  return [start, Math.max(start, end)];
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

  timeline.forEach((entry) => {
    types.add(entry.type);
    companies.add(entry.company);

    // Every year the entry spans, so long roles surface under each of them
    const [spanStart, spanEnd] = entryYearSpan(entry);
    for (let y = spanStart; y <= spanEnd; y++) {
      years.add(y);
    }

    if (entry.type === "work" && entry.name) {
      positions.add(entry.name);
    }

    entryTags(entry).forEach((tag) => technologies.add(tag));
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

    // Year filter: interval overlap — an entry matches when its
    // [start, end] span intersects the selected range at all.
    const [spanStart, spanEnd] = entryYearSpan(entry);
    if (spanEnd < filters.yearRange[0] || spanStart > filters.yearRange[1]) {
      return false;
    }

    // Technology / theme tag filter
    if (filters.technologies.length > 0) {
      const tags = entryTags(entry).map((t) => t.toLowerCase());
      const text = entryText(entry);
      const hasMatchingTech = filters.technologies.some(
        (tech) => tags.includes(tech.toLowerCase()) || text.includes(tech.toLowerCase()),
      );
      if (!hasMatchingTech) {
        return false;
      }
    }

    // Search text filter (includes tags)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const searchableText = [...entryTags(entry), entry.name, entry.company, entry.description, entry.summary, ...entry.highlights]
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

// Is any filter different from the unfiltered default for this timeline?
export function hasActiveFilters(
  filters: FilterState,
  timeline: TimeLineEntryProperties[],
): boolean {
  const initial = getInitialFilterState(timeline);
  return (
    filters.types.length > 0 ||
    filters.companies.length > 0 ||
    filters.technologies.length > 0 ||
    filters.searchText !== "" ||
    filters.yearRange[0] !== initial.yearRange[0] ||
    filters.yearRange[1] !== initial.yearRange[1]
  );
}

// Count entries matching all filters except one facet dimension —
// used for facet counts that stay honest as other facets change.
export function countForFacet(
  timeline: TimeLineEntryProperties[],
  filters: FilterState,
  except: keyof FilterState,
  value: string | [number, number],
): number {
  const test: FilterState = {
    types: except === "types" ? [] : [...filters.types],
    companies: except === "companies" ? [] : [...filters.companies],
    technologies: except === "technologies" ? [] : [...filters.technologies],
    searchText: except === "searchText" ? "" : filters.searchText,
    yearRange: except === "yearRange" ? getInitialFilterState(timeline).yearRange : [...filters.yearRange],
  };
  if (except === "types") test.types = [value as string];
  if (except === "companies") test.companies = [value as string];
  if (except === "technologies") test.technologies = [value as string];
  if (except === "yearRange") test.yearRange = value as [number, number];
  return filterTimeline(timeline, test).length;
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

// ---- URL sync -------------------------------------------------------------
// Filtered views are shareable: ?q=&type=&company=&tag=&from=&to=

export function filtersToSearchParams(
  filters: FilterState,
  timeline: TimeLineEntryProperties[],
): string {
  const initial = getInitialFilterState(timeline);
  const params = new URLSearchParams();
  if (filters.searchText) params.set("q", filters.searchText);
  filters.types.forEach((t) => params.append("type", t));
  filters.companies.forEach((c) => params.append("company", c));
  filters.technologies.forEach((t) => params.append("tag", t));
  if (filters.yearRange[0] !== initial.yearRange[0]) {
    params.set("from", String(filters.yearRange[0]));
  }
  if (filters.yearRange[1] !== initial.yearRange[1]) {
    params.set("to", String(filters.yearRange[1]));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function filtersFromSearchParams(
  search: string,
  timeline: TimeLineEntryProperties[],
): FilterState {
  const initial = getInitialFilterState(timeline);
  const data = extractFilterData(timeline);
  const params = new URLSearchParams(search);
  const pick = (key: string, allowed: string[]) =>
    params.getAll(key).filter((v) => allowed.includes(v));

  const from = parseInt(params.get("from") || "", 10);
  const to = parseInt(params.get("to") || "", 10);

  return {
    types: pick("type", data.types),
    companies: pick("company", data.companies),
    technologies: pick("tag", data.technologies),
    searchText: params.get("q") || "",
    yearRange: [
      Number.isNaN(from) ? initial.yearRange[0] : from,
      Number.isNaN(to) ? initial.yearRange[1] : to,
    ],
  };
}
