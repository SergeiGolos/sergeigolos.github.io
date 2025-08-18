import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import type { FilterData, FilterState } from "./filter-utils";

interface TimelineSliderFiltersProps {
  filterData: FilterData;
  filterState: FilterState;
  onFilterChange: QRL<(newFilters: FilterState) => void>;
}

export default component$<TimelineSliderFiltersProps>(
  ({ filterData, filterState, onFilterChange }) => {
    const showAdvanced = useSignal(false);

    const minYear = Math.min(...filterData.years);
    const maxYear = Math.max(...filterData.years);

    const handleRangeChange = $((event: Event, isStart: boolean) => {
      const target = event.target as HTMLInputElement;
      const value = parseInt(target.value);
      const newRange: [number, number] = [...filterState.yearRange];

      if (isStart) {
        newRange[0] = Math.min(value, newRange[1]);
      } else {
        newRange[1] = Math.max(value, newRange[0]);
      }

      onFilterChange({ ...filterState, yearRange: newRange });
    });

    const toggleType = $((type: string) => {
      const newTypes = filterState.types.includes(type)
        ? filterState.types.filter((t) => t !== type)
        : [...filterState.types, type];
      onFilterChange({ ...filterState, types: newTypes });
    });

    const toggleCompany = $((company: string) => {
      const newCompanies = filterState.companies.includes(company)
        ? filterState.companies.filter((c) => c !== company)
        : [...filterState.companies, company];
      onFilterChange({ ...filterState, companies: newCompanies });
    });

    const handleSearchChange = $((event: Event) => {
      const target = event.target as HTMLInputElement;
      onFilterChange({ ...filterState, searchText: target.value });
    });

    const clearAllFilters = $(() => {
      const clearedFilters: FilterState = {
        types: [],
        companies: [],
        yearRange: [minYear, maxYear],
        technologies: [],
        searchText: "",
      };
      onFilterChange(clearedFilters);
    });

    const hasActiveFilters =
      filterState.types.length > 0 ||
      filterState.companies.length > 0 ||
      filterState.yearRange[0] !== minYear ||
      filterState.yearRange[1] !== maxYear ||
      filterState.searchText.length > 0;

    const rangePercentStart =
      ((filterState.yearRange[0] - minYear) / (maxYear - minYear)) * 100;
    const rangePercentEnd =
      ((filterState.yearRange[1] - minYear) / (maxYear - minYear)) * 100;

    return (
      <div class="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="p-6">
          {/* Header */}
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Timeline Filter
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Drag to select time range, then apply additional filters
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick$={clearAllFilters}
                class="text-sm font-medium text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Reset
              </button>
            )}
          </div>

          {/* Timeline Slider */}
          <div class="mb-8">
            <div class="mb-4 flex items-center justify-between">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Range: {filterState.yearRange[0]} -{" "}
                {filterState.yearRange[1]}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {filterState.yearRange[1] - filterState.yearRange[0] + 1} year
                {filterState.yearRange[1] - filterState.yearRange[0] !== 0
                  ? "s"
                  : ""}
              </div>
            </div>

            {/* Custom Range Slider */}
            <div class="relative">
              {/* Track */}
              <div class="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                {/* Active Range */}
                <div
                  class="absolute h-2 rounded-full bg-blue-500"
                  style={`left: ${rangePercentStart}%; width: ${rangePercentEnd - rangePercentStart}%;`}
                ></div>
              </div>

              {/* Range Inputs */}
              <div class="relative -mt-1">
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={filterState.yearRange[0]}
                  onInput$={(e) => handleRangeChange(e, true)}
                  class="slider-thumb-start absolute h-2 w-full cursor-pointer appearance-none bg-transparent"
                  style="z-index: 1;"
                />
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={filterState.yearRange[1]}
                  onInput$={(e) => handleRangeChange(e, false)}
                  class="slider-thumb-end absolute h-2 w-full cursor-pointer appearance-none bg-transparent"
                  style="z-index: 2;"
                />
              </div>

              {/* Year Labels */}
              <div class="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{minYear}</span>
                <span>{maxYear}</span>
              </div>
            </div>

            {/* Year Markers */}
            <div class="mt-2 flex justify-between px-1">
              {filterData.years
                .slice()
                .reverse()
                .map((year, index) => {
                  const percent =
                    ((year - minYear) / (maxYear - minYear)) * 100;
                  const isInRange =
                    year >= filterState.yearRange[0] &&
                    year <= filterState.yearRange[1];

                  return (
                    <div
                      key={year}
                      class="relative"
                      style={`left: ${percent - 50}%;`}
                    >
                      <div
                        class={`mx-auto h-3 w-0.5 ${isInRange ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      ></div>
                      {index % 3 === 0 && (
                        <div
                          class={`mt-1 -translate-x-1/2 transform text-xs ${isInRange ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
                        >
                          {year}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Search */}
          <div class="mb-4">
            <input
              type="text"
              value={filterState.searchText}
              onInput$={handleSearchChange}
              placeholder="Quick search within selected timeframe..."
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div class="mb-4">
            <button
              onClick$={() => {
                showAdvanced.value = !showAdvanced.value;
              }}
              class="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Advanced Filters</span>
              <svg
                class={`ml-1 h-4 w-4 transform transition-transform ${showAdvanced.value ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

          {/* Advanced Filters */}
          {showAdvanced.value && (
            <div class="space-y-6 border-t border-gray-200 pt-4 dark:border-gray-700">
              {/* Type Toggle Buttons */}
              <div>
                <h4 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Entry Types
                </h4>
                <div class="flex flex-wrap gap-2">
                  {filterData.types.map((type) => (
                    <button
                      key={type}
                      onClick$={() => toggleType(type)}
                      class={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        filterState.types.includes(type)
                          ? "scale-105 transform border-blue-500 bg-blue-500 text-white shadow-md"
                          : "border-gray-300 bg-gray-100 text-gray-700 hover:scale-105 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Filters */}
              <div>
                <h4 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Companies
                </h4>
                <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {filterData.companies.slice(0, 8).map((company) => (
                    <label
                      key={company}
                      class="flex cursor-pointer items-center rounded p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={filterState.companies.includes(company)}
                        onChange$={() => toggleCompany(company)}
                        class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                      <span class="ml-2 truncate text-sm text-gray-700 dark:text-gray-300">
                        {company}
                      </span>
                    </label>
                  ))}
                </div>
                {filterData.companies.length > 8 && (
                  <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    +{filterData.companies.length - 8} more companies available
                    in other filter modes
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div class="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg
                  class="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>
                  Filtering{" "}
                  {filterState.yearRange[1] - filterState.yearRange[0] + 1} year
                  {filterState.yearRange[1] - filterState.yearRange[0] !== 0
                    ? "s"
                    : ""}
                  {filterState.types.length > 0 &&
                    `, ${filterState.types.length} type${filterState.types.length > 1 ? "s" : ""}`}
                  {filterState.companies.length > 0 &&
                    `, ${filterState.companies.length} compan${filterState.companies.length > 1 ? "ies" : "y"}`}
                  {filterState.searchText && `, with search`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Custom Range Slider Styles */}
        <style>
          {`
          .slider-thumb-start::-webkit-slider-thumb,
          .slider-thumb-end::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3B82F6;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          }
          
          .slider-thumb-start::-moz-range-thumb,
          .slider-thumb-end::-moz-range-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3B82F6;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          }
        `}
        </style>
      </div>
    );
  },
);
