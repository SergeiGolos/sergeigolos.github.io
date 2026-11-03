import { component$, type QRL } from "@builder.io/qwik";

interface TimelineBreakProps {
  /** How many timeline entries the active filters hide in this run. */
  count: number;
  /** The hidden run's own time span, e.g. "Mar 2022 – Apr 2024". */
  span: string;
  /** Clears every active filter, restoring the full timeline. */
  onClear$: QRL<() => void>;
}

/**
 * A visible break in the timeline feed wherever the active filters hide a
 * run of entries, so a filtered feed doesn't read as one continuous history.
 * Mirrors Page's content-column indentation.
 */
export default component$<TimelineBreakProps>((props) => {
  return (
    <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
      <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
        <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
          <div class="py-6">
            <div class="flex items-center gap-3">
              <div class="min-w-4 flex-1 border-t border-dashed border-gray-300 dark:border-white/20" />
              <p class="text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                {props.count} {props.count === 1 ? "entry" : "entries"} hidden
                {" · "}
                {props.span}
              </p>
              <div class="min-w-4 flex-1 border-t border-dashed border-gray-300 dark:border-white/20" />
            </div>
            <div class="mt-3 text-center">
              <button
                type="button"
                onClick$={props.onClear$}
                class="rounded-full bg-sky-600 px-3 py-1 text-xs text-white hover:bg-sky-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
