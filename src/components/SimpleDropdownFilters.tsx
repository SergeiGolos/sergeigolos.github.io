import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import type { FilterData, FilterState } from "./filter-utils";

interface SimpleDropdownFiltersProps {
  filterData: FilterData;
  filterState: FilterState;
  onFilterChange: QRL<(newFilters: FilterState) => void>;
}

export default component$<SimpleDropdownFiltersProps>(
  ({ filterData, filterState, onFilterChange }) => {
    const showFilters = useSignal(false);

    const handleTypeChange = $((event: Event) => {
      const target = event.target as HTMLSelectElement;
      const newFilters = {
        ...filterState,
        types: target.value ? [target.value] : [],
      };
      onFilterChange(newFilters);
    });

    const handleCompanyChange = $((event: Event) => {
      const target = event.target as HTMLSelectElement;
      const newFilters = {
        ...filterState,
        companies: target.value ? [target.value] : [],
      };
      onFilterChange(newFilters);
    });

    const handleYearRangeChange = $((event: Event, isStart: boolean) => {
      const target = event.target as HTMLSelectElement;
      const year = parseInt(target.value);
      const newRange: [number, number] = [...filterState.yearRange];
      if (isStart) {
        newRange[0] = year;
      } else {
        newRange[1] = year;
      }
      const newFilters = {
        ...filterState,
        yearRange: newRange,
      };
      onFilterChange(newFilters);
    });

    const clearFilters = $(() => {
      const clearedFilters: FilterState = {
        types: [],
        companies: [],
        yearRange: [
          Math.min(...filterData.years),
          Math.max(...filterData.years),
        ],
        technologies: [],
        searchText: "",
      };
      onFilterChange(clearedFilters);
    });

    const hasActiveFilters =
      filterState.types.length > 0 ||
      filterState.companies.length > 0 ||
      filterState.yearRange[0] !== Math.min(...filterData.years) ||
      filterState.yearRange[1] !== Math.max(...filterData.years);

    return (
      <div class="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Toggle Button */}
        <div class="border-b border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick$={$(() => {
              showFilters.value = !showFilters.value;
            })}
            class="flex w-full items-center justify-between text-left text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            <span>Filter Timeline</span>
            <div class="flex items-center space-x-2">
              {hasActiveFilters && (
                <span class="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Active
                </span>
              )}
              <svg
                class={`h-5 w-5 transform transition-transform ${showFilters.value ? "rotate-180" : ""}`}
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
            </div>
          </button>
        </div>

        {/* Filter Controls */}
        {showFilters.value && (
          <div class="space-y-4 p-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Type Filter */}
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <select
                  value={filterState.types[0] || ""}
                  onChange$={handleTypeChange}
                  class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All Types</option>
                  {filterData.types.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Filter */}
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </label>
                <select
                  value={filterState.companies[0] || ""}
                  onChange$={handleCompanyChange}
                  class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All Companies</option>
                  {filterData.companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Range Start */}
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  From Year
                </label>
                <select
                  value={filterState.yearRange[0]}
                  onChange$={$((e: Event) => handleYearRangeChange(e, true))}
                  class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  {filterData.years
                    .slice()
                    .reverse()
                    .map((year) => (
                      <option key={year} value={year}>
                        {year.toString()}
                      </option>
                    ))}
                </select>
              </div>

              {/* Year Range End */}
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  To Year
                </label>
                <select
                  value={filterState.yearRange[1]}
                  onChange$={$((e: Event) => handleYearRangeChange(e, false))}
                  class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  {filterData.years.map((year) => (
                    <option key={year} value={year}>
                      {year.toString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div class="pt-2">
                <button
                  onClick$={clearFilters}
                  class="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
