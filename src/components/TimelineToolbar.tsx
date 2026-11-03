import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import {
  countForFacet,
  type FilterData,
  type FilterState,
} from "./filter-utils";
import type { TimeLineEntryProperties } from "./TimeLineEntryProperties";

interface TimelineToolbarProps {
  filterData: FilterData;
  filterState: FilterState;
  timeline: TimeLineEntryProperties[];
  resultCount: number;
  totalCount: number;
  onFilterChange: QRL<(newFilters: FilterState) => void>;
  onClearFilters: QRL<() => void>;
}

const ERA_PRESETS: { label: string; range: [number, number] | null }[] = [
  { label: "All years", range: null },
  { label: "2020 – Now", range: [2020, 2100] },
  { label: "2015 – 2019", range: [2015, 2019] },
  { label: "2010 – 2014", range: [2010, 2014] },
  { label: "2004 – 2009", range: [2004, 2009] },
];

const chipBase =
  "rounded-full px-2.5 py-1 text-xs whitespace-nowrap ring-1 transition-colors";
const chipOff =
  "bg-white text-gray-700 ring-gray-900/10 hover:text-sky-700 hover:ring-sky-400 dark:bg-gray-800 dark:text-gray-200 dark:ring-white/10 dark:hover:text-sky-300";
const chipOn = "bg-sky-600 text-white ring-sky-600 dark:bg-sky-500 dark:ring-sky-500";
const labelCls =
  "text-[0.65rem] font-semibold tracking-wider text-gray-500 uppercase dark:text-white/50";

