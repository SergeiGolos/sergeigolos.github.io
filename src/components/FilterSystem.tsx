import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import {
  extractFilterData,
  getInitialFilterState,
  filterTimeline,
  type FilterState,
} from "./filter-utils";
import type { TimeLineEntryProperties } from "./TimeLineEntryProperties";
import SimpleDropdownFilters from "./SimpleDropdownFilters";
import TagBasedFilters from "./TagBasedFilters";
import SidebarFilters from "./SidebarFilters";
import SearchComboFilters from "./SearchComboFilters";
import TimelineSliderFilters from "./TimelineSliderFilters";

interface FilterSystemProps {
  timeline: TimeLineEntryProperties[];
  onFilteredResults: QRL<(filteredTimeline: TimeLineEntryProperties[]) => void>;
}

export type FilterMode = "dropdown" | "tags" | "sidebar" | "search" | "slider";

export default component$<FilterSystemProps>(
  ({ timeline, onFilteredResults }) => {
    const filterData = extractFilterData(timeline);
    const filterState = useSignal<FilterState>(getInitialFilterState(timeline));
    const currentMode = useSignal<FilterMode>("dropdown");

    // Demo mode selector (for showcasing different prototypes)
    const showModeSelector = useSignal(true);

    const handleFilterChange = $((newFilters: FilterState) => {
      filterState.value = newFilters;
      const filteredResults = filterTimeline(timeline, newFilters);
      onFilteredResults(filteredResults);
    });

    const switchMode = $((mode: FilterMode) => {
      currentMode.value = mode;
      // Reset filters when switching modes
      const initialFilters = getInitialFilterState(timeline);
      filterState.value = initialFilters;
      onFilteredResults(timeline);
    });

    const modeConfigs = {
      dropdown: {
        name: "Simple Dropdowns",
        description:
          "Traditional dropdown filters for type, company, and year range",
        icon: "▼",
      },
      tags: {
        name: "Tag-based Filters",
        description:
          "Clickable tag chips for technologies, companies, and types",
        icon: "🏷️",
      },
      sidebar: {
        name: "Sidebar Panel",
        description: "Collapsible sidebar with checkboxes and search",
        icon: "📋",
      },
      search: {
        name: "Smart Search",
        description: "Intelligent search with dynamic filter suggestions",
        icon: "🔍",
      },
      slider: {
        name: "Timeline Slider",
        description: "Visual time range slider with quick toggles",
        icon: "⏮️",
      },
    };

    return (
      <>
        {/* Demo Mode Selector */}
        {showModeSelector.value && (
          <div class="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div class="mb-3 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-200">
                  Filter System Prototypes
                </h2>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  Choose a prototype to test different filtering approaches
                </p>
              </div>
              <button
                onClick$={() => {
                  showModeSelector.value = false;
                }}
                class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                title="Hide prototype selector"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
              {(
                Object.entries(modeConfigs) as [
                  FilterMode,
                  (typeof modeConfigs)[FilterMode],
                ][]
              ).map(([mode, config]) => (
                <button
                  key={mode}
                  onClick$={() => switchMode(mode)}
                  class={`rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                    currentMode.value === mode
                      ? "scale-105 transform border-blue-500 bg-blue-100 shadow-md dark:bg-blue-900/50"
                      : "hover:scale-102 border-gray-200 bg-white hover:border-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-600"
                  }`}
                >
                  <div class="mb-1 flex items-center">
                    <span class="mr-2 text-lg">{config.icon}</span>
                    <span
                      class={`text-sm font-semibold ${
                        currentMode.value === mode
                          ? "text-blue-800 dark:text-blue-200"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {config.name}
                    </span>
                  </div>
                  <p
                    class={`text-xs ${
                      currentMode.value === mode
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {config.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show Prototype Selector Button when hidden */}
        {!showModeSelector.value && (
          <div class="mb-4">
            <button
              onClick$={() => {
                showModeSelector.value = true;
              }}
              class="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-800 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 dark:hover:text-blue-200"
            >
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              Show Filter Prototypes ({modeConfigs[currentMode.value].name})
            </button>
          </div>
        )}

        {/* Current Filter Component */}
        <div class={currentMode.value === "sidebar" ? "timeline-content" : ""}>
          {currentMode.value === "dropdown" && (
            <SimpleDropdownFilters
              filterData={filterData}
              filterState={filterState.value}
              onFilterChange={handleFilterChange}
            />
          )}

          {currentMode.value === "tags" && (
            <TagBasedFilters
              filterData={filterData}
              filterState={filterState.value}
              onFilterChange={handleFilterChange}
            />
          )}

          {currentMode.value === "sidebar" && (
            <SidebarFilters
              filterData={filterData}
              filterState={filterState.value}
              onFilterChange={handleFilterChange}
            />
          )}

          {currentMode.value === "search" && (
            <SearchComboFilters
              filterData={filterData}
              filterState={filterState.value}
              onFilterChange={handleFilterChange}
            />
          )}

          {currentMode.value === "slider" && (
            <TimelineSliderFilters
              filterData={filterData}
              filterState={filterState.value}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </>
    );
  },
);
