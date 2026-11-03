import {
  component$,
  useSignal,
  $,
  useComputed$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import Page from "~/components/Page";
import Present from "~/components/Present";
import { timeline } from "~/components/resume";
import TimelineSearch from "~/components/TimelineSearch";
import {
  extractFilterData,
  getInitialFilterState,
  filterTimeline,
  filtersFromSearchParams,
  filtersToSearchParams,
  type FilterState,
} from "~/components/filter-utils";

export default component$(() => {
  const filterData = extractFilterData(timeline);
  const filterState = useSignal<FilterState>(getInitialFilterState(timeline));

  const handleFilterChange = $((newFilters: FilterState) => {
    filterState.value = newFilters;
    // Keep the URL in sync so a filtered view can be copied and shared.
    const query = filtersToSearchParams(newFilters, timeline);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query}${window.location.hash}`,
    );
  });

  const clearFilters = $(() => {
    handleFilterChange(getInitialFilterState(timeline));
  });

  // On first view, pick up any filters encoded in the URL.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (window.location.search) {
      const fromUrl = filtersFromSearchParams(window.location.search, timeline);
      filterState.value = fromUrl;
    }
  });

  const sortedTimeline = useComputed$(() => {
    return [...filterTimeline(timeline, filterState.value)].sort(function (a, b) {
      return a.startDate > b.startDate ? -1 : 1;
    });
  });

  return (
    <>
      <Present />
      <TimelineSearch
        filterData={filterData}
        filterState={filterState.value}
        resultCount={sortedTimeline.value.length}
        totalCount={timeline.length}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      {sortedTimeline.value.length > 0 ? (
        sortedTimeline.value.map((job, index) => (
          <Page {...job} key={`${job.startDate}-${job.name}-${index}`} />
        ))
      ) : (
        <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
          <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
            <div class="mx-auto max-w-lg py-12 text-center lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
              <div class="text-gray-500 dark:text-gray-400">
                <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  No results found
                </h3>
                <p class="text-sm">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  type="button"
                  onClick$={clearFilters}
                  class="mt-4 rounded-full bg-sky-600 px-4 py-1.5 text-sm text-white hover:bg-sky-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
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
