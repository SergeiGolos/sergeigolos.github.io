import {
  component$,
  useSignal,
  useComputed$,
  $,
  type QRL,
} from "@builder.io/qwik";
import {
  FaAsteriskSolid,
  FaBoltSolid,
  FaBriefcaseSolid,
  FaBuildingSolid,
  FaCalendarSolid,
  FaCheckSolid,
  FaChevronDownSolid,
  FaDiagramProjectSolid,
  FaMagnifyingGlassSolid,
  FaXmarkSolid,
} from "@qwikest/icons/font-awesome";
import type { FilterData, FilterState } from "./filter-utils";

interface TimelineSearchProps {
  filterData: FilterData;
  filterState: FilterState;
  resultCount: number;
  totalCount: number;
  onFilterChange: QRL<(newFilters: FilterState) => void>;
  onClearFilters: QRL<() => void>;
}

type SuggestionKind = "company" | "skill";
interface Suggestion {
  kind: SuggestionKind;
  value: string;
}

type ActiveFilterKind = "company" | "skill" | "type" | "years";
interface ActiveFilter {
  kind: ActiveFilterKind;
  value: string;
  label: string;
}

const TYPE_OPTIONS: { value: string | null; label: string }[] = [
  { value: null, label: "All" },
  { value: "work", label: "Work" },
  { value: "project", label: "Projects" },
];

const pillCls =
  "bg-white/95 shadow-sm ring-1 ring-gray-900/10 backdrop-blur dark:bg-gray-900/95 dark:ring-white/15";
const menuCls =
  "absolute top-full mt-2 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/10 dark:bg-gray-900 dark:ring-white/10";