export default component$<TimelineToolbarProps>(
  ({
    filterData,
    filterState,
    timeline,
    resultCount,
    totalCount,
    onFilterChange,
    onClearFilters,
  }) => {
    const expanded = useSignal(false);
    const minYear = Math.min(...filterData.years);
    const maxYear = Math.max(...filterData.years);
    const yearsAsc = [...filterData.years].sort((a, b) => a - b);

    const isFiltered =
      filterState.types.length > 0 ||
      filterState.companies.length > 0 ||
      filterState.technologies.length > 0 ||
      filterState.searchText !== "" ||
      filterState.yearRange[0] !== minYear ||
      filterState.yearRange[1] !== maxYear;

    const eras = ERA_PRESETS.filter(
      (e) =>
        e.range === null ||
        (e.range[0] <= maxYear && Math.min(e.range[1], maxYear) >= minYear),
    ).map((e) =>
      e.range === null
        ? e
        : {
            label: e.label,
            range: [
              Math.max(e.range[0], minYear),
              Math.min(e.range[1], maxYear),
            ] as [number, number],
          },
    );

    const activeEra = eras.findIndex((e) =>
      e.range === null
        ? filterState.yearRange[0] === minYear &&
          filterState.yearRange[1] === maxYear
        : filterState.yearRange[0] === e.range[0] &&
          filterState.yearRange[1] === e.range[1],
    );

    const setSearch = $((event: Event) => {
      const target = event.target as HTMLInputElement;
      onFilterChange({ ...filterState, searchText: target.value });
    });

    const expandFacets = $(() => {
      expanded.value = true;
    });

    const toggleFacets = $(() => {
      expanded.value = !expanded.value;
    });

    const toggleType = $((type: string) => {
      const types = filterState.types.includes(type)
        ? filterState.types.filter((t) => t !== type)
        : [...filterState.types, type];
      onFilterChange({ ...filterState, types });
    });

    const toggleCompany = $((company: string) => {
      const companies = filterState.companies.includes(company)
        ? filterState.companies.filter((c) => c !== company)
        : [...filterState.companies, company];
      onFilterChange({ ...filterState, companies });
    });

    const toggleTag = $((tag: string) => {
      const technologies = filterState.technologies.includes(tag)
        ? filterState.technologies.filter((t) => t !== tag)
        : [...filterState.technologies, tag];
      onFilterChange({ ...filterState, technologies });
    });

    const clearTypes = $(() => {
      onFilterChange({ ...filterState, types: [] });
    });

    const clearAll = $(() => {
      onClearFilters();
    });

    const setEra = $((index: number) => {
      const era = eras[index];
      const yearRange: [number, number] =
        era.range === null ? [minYear, maxYear] : era.range;
      onFilterChange({ ...filterState, yearRange });
    });

    const setYearBound = $((event: Event, isStart: boolean) => {
      const value = parseInt((event.target as HTMLSelectElement).value, 10);
      const yearRange: [number, number] = [...filterState.yearRange];
      if (isStart) {
        yearRange[0] = Math.min(value, yearRange[1]);
      } else {
        yearRange[1] = Math.max(value, yearRange[0]);
      }
      onFilterChange({ ...filterState, yearRange });
    });

    return (
      <div class="sticky top-16 z-40 mx-auto max-w-7xl px-6 lg:top-4 lg:flex lg:px-8">
        <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
          <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
            <section
              aria-label="Filter timeline"
              class="rounded-xl bg-gray-50/95 p-4 shadow-sm ring-1 ring-gray-900/10 backdrop-blur dark:bg-gray-900/95 dark:ring-white/10"
            >
              {/* Search + status row */}
              <div class="flex items-center gap-3">
                <label class="relative flex-1">
                  <span class="sr-only">Search the timeline</span>
                  <svg
                    class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                  </svg>
                  <input
                    type="search"
                    value={filterState.searchText}
                    onInput$={setSearch}
                    onFocus$={expandFacets}
                    placeholder="Search role, company, keyword…"
                    class="w-full rounded-lg bg-white py-2 pr-3 pl-9 text-sm text-gray-900 ring-1 ring-gray-900/10 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white dark:ring-white/10 dark:placeholder:text-gray-500"
                  />
                </label>
                <button
                  type="button"
                  class="flex shrink-0 items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
                  onClick$={toggleFacets}
                  aria-expanded={expanded.value}
                  aria-controls="timeline-facets"
                >
                  Filters {isFiltered ? "•" : ""}
                  <svg
                    class={`h-3.5 w-3.5 transition-transform ${expanded.value ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <div class="mt-2 flex items-center justify-between">
                <p class="text-xs text-gray-500 dark:text-white/50" role="status">
                  {resultCount} of {totalCount} entries
                  {filterState.yearRange[0] !== minYear ||
                  filterState.yearRange[1] !== maxYear
                    ? ` · ${filterState.yearRange[0]}–${filterState.yearRange[1]}`
                    : ""}
                </p>
                {isFiltered && (
                  <button
                    type="button"
                    onClick$={clearAll}
                    class="text-xs font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Facets */}
              <div
                id="timeline-facets"
                class={`${expanded.value ? "mt-3 block" : "hidden"} space-y-3`}
              >
                {/* Type */}
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    class={`${chipBase} ${filterState.types.length === 0 ? chipOn : chipOff}`}
                    onClick$={clearTypes}
                  >
                    All
                  </button>
                  {filterData.types.map((type) => (
                    <button
                      key={type}
                      type="button"
                      class={`${chipBase} ${filterState.types.includes(type) ? chipOn : chipOff}`}
                      onClick$={() => toggleType(type)}
                    >
                      {type === "work"
                        ? "Work"
                        : type === "project"
                          ? "Projects"
                          : type === "education"
                            ? "Education"
                            : type}
                    </button>
                  ))}
                </div>

                {/* Companies */}
                <div>
                  <p class={labelCls}>Company</p>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    {filterData.companies.map((company) => {
                      const count = countForFacet(
                        timeline,
                        filterState,
                        "companies",
                        company,
                      );
                      const selected = filterState.companies.includes(company);
                      return (
                        <button
                          key={company}
                          type="button"
                          disabled={count === 0 && !selected}
                          class={`${chipBase} ${selected ? chipOn : chipOff} disabled:cursor-not-allowed disabled:opacity-40`}
                          onClick$={() => toggleCompany(company)}
                        >
                          {company}{" "}
                          <span class={selected ? "text-white/70" : "text-gray-400"}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Years */}
                <div>
                  <p class={labelCls}>Years</p>
                  <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {eras.map((era, i) => (
                      <button
                        key={era.label}
                        type="button"
                        class={`${chipBase} ${activeEra === i ? chipOn : chipOff}`}
                        onClick$={() => setEra(i)}
                      >
                        {era.label}
                      </button>
                    ))}
                    <span class="ml-1 flex items-center gap-1 text-xs text-gray-500 dark:text-white/50">
                      <label>
                        <span class="sr-only">From year</span>
                        <select
                          value={String(filterState.yearRange[0])}
                          onChange$={(e) => setYearBound(e, true)}
                          class="rounded-md bg-white px-1.5 py-1 text-xs text-gray-900 ring-1 ring-gray-900/10 dark:bg-gray-800 dark:text-white dark:ring-white/10"
                        >
                          {yearsAsc.map((y) => (
                            <option
                              key={String(y)}
                              value={String(y)}
                              selected={y === filterState.yearRange[0]}
                            >
                              {String(y)}
                            </option>
                          ))}
                        </select>
                      </label>
                      –
                      <label>
                        <span class="sr-only">To year</span>
                        <select
                          value={String(filterState.yearRange[1])}
                          onChange$={(e) => setYearBound(e, false)}
                          class="rounded-md bg-white px-1.5 py-1 text-xs text-gray-900 ring-1 ring-gray-900/10 dark:bg-gray-800 dark:text-white dark:ring-white/10"
                        >
                          {yearsAsc.map((y) => (
                            <option
                              key={String(y)}
                              value={String(y)}
                              selected={y === filterState.yearRange[1]}
                            >
                              {String(y)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </span>
                  </div>
                </div>

                {/* Themes & skills (entry tags) */}
                <div>
                  <p class={labelCls}>Themes &amp; skills</p>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    {filterData.technologies.map((tag) => {
                      const count = countForFacet(
                        timeline,
                        filterState,
                        "technologies",
                        tag,
                      );
                      const selected = filterState.technologies.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          disabled={count === 0 && !selected}
                          class={`${chipBase} ${selected ? chipOn : chipOff} disabled:cursor-not-allowed disabled:opacity-40`}
                          onClick$={() => toggleTag(tag)}
                        >
                          {tag}{" "}
                          <span class={selected ? "text-white/70" : "text-gray-400"}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  },
);
