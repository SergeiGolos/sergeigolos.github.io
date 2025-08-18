import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import type { FilterData, FilterState } from "./filter-utils";

interface SidebarFiltersProps {
  filterData: FilterData;
  filterState: FilterState;
  onFilterChange: QRL<(newFilters: FilterState) => void>;
}

export default component$<SidebarFiltersProps>(
  ({ filterData, filterState, onFilterChange }) => {
    const sidebarOpen = useSignal(false);

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

    const toggleTechnology = $((tech: string) => {
      const newTech = filterState.technologies.includes(tech)
        ? filterState.technologies.filter((t) => t !== tech)
        : [...filterState.technologies, tech];
      onFilterChange({ ...filterState, technologies: newTech });
    });

    const handleSearchChange = $((event: Event) => {
      const target = event.target as HTMLInputElement;
      onFilterChange({ ...filterState, searchText: target.value });
    });

    const clearAllFilters = $(() => {
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
      filterState.technologies.length > 0 ||
      filterState.searchText.length > 0;

    return (
      <>
        {/* Filter Toggle Button */}
        <div class="fixed right-4 top-20 z-50 lg:hidden">
          <button
            onClick$={() => {
              sidebarOpen.value = true;
            }}
            class="rounded-full bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <svg
              class="h-5 w-5"
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
          </button>
        </div>

        {/* Desktop Sidebar */}
        <div class="fixed left-0 top-0 z-40 hidden h-full w-80 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:block">
          <div class="p-6">
            {/* Header */}
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick$={clearAllFilters}
                  class="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search */}
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </label>
              <input
                type="text"
                value={filterState.searchText}
                onInput$={handleSearchChange}
                placeholder="Search timeline entries..."
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Type Filters */}
            <div class="mb-6">
              <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Entry Type
              </h3>
              <div class="space-y-2">
                {filterData.types.map((type) => (
                  <label key={type} class="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterState.types.includes(type)}
                      onChange$={() => toggleType(type)}
                      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                    />
                    <span class="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Filters */}
            <div class="mb-6">
              <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Companies
              </h3>
              <div class="max-h-48 space-y-2 overflow-y-auto">
                {filterData.companies.map((company) => (
                  <label key={company} class="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterState.companies.includes(company)}
                      onChange$={() => toggleCompany(company)}
                      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                    />
                    <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {company}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Technology Filters */}
            <div class="mb-6">
              <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Technologies
              </h3>
              <div class="max-h-48 space-y-2 overflow-y-auto">
                {filterData.technologies.map((tech) => (
                  <label key={tech} class="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterState.technologies.includes(tech)}
                      onChange$={() => toggleTechnology(tech)}
                      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                    />
                    <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {tech}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen.value && (
          <div class="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              class="fixed inset-0 bg-black bg-opacity-50"
              onClick$={() => {
                sidebarOpen.value = false;
              }}
            ></div>

            {/* Sidebar */}
            <div class="fixed right-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-xl dark:bg-gray-900">
              <div class="p-6">
                {/* Header */}
                <div class="mb-6 flex items-center justify-between">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick$={() => {
                      sidebarOpen.value = false;
                    }}
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Same content as desktop but for mobile */}
                <div class="space-y-6">
                  {/* Search */}
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filterState.searchText}
                      onInput$={handleSearchChange}
                      placeholder="Search timeline entries..."
                      class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                  {/* Type Filters */}
                  <div>
                    <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Entry Type
                    </h3>
                    <div class="space-y-2">
                      {filterData.types.map((type) => (
                        <label key={type} class="flex items-center">
                          <input
                            type="checkbox"
                            checked={filterState.types.includes(type)}
                            onChange$={() => toggleType(type)}
                            class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
                          />
                          <span class="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear All Button */}
                  {hasActiveFilters && (
                    <button
                      onClick$={clearAllFilters}
                      class="w-full rounded-md border border-red-300 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Margin for Desktop */}
        <style>
          {`
          @media (min-width: 1024px) {
            .timeline-content {
              margin-left: 320px;
            }
          }
        `}
        </style>
      </>
    );
  },
);