export default component$<TimelineSearchProps>(
  ({
    filterData,
    filterState,
    resultCount,
    totalCount,
    onFilterChange,
    onClearFilters,
  }) => {
    const suggestionsOpen = useSignal(false);
    const typeOpen = useSignal(false);
    const filtersOpen = useSignal(false);
    const activeIndex = useSignal(-1);

    const query = filterState.searchText.trim().toLowerCase();
    // A computed signal (not a render-scope variable) so event handlers,
    // whose closures can lag a render behind, always see the current list.
    const suggestions = useComputed$<Suggestion[]>(() => {
      const q = filterState.searchText.trim().toLowerCase();
      if (q.length === 0) return [];
      return [
        ...filterData.companies
          .filter(
            (c) =>
              c.toLowerCase().includes(q) &&
              !filterState.companies.includes(c),
          )
          .slice(0, 4)
          .map((value): Suggestion => ({ kind: "company", value })),
        ...filterData.technologies
          .filter(
            (t) =>
              t.toLowerCase().includes(q) &&
              !filterState.technologies.includes(t),
          )
          .slice(0, 4)
          .map((value): Suggestion => ({ kind: "skill", value })),
      ];
    });

    const currentType =
      filterState.types.length === 1 ? filterState.types[0] : null;

    const minYear = Math.min(...filterData.years);
    const maxYear = Math.max(...filterData.years);
    const yearsActive =
      filterState.yearRange[0] !== minYear ||
      filterState.yearRange[1] !== maxYear;

    // Everything currently filtering the timeline, as one flat list.
    // The count badge and the popover both read from this list, so the
    // number always matches the rows that can be removed inside.
    const activeFilters: ActiveFilter[] = [
      ...filterState.companies.map(
        (value): ActiveFilter => ({ kind: "company", value, label: value }),
      ),
      ...filterState.technologies.map(
        (value): ActiveFilter => ({ kind: "skill", value, label: value }),
      ),
      ...(currentType !== null
        ? [
            {
              kind: "type",
              value: currentType,
              label: currentType === "work" ? "Work" : "Projects",
            } as ActiveFilter,
          ]
        : []),
      ...(yearsActive
        ? [
            {
              kind: "years",
              value: "years",
              label: `${filterState.yearRange[0]} – ${filterState.yearRange[1]}`,
            } as ActiveFilter,
          ]
        : []),
    ];

    // Right padding for the input, sized to the in-box controls that
    // are currently showing (clear-text ×, Clear, filter count).
    const inputPad =
      activeFilters.length > 0
        ? filterState.searchText
          ? "pr-[7rem]"
          : "pr-24"
        : filterState.searchText
          ? "pr-9"
          : "pr-3";

    const closeMenus = $(() => {
      suggestionsOpen.value = false;
      typeOpen.value = false;
      filtersOpen.value = false;
      activeIndex.value = -1;
    });

    const handleFocusOut = $((event: FocusEvent, element: HTMLElement) => {
      if (!element.contains(event.relatedTarget as Node | null)) {
        closeMenus();
      }
    });

    const setSearch = $((event: Event) => {
      const target = event.target as HTMLInputElement;
      onFilterChange({ ...filterState, searchText: target.value });
      suggestionsOpen.value = true;
      activeIndex.value = -1;
    });

    const pickSuggestion = $((suggestion: Suggestion) => {
      if (suggestion.kind === "company") {
        onFilterChange({
          ...filterState,
          companies: [...filterState.companies, suggestion.value],
          searchText: "",
        });
      } else {
        onFilterChange({
          ...filterState,
          technologies: [...filterState.technologies, suggestion.value],
          searchText: "",
        });
      }
      suggestionsOpen.value = false;
      activeIndex.value = -1;
      document.getElementById("timeline-search")?.focus();
    });

    const removeFilter = $((filter: ActiveFilter) => {
      if (filter.kind === "company") {
        onFilterChange({
          ...filterState,
          companies: filterState.companies.filter((c) => c !== filter.value),
        });
      } else if (filter.kind === "skill") {
        onFilterChange({
          ...filterState,
          technologies: filterState.technologies.filter(
            (t) => t !== filter.value,
          ),
        });
      } else if (filter.kind === "type") {
        onFilterChange({ ...filterState, types: [] });
      } else {
        onFilterChange({
          ...filterState,
          yearRange: [minYear, maxYear],
        });
      }
    });

    const setType = $((value: string | null) => {
      onFilterChange({
        ...filterState,
        types: value === null ? [] : [value],
      });
      typeOpen.value = false;
      document.getElementById("timeline-search")?.focus();
    });

    const handleKeyDown = $((event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenus();
        return;
      }
      if (!suggestionsOpen.value || suggestions.value.length === 0) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        activeIndex.value =
          event.key === "ArrowDown"
            ? (activeIndex.value + 1) % suggestions.value.length
            : activeIndex.value <= 0
              ? suggestions.value.length - 1
              : activeIndex.value - 1;
        // Keep the caret at the end of the text (arrow keys would
        // otherwise also move it to the start/end of the input).
        const input = event.target as HTMLInputElement;
        const end = input.value.length;
        input.setSelectionRange(end, end);
      } else if (event.key === "Enter" && activeIndex.value >= 0) {
        pickSuggestion(suggestions.value[activeIndex.value]);
      }
    });

    return (
      <div
        class="fixed top-4 right-[4.5rem] left-4 z-40 sm:left-auto"
        onFocusOut$={handleFocusOut}
      >
        <div class="flex w-full items-center gap-1.5 sm:w-auto sm:gap-2">
          {/* Type dropdown: * = All, briefcase = Work, diagram = Projects */}
          <div class="relative shrink-0">
            <button
              type="button"
              class={`flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-gray-700 dark:text-gray-200 ${pillCls}`}
              aria-haspopup="listbox"
              aria-expanded={typeOpen.value}
              aria-label="Filter by entry type"
              onClick$={() => {
                typeOpen.value = !typeOpen.value;
                suggestionsOpen.value = false;
                filtersOpen.value = false;
              }}
            >
              {currentType === "work" ? (
                <FaBriefcaseSolid class="h-4 w-4" />
              ) : currentType === "project" ? (
                <FaDiagramProjectSolid class="h-4 w-4" />
              ) : (
                <FaAsteriskSolid class="h-4 w-4" />
              )}
              <FaChevronDownSolid class="h-2.5 w-2.5 opacity-60" />
            </button>
            {typeOpen.value && (
              <ul
                role="listbox"
                aria-label="Entry type"
                class="fixed inset-x-4 top-16 overflow-hidden rounded-xl bg-white py-1.5 shadow-lg ring-1 ring-gray-900/10 sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-40 dark:bg-gray-900 dark:ring-white/10"
              >
                {TYPE_OPTIONS.map((option) => {
                  const selected = currentType === option.value;
                  return (
                    <li key={option.label}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        class={`flex w-full items-center gap-2.5 px-3 py-2 text-sm ${
                          selected
                            ? "bg-sky-50 text-sky-800 dark:bg-sky-500/10 dark:text-sky-200"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                        onClick$={() => setType(option.value)}
                      >
                        {option.value === "work" ? (
                          <FaBriefcaseSolid class="h-4 w-4 shrink-0" />
                        ) : option.value === "project" ? (
                          <FaDiagramProjectSolid class="h-4 w-4 shrink-0" />
                        ) : (
                          <FaAsteriskSolid class="h-4 w-4 shrink-0" />
                        )}
                        <span class="flex-1 text-left">{option.label}</span>
                        {selected && <FaCheckSolid class="h-3 w-3" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Search with company / skill typeahead */}
          <div class="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <FaMagnifyingGlassSolid class="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              id="timeline-search"
              type="search"
              value={filterState.searchText}
              onInput$={setSearch}
              onFocus$={() => {
                suggestionsOpen.value = true;
                typeOpen.value = false;
                filtersOpen.value = false;
              }}
              onClick$={() => {
                suggestionsOpen.value = true;
                typeOpen.value = false;
                filtersOpen.value = false;
              }}
              onKeyDown$={handleKeyDown}
              placeholder="Search or pick a company / skill…"
              aria-label="Search the timeline"
              aria-expanded={suggestionsOpen.value && query.length > 0}
              aria-controls="timeline-suggestions"
              class={`h-10 w-full rounded-lg ${inputPad} pl-9 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden ${pillCls}`}
            />
            {suggestionsOpen.value && query.length > 0 && (
              <div id="timeline-suggestions" class={`${menuCls} right-0 left-0`}>
                {suggestions.value.length === 0 ? (
                  <p class="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                    No matching company or skill — the text still searches
                    everything.
                  </p>
                ) : (
                  <ul role="listbox" aria-label="Filter suggestions" class="py-1.5">
                    {suggestions.value.map((suggestion, index) => {
                      const active = index === activeIndex.value;
                      return (
                        <li key={`${suggestion.kind}-${suggestion.value}`}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            class={`flex w-full items-center gap-2.5 px-3 py-1.5 text-sm ${
                              active
                                ? "bg-sky-50 text-sky-900 dark:bg-sky-500/10 dark:text-sky-100"
                                : "text-gray-700 dark:text-gray-200"
                            }`}
                            onMouseOver$={() => {
                              activeIndex.value = index;
                            }}
                            onClick$={() => pickSuggestion(suggestion)}
                          >
                            {suggestion.kind === "company" ? (
                              <FaBuildingSolid class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            ) : (
                              <FaBoltSolid class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            )}
                            <span class="flex-1 truncate text-left">
                              {suggestion.value}
                            </span>
                            <span class="text-[0.65rem] font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                              {suggestion.kind === "company"
                                ? "Company"
                                : "Skill"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
            {/* In-box controls on the input's right edge: clear-text,
                Clear (all filters), and the active-filter count whose
                popover lists every filter with its own remove button. */}
            {(filterState.searchText || activeFilters.length > 0) && (
              <div class="absolute inset-y-0 right-1.5 flex items-center gap-1">
                {filterState.searchText && (
                  <button
                    type="button"
                    aria-label="Clear search text"
                    class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick$={() => {
                      onFilterChange({ ...filterState, searchText: "" });
                      document.getElementById("timeline-search")?.focus();
                    }}
                  >
                    <FaXmarkSolid class="h-3.5 w-3.5" />
                  </button>
                )}
                {activeFilters.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick$={onClearFilters}
                      class="rounded-md px-1.5 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
                    >
                      Clear
                    </button>
                    <div class="relative">
                      <button
                        type="button"
                        class="flex items-center gap-0.5 rounded-full bg-sky-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-sky-500"
                        aria-haspopup="dialog"
                        aria-expanded={filtersOpen.value}
                        aria-label={`${activeFilters.length} active filters`}
                        onClick$={() => {
                          filtersOpen.value = !filtersOpen.value;
                          suggestionsOpen.value = false;
                          typeOpen.value = false;
                        }}
                      >
                        {activeFilters.length}
                        <FaChevronDownSolid class="h-2 w-2 opacity-80" />
                      </button>
                      {filtersOpen.value && (
                        <div
                          role="dialog"
                          aria-label="Active filters"
                          class="fixed top-16 right-4 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/10 sm:absolute sm:top-full sm:right-0 sm:mt-3 sm:w-72 dark:bg-gray-900 dark:ring-white/10"
                        >
                    <div class="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 dark:border-white/10">
                      <p class="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        Active filters
                      </p>
                      <p class="text-xs text-gray-400" role="status">
                        {resultCount} of {totalCount} entries
                      </p>
                    </div>
                    <ul class="max-h-80 overflow-y-auto py-1.5">
                      {activeFilters.map((filter) => (
                        <li
                          key={`${filter.kind}-${filter.value}`}
                          class="flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
                        >
                          {filter.kind === "company" ? (
                            <FaBuildingSolid class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          ) : filter.kind === "skill" ? (
                            <FaBoltSolid class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          ) : filter.kind === "type" ? (
                            filter.value === "work" ? (
                              <FaBriefcaseSolid class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            ) : (
                              <FaDiagramProjectSolid class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            )
                          ) : (
                            <FaCalendarSolid class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          )}
                          <span class="flex-1 truncate">{filter.label}</span>
                          <span class="text-[0.65rem] font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                            {filter.kind === "company"
                              ? "Company"
                              : filter.kind === "skill"
                                ? "Skill"
                                : filter.kind === "type"
                                  ? "Type"
                                  : "Years"}
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${filter.label} filter`}
                            class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick$={() => removeFilter(filter)}
                          >
                            <FaXmarkSolid class="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
