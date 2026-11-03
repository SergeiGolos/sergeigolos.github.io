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

    const isFiltered =
      filterState.types.length > 0 ||
      filterState.companies.length > 0 ||
      filterState.technologies.length > 0 ||
      filterState.searchText !== "";

    const chips: Suggestion[] = [
      ...filterState.companies.map(
        (value): Suggestion => ({ kind: "company", value }),
      ),
      ...filterState.technologies.map(
        (value): Suggestion => ({ kind: "skill", value }),
      ),
    ];

    const closeMenus = $(() => {
      suggestionsOpen.value = false;
      typeOpen.value = false;
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

    const removeChip = $((chip: Suggestion) => {
      if (chip.kind === "company") {
        onFilterChange({
          ...filterState,
          companies: filterState.companies.filter((c) => c !== chip.value),
        });
      } else {
        onFilterChange({
          ...filterState,
          technologies: filterState.technologies.filter(
            (t) => t !== chip.value,
          ),
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
        class="fixed top-4 right-[7.5rem] left-4 z-40 flex flex-col items-end gap-2 sm:left-auto"
        onFocusOut$={handleFocusOut}
      >
        <div class="flex w-full items-center gap-2 sm:w-auto">
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
                class={`${menuCls} right-0 w-40 py-1.5`}
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
              }}
              onClick$={() => {
                suggestionsOpen.value = true;
                typeOpen.value = false;
              }}
              onKeyDown$={handleKeyDown}
              placeholder="Search or pick a company / skill…"
              aria-label="Search the timeline"
              aria-expanded={suggestionsOpen.value && query.length > 0}
              aria-controls="timeline-suggestions"
              class={`h-10 w-full rounded-lg pr-8 pl-9 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden ${pillCls}`}
            />
            {filterState.searchText && (
              <button
                type="button"
                aria-label="Clear search text"
                class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick$={() => {
                  onFilterChange({ ...filterState, searchText: "" });
                  document.getElementById("timeline-search")?.focus();
                }}
              >
                <FaXmarkSolid class="h-3.5 w-3.5" />
              </button>
            )}
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
          </div>
        </div>

        {/* Active selections */}
        {isFiltered && (
          <div class="flex max-w-full flex-wrap items-center justify-end gap-1.5">
            <span class="text-xs text-gray-500 dark:text-white/50" role="status">
              {resultCount} of {totalCount}
            </span>
            {chips.map((chip) => (
              <span
                key={`${chip.kind}-${chip.value}`}
                class="flex items-center gap-1.5 rounded-full bg-sky-600 py-1 pr-1.5 pl-2.5 text-xs whitespace-nowrap text-white dark:bg-sky-500"
              >
                {chip.kind === "company" ? (
                  <FaBuildingSolid class="h-3 w-3" />
                ) : (
                  <FaBoltSolid class="h-3 w-3" />
                )}
                {chip.value}
                <button
                  type="button"
                  aria-label={`Remove ${chip.value} filter`}
                  class="p-0.5 hover:text-sky-200"
                  onClick$={() => removeChip(chip)}
                >
                  <FaXmarkSolid class="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick$={onClearFilters}
              class="rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-gray-900/10 hover:text-sky-900 dark:bg-gray-900/95 dark:text-sky-300 dark:ring-white/15 dark:hover:text-sky-200"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    );
  },
);
