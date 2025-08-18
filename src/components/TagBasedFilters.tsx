import { component$, useSignal, $ } from "@builder.io/qwik";
import type { FilterData, FilterState } from "./filter-utils";

interface TagBasedFiltersProps {
  filterData: FilterData;
  filterState: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

export default component$<TagBasedFiltersProps>(
  ({ filterData, filterState, onFilterChange }) => {
    const showAllTech = useSignal(false);
    const showAllCompanies = useSignal(false);

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
      filterState.technologies.length > 0;

    const displayedTech = showAllTech.value
      ? filterData.technologies
      : filterData.technologies.slice(0, 8);
    const displayedCompanies = showAllCompanies.value
      ? filterData.companies
      : filterData.companies.slice(0, 6);

    return (
      <div class="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Filter by Tags
          </h3>
          {hasActiveFilters && (
            <button
              onClick$={clearAllFilters}
              class="text-sm font-medium text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Type Tags */}
        <div class="mb-4">
          <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Entry Type
          </h4>
          <div class="flex flex-wrap gap-2">
            {filterData.types.map((type) => (
              <button
                key={type}
                onClick$={() => toggleType(type)}
                class={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  filterState.types.includes(type)
                    ? "border-blue-500 bg-blue-500 text-white shadow-md"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Company Tags */}
        <div class="mb-4">
          <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Companies
          </h4>
          <div class="flex flex-wrap gap-2">
            {displayedCompanies.map((company) => (
              <button
                key={company}
                onClick$={() => toggleCompany(company)}
                class={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  filterState.companies.includes(company)
                    ? "border-green-500 bg-green-500 text-white shadow-md"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {company}
              </button>
            ))}
            {filterData.companies.length > 6 && (
              <button
                onClick$={() => {
                  showAllCompanies.value = !showAllCompanies.value;
                }}
                class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showAllCompanies.value
                  ? "Show Less"
                  : `+${filterData.companies.length - 6} more`}
              </button>
            )}
          </div>
        </div>

        {/* Technology Tags */}
        <div class="mb-4">
          <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Technologies
          </h4>
          <div class="flex flex-wrap gap-2">
            {displayedTech.map((tech) => (
              <button
                key={tech}
                onClick$={() => toggleTechnology(tech)}
                class={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  filterState.technologies.includes(tech)
                    ? "border-purple-500 bg-purple-500 text-white shadow-md"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {tech}
              </button>
            ))}
            {filterData.technologies.length > 8 && (
              <button
                onClick$={() => {
                  showAllTech.value = !showAllTech.value;
                }}
                class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showAllTech.value
                  ? "Show Less"
                  : `+${filterData.technologies.length - 8} more`}
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div class="border-t border-gray-200 pt-3 dark:border-gray-700">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">Active filters:</span>
              {filterState.types.length > 0 && (
                <span class="ml-2 text-blue-600 dark:text-blue-400">
                  {filterState.types.length} type
                  {filterState.types.length > 1 ? "s" : ""}
                </span>
              )}
              {filterState.companies.length > 0 && (
                <span class="ml-2 text-green-600 dark:text-green-400">
                  {filterState.companies.length} compan
                  {filterState.companies.length > 1 ? "ies" : "y"}
                </span>
              )}
              {filterState.technologies.length > 0 && (
                <span class="ml-2 text-purple-600 dark:text-purple-400">
                  {filterState.technologies.length} technolog
                  {filterState.technologies.length > 1 ? "ies" : "y"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
