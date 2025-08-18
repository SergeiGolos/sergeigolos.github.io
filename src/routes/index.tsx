import { component$, useSignal, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import Page from "~/components/Page";
import Present from "~/components/Present";
import { timeline } from "~/components/resume";
import CompactFilterBar from "~/components/CompactFilterBar";
import { extractFilterData, getInitialFilterState, filterTimeline, type FilterState } from "~/components/filter-utils";
import type { TimeLineEntryProperties } from "~/components/TimeLineEntryProperties";

export default component$(() => {
  const filteredTimeline = useSignal<TimeLineEntryProperties[]>(timeline);
  const filterData = extractFilterData(timeline);
  const filterState = useSignal<FilterState>(getInitialFilterState(timeline));

  const handleFilterChange = $((newFilters: FilterState) => {
    filterState.value = newFilters;
    const filtered = filterTimeline(timeline, newFilters);
    filteredTimeline.value = filtered;
  });

  const sortedTimeline = filteredTimeline.value.sort(function (a, b) {
    return a.startDate > b.startDate ? -1 : 1;
  });

  return (
    <>
      <Present />
      <CompactFilterBar
        filterData={filterData}
        filterState={filterState.value}
        onFilterChange={handleFilterChange}
      />
      {sortedTimeline.length > 0 ? (
        sortedTimeline.map((job, index) => (
          <Page {...job} key={`${job.startDate}-${job.name}-${index}`} />
        ))
      ) : (
        <div class="py-12 text-center">
          <div class="text-gray-500 dark:text-gray-400">
            <svg
              class="mx-auto mb-4 h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <h3 class="mb-2 text-lg font-medium">No results found</h3>
            <p class="text-sm">
              Try adjusting your filters to see more results.
            </p>
          </div>
        </div>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Engineer, Developer, Leader",
  meta: [
    {
      name: "Resume: Sergei Golos",
      content: "The digital resume of Sergei Golos",
    },
  ],
};
