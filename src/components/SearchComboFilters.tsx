import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import type { FilterData, FilterState } from "./filter-utils";

interface SearchComboFiltersProps {
  filterData: FilterData;
  filterState: FilterState;
  onFilterChange: QRL<(newFilters: FilterState) => void>;
}

export default component$<SearchComboFiltersProps>(
  ({ filterData, filterState, onFilterChange }) => {
    const showSuggestions = useSignal(false);
    const searchInputRef = useSignal<HTMLInputElement>();

    const handleSearchChange = $((event: Event) => {
      const target = event.target as HTMLInputElement;
      const searchValue = target.value;
      onFilterChange({ ...filterState, searchText: searchValue });
      showSuggestions.value = searchValue.length > 0;
    });

    const handleSearchFocus = $(() => {
      showSuggestions.value = filterState.searchText.length > 0;
    });

    const handleSearchBlur = $(() => {
      // Delay hiding suggestions to allow clicks on suggestion items
      setTimeout(() => {
        showSuggestions.value = false;
      }, 200);
    });

    const addFilterChip = $(
      (type: "type" | "company" | "technology", value: string) => {
        const newFilters = { ...filterState };

        if (type === "type" && !newFilters.types.includes(value)) {
          newFilters.types = [...newFilters.types, value];
        } else if (
          type === "company" &&
          !newFilters.companies.includes(value)
        ) {
          newFilters.companies = [...newFilters.companies, value];
        } else if (
          type === "technology" &&
          !newFilters.technologies.includes(value)
        ) {
          newFilters.technologies = [...newFilters.technologies, value];
        }

        onFilterChange(newFilters);
        showSuggestions.value = false;

        // Clear search text after adding filter
        newFilters.searchText = "";
        onFilterChange(newFilters);
        if (searchInputRef.value) {
          searchInputRef.value.value = "";
        }
      },
    );

    const removeFilterChip = $(
      (type: "type" | "company" | "technology", value: string) => {
        const newFilters = { ...filterState };

        if (type === "type") {
          newFilters.types = newFilters.types.filter((t) => t !== value);
        } else if (type === "company") {
          newFilters.companies = newFilters.companies.filter(
            (c) => c !== value,
          );
        } else if (type === "technology") {
          newFilters.technologies = newFilters.technologies.filter(
            (t) => t !== value,
          );
        }

        onFilterChange(newFilters);
      },
    );

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
      if (searchInputRef.value) {
        searchInputRef.value.value = "";
      }
    });

    const hasActiveFilters =
      filterState.types.length > 0 ||
      filterState.companies.length > 0 ||
      filterState.technologies.length > 0;

    // Filter suggestions based on search text
    const searchLower = filterState.searchText.toLowerCase();
    const suggestions = {
      types: filterData.types
        .filter(
          (type) =>
            type.toLowerCase().includes(searchLower) &&
            !filterState.types.includes(type),
        )
        .slice(0, 3),
      companies: filterData.companies
        .filter(
          (company) =>
            company.toLowerCase().includes(searchLower) &&
            !filterState.companies.includes(company),
        )
        .slice(0, 5),
      technologies: filterData.technologies
        .filter(
          (tech) =>
            tech.toLowerCase().includes(searchLower) &&
            !filterState.technologies.includes(tech),
        )
        .slice(0, 5),
    };

    const hasSuggestions =
      suggestions.types.length > 0 ||
      suggestions.companies.length > 0 ||
      suggestions.technologies.length > 0;

    return (
      <div class="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="p-4">
          {/* Header */}
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Smart Search & Filter
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

          {/* Search Input with Suggestions */}
          <div class="relative mb-4">
            <div class="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search or type to add filters (e.g., 'JavaScript', 'Travelers', 'work')..."
                onInput$={handleSearchChange}
                onFocus$={handleSearchFocus}
                onBlur$={handleSearchBlur}
                class="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Search Suggestions */}
            {showSuggestions.value && hasSuggestions && (
              <div class="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
                {suggestions.types.length > 0 && (
                  <div class="border-b border-gray-200 p-3 dark:border-gray-600">
                    <h4 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Entry Types
                    </h4>
                    <div class="space-y-1">
                      {suggestions.types.map((type) => (
                        <button
                          key={type}
                          onClick$={() => addFilterChip("type", type)}
                          class="flex w-full items-center rounded px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20"
                        >
                          <span class="mr-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 capitalize dark:bg-blue-900 dark:text-blue-200">
                            {type}
                          </span>
                          Add as filter
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.companies.length > 0 && (
                  <div class="border-b border-gray-200 p-3 dark:border-gray-600">
                    <h4 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Companies
                    </h4>
                    <div class="space-y-1">
                      {suggestions.companies.map((company) => (
                        <button
                          key={company}
                          onClick$={() => addFilterChip("company", company)}
                          class="flex w-full items-center rounded px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-green-50 dark:text-gray-300 dark:hover:bg-green-900/20"
                        >
                          <span class="mr-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                            {company}
                          </span>
                          Add as filter
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.technologies.length > 0 && (
                  <div class="p-3">
                    <h4 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Technologies
                    </h4>
                    <div class="space-y-1">
                      {suggestions.technologies.map((tech) => (
                        <button
                          key={tech}
                          onClick$={() => addFilterChip("technology", tech)}
                          class="flex w-full items-center rounded px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-purple-900/20"
                        >
                          <span class="mr-2 rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {tech}
                          </span>
                          Add as filter
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div class="flex flex-wrap gap-2">
              {filterState.types.map((type) => (
                <div
                  key={type}
                  class="flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  <span class="capitalize">{type}</span>
                  <button
                    onClick$={() => removeFilterChip("type", type)}
                    class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <svg
                      class="h-4 w-4"
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
              ))}

              {filterState.companies.map((company) => (
                <div
                  key={company}
                  class="flex items-center rounded-full bg-green-100 px-3 py-1.5 text-sm text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <span>{company}</span>
                  <button
                    onClick$={() => removeFilterChip("company", company)}
                    class="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                  >
                    <svg
                      class="h-4 w-4"
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
              ))}

              {filterState.technologies.map((tech) => (
                <div
                  key={tech}
                  class="flex items-center rounded-full bg-purple-100 px-3 py-1.5 text-sm text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  <span>{tech}</span>
                  <button
                    onClick$={() => removeFilterChip("technology", tech)}
                    class="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                  >
                    <svg
                      class="h-4 w-4"
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
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);
