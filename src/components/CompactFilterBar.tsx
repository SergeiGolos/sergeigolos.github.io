import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import type { FilterData, FilterState } from "./filter-utils";

interface CompactFilterBarProps {
  filterData: FilterData;
  filterState: FilterState;
  onFilterChange: QRL<(newFilters: FilterState) => void>;
}

export default component$<CompactFilterBarProps>(
  ({ filterData, filterState, onFilterChange }) => {
    const showTagSelector = useSignal(false);
    const showYearSelector = useSignal(false);

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

    const toggleTechnology = $((tech: string) => {
      const newTech = filterState.technologies.includes(tech)
        ? filterState.technologies.filter((t) => t !== tech)
        : [...filterState.technologies, tech];
      onFilterChange({ ...filterState, technologies: newTech });
    });

    const removeTechnology = $((tech: string) => {
      const newTech = filterState.technologies.filter((t) => t !== tech);
      onFilterChange({ ...filterState, technologies: newTech });
    });

    // Get technologies that are available within the current date range
    const getAvailableTechnologies = () => {
      // This would ideally filter technologies based on timeline entries within the date range
      // For now, return all technologies (this could be enhanced to be more sophisticated)
      return filterData.technologies;
    };

    const availableTechnologies = getAvailableTechnologies();
    const selectedTechnologies = filterState.technologies;
    const unselectedTechnologies = availableTechnologies.filter(
      (tech) => !selectedTechnologies.includes(tech),
    );

    return (
      <div class="fixed right-24 top-3 z-50 flex items-center gap-2">
        {/* Compact Year Range Display/Selector */}
        <div class="relative">
          <button
            onClick$={() => {
              showYearSelector.value = !showYearSelector.value;
              showTagSelector.value = false;
            }}
            class="group flex items-center gap-1 p-2 font-semibold text-white/50 transition-colors hover:text-white/90 lg:text-gray-500 lg:hover:text-gray-900 lg:dark:text-white/50 lg:dark:hover:text-white/90"
            title="Click to adjust date range"
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="text-xs font-medium">
              {filterState.yearRange[0]} - {filterState.yearRange[1]}
            </span>
            <svg
              class={`h-3 w-3 transform transition-transform ${showYearSelector.value ? "rotate-180" : ""}`}
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

          {/* Year Range Selector Dropdown */}
          {showYearSelector.value && (
            <div class="absolute right-0 top-full z-50 mt-2 min-w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <div class="mb-3">
                <h4 class="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Date Range
                </h4>
                <div class="mb-3 flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {filterState.yearRange[0]}
                  </span>
                  <div class="relative flex-1">
                    <input
                      type="range"
                      min={minYear}
                      max={maxYear}
                      value={filterState.yearRange[0]}
                      onInput$={(e) => handleRangeChange(e, true)}
                      class="absolute z-10 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      style="background: transparent;"
                    />
                    <input
                      type="range"
                      min={minYear}
                      max={maxYear}
                      value={filterState.yearRange[1]}
                      onInput$={(e) => handleRangeChange(e, false)}
                      class="absolute h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                    />
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {filterState.yearRange[1]}
                  </span>
                </div>
                <div class="text-center text-xs text-gray-500 dark:text-gray-400">
                  {filterState.yearRange[1] - filterState.yearRange[0] + 1}{" "}
                  years selected
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTechnologies.length > 0 && (
          <div class="flex items-center gap-1">
            {selectedTechnologies.slice(0, 3).map((tech) => (
              <button
                key={tech}
                onClick$={() => removeTechnology(tech)}
                class="inline-flex items-center gap-1 rounded-full bg-blue-600/90 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-blue-700/90"
                title={`Remove ${tech} filter`}
              >
                <span class="max-w-16 truncate">{tech}</span>
                <svg
                  class="h-2 w-2 flex-shrink-0"
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
            ))}
            {selectedTechnologies.length > 3 && (
              <span class="text-xs font-medium text-white/70 dark:text-gray-400 lg:text-gray-500">
                +{selectedTechnologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Add Tags Button */}
        <div class="relative">
          <button
            onClick$={() => {
              showTagSelector.value = !showTagSelector.value;
              showYearSelector.value = false;
            }}
            class="group flex items-center justify-center p-2 font-semibold text-white/50 transition-colors hover:text-white/90 lg:text-gray-500 lg:hover:text-gray-900 lg:dark:text-white/50 lg:dark:hover:text-white/90"
            title="Add technology filters"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          {/* Tag Selector Dropdown */}
          {showTagSelector.value && (
            <div class="absolute right-0 top-full z-50 mt-2 min-w-64 max-w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <h4 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                Add Technology Tags
              </h4>
              <div class="max-h-48 overflow-y-auto">
                <div class="flex flex-wrap gap-2">
                  {unselectedTechnologies.length > 0 ? (
                    unselectedTechnologies.map((tech) => (
                      <button
                        key={tech}
                        onClick$={() => toggleTechnology(tech)}
                        class="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-gray-700"
                      >
                        {tech}
                      </button>
                    ))
                  ) : (
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      All available technologies are selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close dropdowns */}
        {(showYearSelector.value || showTagSelector.value) && (
          <div
            class="fixed inset-0 z-40 bg-transparent"
            onClick$={() => {
              showYearSelector.value = false;
              showTagSelector.value = false;
            }}
          />
        )}

        {/* Compact Range Slider Styles */}
        <style>
          {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3B82F6;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          }
          
          input[type="range"]::-moz-range-thumb {
            appearance: none;
            height: 12px;
            width: 12px;
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
